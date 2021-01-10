/**
 * Carries out common database operations for the Roster API using promise-mysql.
 * @author Andrew Barron
 */

'use strict';
let connection;
require('dotenv').config();

/**
 * Initialises the manager with a database connection.
 * @param conn The database connection to use.
 */
function init(conn) {
    connection = conn;
}

/**
 * Get basic data from about an entity from the database.
 * @param type {string} The type of entity to get information about - "sponsors", "people", "shows"
 * @param uuid {Array<string>} An array of UUIDs to retrieve information about.
 * @param fields {Array<string>} An array of the field names you wish to retrieve.
 */
function getBasicData(type, uuid, fields = []) {
    let fieldsString;
    if (fields.length > 0) {
        // Format fields requested for SQL
        fieldsString = fields.reduce((out, next) => {
            return out + ", " + next;
        })
    } else {
        // Get all fields
        fieldsString = "*";
    }

    // Format multiple UUIDs for SQL
    let uuidString = uuid.reduce((out, next) => {
        return out + " OR id = " + next;
    })

    return connection.query("SELECT " + fieldsString + " FROM " + type + " WHERE id = " + uuidString);
}

module.exports = {init, getBasicData};

