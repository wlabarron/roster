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

    const sponsors = require('./src/sponsors');
    sponsors.init(db);
    const people = require('./src/people');
    people.init(db);
    const shows = require('./src/shows');
    shows.init(db);
    const images = require('./src/images');
    images.init(db);

    app.get('/api/:type', (req, res) => {
        if (req.query["id"]) {
            // If one ID is requested, put it into an array of its own
            if (typeof req.query["id"] === "string") {
                req.query["id"] = [req.query["id"]];
            }

            switch (req.params["type"]) {
                case "sponsors":
                    sponsors.get(req.query["id"]).then(data => sendJson(data, res))
                    break;
                case "people":
                    people.get(req.query["id"]).then(data => sendJson(data, res))
                    break;
                case "shows":
                    shows.get(req.query["id"]).then(data => sendJson(data, res))
                    break;
                case "images":
                    images.get(req.query["id"]).then(data => sendJson(data, res))
                    break;
            }

        } else {
            res.status(400);
            res.end()
        }
    });

    // Start server on port in env variables, default to port 3000 if not set
    const port = process.env.PORT | 3000
    app.listen(port, () => {
        console.log("API server listening on port " + port + ".");
    });
}

/**
 * Sends the specified object as JSON, or status 400 if the object is null.
 * @param object The object to convert to JSON and send.
 * @param res The response object to send over.
 */
function sendJson(object, res) {
    if (object !== null) {
        res.json(object);
    } else {
        res.status(400);
    }
    res.end();
}

// Create a database connection, then start the web server parts
db.connect().then(connection => start(connection))



