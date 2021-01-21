/**
 * Facilitates reading of schedule information by the Roster API.
 * @author Andrew Barron
 * @see https://github.com/wlabarron/roster/wiki/API:-Sponsors
 */

'use strict';

const shows = require('./shows');
const dayjs = require('dayjs');

dayjs.extend(require('dayjs/plugin/customParseFormat'));
dayjs.extend(require('dayjs/plugin/isSameOrBefore'));
dayjs.extend(require('dayjs/plugin/isBetween'));

let db;

/**
 * Initialise the schedule handler with a database connection.
 * @param dbConnection The database connection to use.
 */
function init(dbConnection) {
    db = dbConnection;
    shows.init(db);
}

/**
 * Creates a Day.js object representing the start time of a show on a date.
 * @param {Object} show A show object from the database. Most importantly, needs an item keyed "start_time" with a time in format HH:mm.
 * @param {String} date The date the show starts on, in format YYYY-MM-DD.
 * @returns {dayjs.Dayjs} A Day.js object representing the start time on the given date.
 */
function calculateStart(show, date) {
    let start = dayjs(date, "YYYY-MM-DD");
    let time = show["start_time"].split(":");
    start = start.hour(time[0]).minute(time[1]).millisecond(0);
    return start;
}

/**
 * Creates a Day.js object representing the end time of a show on a date.
 * @param {Object} show A show object from the database. Most importantly, needs an item keyed "start_time" with a time
 *                      in format HH:mm and an item keyed "duration" with the show duration in seconds.
 * @param {String} date The date the show starts on, in format YYYY-MM-DD.
 * @returns {dayjs.Dayjs} A Day.js object representing the end time for the show on the given date.
 */
function calculateEnd(show, date) {
    // Calculate the show start
    let end = calculateStart(show, date);

    return end.add(show["duration"], "second");
}


/**
 * Returns an array of promise results.
 * @param promises The promises to wait on.
 * @returns {Promise<[]>} The promise of an array of values.
 */
function settlePromises(promises) {
    return Promise.allSettled(promises).then(data => {
        // Once all the show detail promises are settled, prepare a nice results array
        let results = [];
        for (const item of data) {
            results.push(item.value);
        }

        return results;
    });
}

/**
 * Returns an object containing information about a show on a specific date, according to the API specification.
 * @see https://github.com/wlabarron/roster/wiki/API:-Schedule
 * @param show {String} ID of the show.
 * @param start {*|dayjs.Dayjs} Day.js object representing the start time of the show.
 * @param end {*|dayjs.Dayjs} Day.js object representing the end time of the show.
 * @param detail {boolean} true for all show information to be returned, otherwise false.
 * @return {Promise} A promise of the information object.
 */
function prepareShowInfo(show, start, end, detail) {
    return new Promise(resolve => {
        let showInfo = {
            from: start.format(),
            to: end.format(),
            detail: {
                id: show
            }
        }

        if (detail) {
            // Get show info and add it to showInfo.detail
            shows.get([show]).then(data => {
                Object.assign(showInfo.detail, data[show]);
                resolve(showInfo);
            });
        } else {
            resolve(showInfo);
        }
    })
}

/**
 * Processes a one-off show, if it is between the request start and end dates. If the show is not due to happen between
 * the requestStart and requestEnd periods, then an empty object is returned.
 * @param {Object} show A show object from the database. Needs an item keyed "start_time" with a time
 *                      in format HH:mm, an item keyed "duration" with the show duration in seconds, an item keyed
 *                      "recurrence_start" with the start date of the show, an item keyed "recurrence_end" with the end
 *                      date of the show.
 * @param requestStart {dayjs.Dayjs} Object representing the start date of the request period.
 * @param requestEnd {dayjs.Dayjs} Object representing the end date of the request period.
 * @param detail {boolean} true for all show information to be returned, otherwise false.
 * @returns {Promise} A promise of an object complying with the API with information about the show, or null if the show
 *                   is not due to happen within the request period.
 */
function scheduleOnce(show, requestStart, requestEnd, detail) {
    let showStart = calculateStart(show, show["recurrence_start"]);
    let showEnd = calculateEnd(show, show["recurrence_end"]);

    if (showStart.isBetween(requestStart, requestEnd, null, "[[") || showEnd.isBetween(requestStart, requestEnd, null, "[[")) {
        return prepareShowInfo(show.id, showStart, showEnd, detail)
    } else {
        return new Promise(resolve => {
            resolve(null)
        });
    }
}

/**
 * Processes a regularly recurring show, returning all occurrences between requestStart and requestEnd. If the show is
 * not due to happen between the requestStart and requestEnd periods, then an empty object is returned.
 * @param {Object} show A show object from the database. Needs an item keyed "start_time" with a time
 *                      in format HH:mm, an item keyed "duration" with the show duration in seconds, an item keyed
 *                      "recurrence_start" with the start date of the show, an item keyed "recurrence_end" with the end
 *                      date of the show, and an item keyed "recurrence_period" with the number of days between each
 *                      occurrence (e.g. "7" for 1 week).
 * @param requestStart {dayjs.Dayjs} Object representing the start date of the request period.
 * @param requestEnd {dayjs.Dayjs} Object representing the end date of the request period.
 * @param detail {boolean} true for all show information to be returned, otherwise false.
 * @returns {Promise} A promise of an array of objects complying with the API with information about the show, or empty array
 *                   if the show is not due to happen within the request period.
 */
