/**
 * Facilitates handling of show information by the Roster API.
 * @author Andrew Barron
 * @see https://github.com/wlabarron/roster/wiki/API:-Sponsors
 */

'use strict';

const common = require('./common');
const images = require('./images');
const urls = require('./urls');
const people = require('./people');
const sponsors = require('./sponsors');

let db;

/**
 * Initialise the sponsor handler with a database connection.
 * @param dbConnection The database connection to use.
 */
function init(dbConnection) {
    db = dbConnection;
    images.init(db);
    urls.init(db);
    people.init(db);
    sponsors.init(db);
}

/**
 * Get details of people related to the specified show ID.
 * @param {string} showID The ID of the show whose related people you wish to retrieve.
 */
function getPeople(showID) {
    if (common.validateID(showID)) {
        let roles = {};

        return db.query("SELECT DISTINCT p.id, rel_shows_people.role FROM people, rel_shows_people LEFT JOIN people p on rel_shows_people.person = p.id WHERE rel_shows_people.`show` = " + showID + ";")
            .then(rows => {
                if (rows.length > 0) {
                    // Make an array of IDs of people related to the show
                    // Also, record the person's role and ID in the roles object
                    let ids = [];
                    for (const row of rows) {
                        ids.push(row.id);
                        roles[row.id] = row.role;
                    }

                    return people.get(ids);
                } else {
                    return null;
                }
            }).then(results => {
                if (results) {
                    // Add each person's role to the results object
                    for (let id of Object.keys(results)) {
                        results[id]["role"] = roles[id];
                    }
                }

                return results;
            });
    } else {
        return new Promise(resolve => {
            resolve(null);
        });
    }
}

/**
 * Get details of sponsors related to the specified sponsor ID.
 * @param {string} showID The ID of the show whose related sponsors you wish to retrieve.
 */
function getSponsors(showID) {
    if (common.validateID(showID)) {
        let detail = {};

        return db.query("SELECT DISTINCT s.id, rel_shows_sponsors.detail FROM sponsors, rel_shows_sponsors LEFT JOIN sponsors s on rel_shows_sponsors.sponsor = s.id WHERE rel_shows_sponsors.`show` = " + showID + ";")
            .then(rows => {
                if (rows.length > 0) {
                    // Make an array of IDs of sponsors related to the show
                    // Also, record the sponsor's extra details and ID in the details object
                    let ids = [];
                    for (const row of rows) {
                        ids.push(row.id);
                        detail[row.id] = row.detail;
                    }

                    return sponsors.get(ids);
                } else {
                    return null;
                }
            }).then(results => {
                if (results) {
                    // Add each sponsor's details to the results object
                    for (let id of Object.keys(results)) {
                        results[id]["detail"] = detail[id];
                    }
                }

                return results;
            });
    } else {
        return new Promise(resolve => {
            resolve(null);
        });
    }
}

/**
 * Get details about shows.
 * @param {Array<string>} ids Array of IDs of sponsor you want information about.
 * @returns {PromiseLike<{}> | Promise<{}>} A promise of the information.
 */
function get(ids) {
    return db.getBasicData("shows", ids).then(rows => {
        const data = {};
        const rowPromises = [];

        if (rows.length === 0) {
            return new Promise(resolve => {
                resolve(null);
            });
        }

        // For each row of data
        for (const row of rows) {
            // Prepare further queries for images
            const furtherQueries = [
                images.get(row.profileImage),
                images.get(row.coverImage),
                urls.get("shows", row.id),
                getPeople(row.id),
                getSponsors(row.id)
            ]

            // Add a promise for into an array for information about this row
            rowPromises.push(
                // When all of the further queries for this row are settled
                Promise.all(furtherQueries)
                    .then((values) => {
                        // Add this row's info into the data object
                        data[row.id] = {
                            "nick": row.nick,
                            "name": row.name,
                            "tagline": row.tagline,
                            "description": row.description,
                            "email": row.email,
                            "profileImage": values[0],
                            "coverImage": values[1],
                            "url": values[2],
                            "people": values[3],
                            "sponsors": values[4],
                        };
                    }).catch(error => console.log(error))
            );
        }

        // Once all the row promises are settled, return the formed data object
        return Promise.all(rowPromises).then(() => {
            return data;
        }).catch(error => console.log(error));
    });
}

module.exports = {init, get};