/**
 * Carries out common database operations for the Roster API using promise-mysql.
 * @author Andrew Barron
 */

'use strict';
let connection;
const mysql = require('promise-mysql');
const common = require('./common');
require('dotenv').config();

/**
 * Create a database connection based on environment variables or the .env file.
 * @returns The promise of a database connection.
 */
function connect() {
    return mysql.createConnection({
        host: process.env.DATABASE_SERVER,
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        supportBigNumbers: true,
        bigNumberStrings: true,
    })
}

/**
 * Initialises the manager with a database connection.
 * @param conn The database connection to use.
 */
function init(conn) {
    connection = conn;
}

/**
 * Converts an array of show IDs and nicknames into a SQL clause, like "id = 123456 OR nick = 'breakfast'.
 * @param idColumn {String} The name of the column containing numerical IDs.
 * @param nickColumn {String} The name of the column containing show nicknames.
 * @param id {String[]} An array of IDs to format into a where clause.
 * @returns {String} A SQL clause like "id = 123456 OR nick = 'breakfast'.
 */
function idsToSqlWhere(idColumn, nickColumn, id) {
    return id.reduce((out, next) => {
        if (common.validateID(next)) {// numeric ID provided
            return out + " OR " + idColumn + " = " + next;
        } else { // nickname provided (or nonsense, but hopefully a nickname)
            // Crush nickname to lowercase and strip all characters except a-z.
            next = next.toLowerCase().replace(/[^a-z]/g, '');
            return out + " OR " + nickColumn + " = '" + next + "'";
        }
    }, "").slice(4); // slice the unneeded " OR " from the start of the produced string
}

/**
 * Get basic data from about an entity from the database.
 * @param type {string} The type of entity to get information about - "sponsors", "people", "shows"
 * @param id {Array<string>} An array of IDs to retrieve information about.
 */
function getBasicData(type, id) {
    if (id[0] === "all") { // requesting all info
        return query("SELECT * FROM " + type);
    }

    // Format multiple IDs for SQL
    let idString = idsToSqlWhere("id", "nick", id)

    return query("SELECT * FROM " + type + " WHERE " + idString);
}

/**
 * Returns scheduling information for all shows which MAY start and/or finish between the request start and end dates.
 * The shows returned may not all occur within the time period, so be sure to check the specifics of any recurrence
 * rules.
 * @param requestStart {String} Start of the timeframe to retrieve, in format "YYYY-MM-DD".
 * @param requestEnd {String} End of the timeframe to retrieve, in format "YYYY-MM-DD".
 * @param id {String[]} Array of show IDs or nicknames, or null. If provided, only details about shows listed in this
 *                        array will be returned.
 */
function getTimes(requestStart, requestEnd, id = null) {
    let times = [
        requestStart, requestEnd,
        requestStart, requestEnd,
        requestStart, requestEnd
    ]

    if (id) {
        let idString = idsToSqlWhere("`show`", "nick", id);
        return query("SELECT *, nick FROM times JOIN shows s on times.`show` = s.id  WHERE recurrence_start BETWEEN ? AND ? OR recurrence_end BETWEEN ? AND ? OR (recurrence_start < ? AND recurrence_end > ? AND " + idString + ");",
            times);
    } else {
        return query("SELECT * FROM times WHERE recurrence_start BETWEEN ? AND ? OR recurrence_end BETWEEN ? AND ? OR (recurrence_start < ? AND recurrence_end > ?);",
            times);
    }
}

function query(sql, values = null) {
    return connection.query(sql, values);
}

module.exports = {connect, init, getBasicData, query, getTimes};

