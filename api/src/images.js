/**
 * Facilitates handling of images in the Roster API.
 * @author Andrew Barron
 * @see https://github.com/wlabarron/roster/wiki/API:-Sponsors
 */

'use strict';

const common = require(__dirname + '/common');

let db;

/**
 * Initialise the image handler with a database connection.
 * @param dbConnection The database connection to use.
 */
function init(dbConnection) {
    db = dbConnection;
}

/**
 * Get details of an image based on its UUID.
 * @param {string} uuid The UUID of the image to retrieve.
 */
function get(uuid) {
    if (common.validateUUID(uuid)) {
        return db.getBasicData("images", [uuid]).then(rows => {
            if (rows.length === 1) {
                return {
                    "url": rows[0].url,
                    "alt": rows[0].alt
                }
            } else {
                // No image found
                return null;
            }
        });
    } else {
        return new Promise(resolve => {
            resolve(null);
        });
    }
}

module.exports = {init, get}