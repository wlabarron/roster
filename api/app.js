/**
 * Roster API.
 * @author Andrew Barron
 * @see https://github.com/wlabarron/roster/wiki/API
 */

'use strict';
const db = require(__dirname + '/src/dbmanager');
const dayjs = require("dayjs");
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
    const schedule = require('./src/schedule');
    schedule.init(db);

    app.get('/api/:type', (req, res) => {
        if (req.query["id"]) {
            // If one ID is requested, put it into an array of its own
            if (typeof req.query["id"] === "string") {
                req.query["id"] = [req.query["id"]];
            }

            switch (req.params["type"]) {
                case "sponsors":
                    sponsors.get(req.query["id"]).then(data => {
                        res.set("Cache-Control", "public, max-age=3600"); // cache response for an hour
                        sendJson(data, res);
                    });
                    break;
                case "people":
                    people.get(req.query["id"]).then(data => {
                        res.set("Cache-Control", "public, max-age=3600"); // cache response for an hour
                        sendJson(data, res);
                    });
                    break;
                case "shows":
                    shows.get(req.query["id"]).then(data => {
                        res.set("Cache-Control", "public, max-age=3600"); // cache response for an hour
                        sendJson(data, res);
                    });
                    break;
                case "images":
                    images.get(req.query["id"]).then(data => {
                        res.set("Cache-Control", "public, max-age=3600"); // cache response for an hour
                        sendJson(data, res);
                    });
                    break;
            }
        } else if (req.params["type"] === "schedule") {
            let from, to;

            if (req.query["from"]) {
                // `from` specified
                from = req.query["from"];

                // `to` not specified, default to 24hr from the `from` time
                if (!req.query["to"]) {
                    to = dayjs(req.query["from"], "YYYY-MM-DD-HH-mm").add(86400, "seconds").format("YYYY-MM-DD-HH-mm");
                }
            } else {
                // `from` not specified, default to now
                from = dayjs().format("YYYY-MM-DD-HH-mm");

                // `to` not specified, default to 00:00 tomorrow (23:59 today + 1 minute)
                if (!req.query["to"]) {
                    to = dayjs().endOf('day').add(1, "minute").format("YYYY-MM-DD-HH-mm");
                }
            }

            // `to` specified
            if (req.query["to"]) {
                to = req.query["to"];
            }
            schedule.getShows(from, to, req.query["detail"]).then(data => {
                if (data) {
                    let from = dayjs(Object.values(data)[0].from);
                    let to = dayjs(Object.values(data)[0].to);
                    let now = dayjs();
                    let diff;

                    // Calculate how many seconds away the next schedule event is
                    if (from.isAfter(now)) { // The show has started
                        diff = from.diff(now, "s");
                    } else { // The show has not yet started
                        diff = to.diff(now, "s");
                    }

                    if (diff > 3600) {// The next schedule event is more than 1 hour away
                        res.set("Cache-Control", "public, max-age=3600"); // cache response for 1 hour
                    } else {
                        res.set("Cache-Control", "public, max-age=" + diff); // cache response until schedule changes
                    }
                }
                sendJson(data, res);
            });
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



