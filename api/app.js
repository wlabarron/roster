/**
 * Roster API.
 * @author Andrew Barron
 * @see https://github.com/wlabarron/roster/wiki/API
 */

'use strict';
const db = require(__dirname + '/src/dbmanager');
require('dotenv').config();

/**
 * Starts the API system and prepares its endpoints.
 * @param connection A database connection from the promise-mysql package.
 */
function start(connection) {
    const express = require('express');
    const app = express();

    db.init(connection);

    const sponsors = require(__dirname + '/src/sponsors');
    sponsors.init(db);

    app.get('/api/sponsors', (req, res) => {
        // If one UUID is requested, put it into an array of its own
        if (typeof req.query["uuid"] === "string") {
            req.query["uuid"] = [req.query["uuid"]];
        }

        sponsors.get(req.query["uuid"])
            .then(data => {
                if (data !== null) {
                    res.json(data);
                } else {
                    res.status(400);
                }

                res.end();
            })
    });

    // Start server on port in env variables, default to port 3000 if not set
    const port = process.env.PORT | 3000
    app.listen(port, () => {
        console.log("API server listening on port " + port + ".");
    });
}

// Create a database connection, then start the web server parts
db.connect().then(connection => start(connection))