function scheduleEvery(show, requestStart, requestEnd, detail) {
    // Calculate the start time of the first ever show, the date of the last show, and get the recurrence period as a number
    let showStart = calculateStart(show, show["recurrence_start"]);
    let recurrenceEnd = dayjs(show["recurrence_end"], "YYYY-MM-DD");
    let period = parseInt(show["recurrence_period"])

    let showDetailPromises = [];

    // Working through each show occurrence now. While the start time of a given occurrence is before the end of the
    // request period and the given occurrence is before the end of the recurrence set itself
    while (showStart.isSameOrBefore(requestEnd) && showStart.isSameOrBefore(recurrenceEnd, "day")) {
        let showEnd = calculateEnd(show, showStart.format("YYYY-MM-DD"));

        // Check if the show times are within the request period
        if (showStart.isBetween(requestStart, requestEnd, null, "[[") || showEnd.isBetween(requestStart, requestEnd, null, "[[")) {
            // Add a promise for information about the show to an array.
            showDetailPromises.push(prepareShowInfo(show.id, showStart, showEnd, detail));
        }

        // Move on to the next potential occurrence
        showStart = showStart.add(period, "day");
    }

    return settlePromises(showDetailPromises);
}

/**
 * Processes a show occurring on a given day of the month (such as the 3rd Friday), returning all occurrences between
 * requestStart and requestEnd. If the show is not due to happen between the requestStart and requestEnd periods, then
 * an empty array is returned.
 * @param {Object} show A show object from the database. Needs an item keyed "start_time" with a time
 *                      in format HH:mm, an item keyed "duration" with the show duration in seconds, an item keyed
 *                      "recurrence_start" with the start date of the show, an item keyed "recurrence_end" with the end
 *                      date of the show, and an item keyed "recurrence_period" containing two comma-separated values --
 *                      the first value being the day the event happens on (0 = Sunday, 6 = Saturday) and the second being
 *                      on which week of the month it happens (3 being the 3rd whatever-day of the month).
 * @param requestStart {dayjs.Dayjs} Object representing the start date of the request period.
 * @param requestEnd {dayjs.Dayjs} Object representing the end date of the request period.
 * @param detail {boolean} true for all show information to be returned, otherwise false.
 * @returns {Promise} A promise of an array of objects complying with the API with information about the show, or empty array
 *                   if the show is not due to happen within the request period.
 */
function scheduleFromStartOfMonth(show, requestStart, requestEnd, detail) {
    let period = show["recurrence_period"].split(",");
    let targetDay = period[0];
    let dayOfMonth = period[1] - 1; // subtract one since 1st Friday means 0 jumps forward from the 1 first Friday,
                                    // 2nd Friday means 1 jump forward from the first Friday, etc

    let recurrenceStart = dayjs(show["recurrence_start"], "YYYY-MM-DD");
    let recurrenceEnd = dayjs(show["recurrence_end"], "YYYY-MM-DD");

    let showDetailPromises = [];

    // Initial date to start working from
    let potentialDate = requestStart.startOf("month");

    while (potentialDate.isSameOrBefore(recurrenceEnd, "day") && potentialDate.isSameOrBefore(requestEnd, "day")) {
        // Get the first day of the month, and note the month we're working in
        let firstDay = potentialDate.day();
        let workingMonth = potentialDate.month();

        // We now need to move from the 1st of the month, to the first occurrence of the target day:
        // i.e. move from the 1st of January to the 1st Friday in January
        if (firstDay === targetDay) {
            // Already there!
        } else if (firstDay > targetDay) { // First day is after the target day (e.g. month starts on Friday, we want Wednesday)
            // Move forward to the first Sunday
            potentialDate = potentialDate.day(7);
            // Move to the first occurrence of the target day
            potentialDate = potentialDate.day(targetDay);
        } else { // First day is before the target day (e.g. month starts on Wednesday, we want Friday)
            // Move to the first occurrence of the target day
            potentialDate = potentialDate.day(targetDay);
        }

        // Now, we need to move the the nth occurrence of that day - e.g. moving from the 1st Friday to the 3rd Friday
        potentialDate = potentialDate.add(dayOfMonth, "week");

        // Check that the jumping forward X weeks hasn't put us into the next month. If it has, discard this attempt.
        if (potentialDate.month() === workingMonth) {
            // Check if a show is due to happen on that day, based on the recurrence start and end dates
            if (potentialDate.isBetween(recurrenceStart, recurrenceEnd, "day", "[[")) {
                let showStart = calculateStart(show, potentialDate.format("YYYY-MM-DD"));
                let showEnd = calculateEnd(show, potentialDate.format("YYYY-MM-DD"))

                // Check if the show times are within the request period
                if (showStart.isBetween(requestStart, requestEnd, null, "[[") || showEnd.isBetween(requestStart, requestEnd, null, "[[")) {
                    // Add a promise for information about the show to an array.
                    showDetailPromises.push(prepareShowInfo(show.id, showStart, showEnd, detail));
                }
            }
        }

        // Create a new dayjs object on the first of next month, ready to keep working through
        potentialDate = dayjs().year(potentialDate.year()).month(workingMonth + 1).startOf("month");
    }

    return settlePromises(showDetailPromises);
}

module.exports = {
    init,
    calculateStart,
    calculateEnd,
    prepareShowInfo,
    scheduleOnce,
    scheduleEvery,
    scheduleFromStartOfMonth
}