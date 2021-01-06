/**
 * Creates database connections for the Roster API.
 * @author Andrew Barron
 */

'use strict';

const mysql = require('promise-mysql');
require('dotenv').config();

function init() {
    return mysql.createConnection({
        host: process.env.DATABASE_SERVER,
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD
    });
}

module.exports = {init};

