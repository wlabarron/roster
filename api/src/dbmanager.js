/**
 * Carries out common database operations for the Roster API using promise-mysql.
 * @author Andrew Barron
 */

'use strict';
let connection;
const mysql = require('promise-mysql');
const common = require("./common");
require('dotenv').config();

/**
 * Create a database connection based on environment variables or the .env file.
 * @returns {<Connection>} The promise of a database connection.
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
 * Get basic data from about an entity from the database.
 * @param type {string} The type of entity to get information about - "sponsors", "people", "shows"
 * @param id {Array<string>} An array of IDs to retrieve information about.
 */
function getBasicData(type, id) {
    // Format multiple IDs for SQL
    let idString = id.reduce((out, next) => {
        return out + " OR id = " + next;
    })

    // Choose the correct query based on whether we have a specific ID or we want to get everything
    if (idString === "all") {
        return query("SELECT * FROM " + type);
    } else {
        return query("SELECT * FROM " + type + " WHERE id = " + idString);
    }

}

function query(sql) {
    return connection.query(sql);
}

module.exports = {connect, init, getBasicData, query};

