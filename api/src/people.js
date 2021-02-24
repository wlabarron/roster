/**
 * Facilitates handling of sponsor information by the Roster API.
 * @author Andrew Barron
 * @see https://github.com/wlabarron/roster/wiki/API:-Sponsors
 */

'use strict';

const images = require('./images');
const urls = require('./urls');

let db;

/**
 * Initialise the sponsor handler with a database connection.
 * @param dbConnection The database connection to use.
 */
function init(dbConnection) {
    db = dbConnection;
    images.init(db);
    urls.init(db);
}

/**
 * Get details about a sponsor.
 * @param {Array<string>} ids Array of IDs of sponsor you want information about.
 * @returns {PromiseLike<{}> | Promise<{}>} A promise of the information.
 */
function get(ids) {
    return db.getBasicData("people", ids).then(rows => {
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
                urls.get("people", row.id)
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
                            "description": row.description,
                            "email": row.email,
                            "profileImage": values[0],
                            "coverImage": values[1],
                            "url": values[2]
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

module.exports = { init, get };