/**
 * Facilitates handling of URLs in the Roster API.
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
 * Get details of URLs related to another entity.
 * @param {string} relatedType The type of the entity.
 * @param {string} relatedID The ID of the entity whose related URLs you wish to retrieve.
 */
const validRelatedTypes = ["show", "people", "sponsor"]

function get(relatedType, relatedID) {
    relatedType = relatedType.toLowerCase().trim();

    if (common.validateID(relatedID) &&
        validRelatedTypes.includes(relatedType)) {
        return db.query("SELECT DISTINCT urls.* FROM urls, rel_urls LEFT JOIN urls u on rel_urls.url = u.id WHERE rel_urls." + relatedType + " = " + relatedID + ";")
            .then(rows => {
                // no related images
                if (rows.length === 0) {
                    return null;
                }

                const response = {};

                // For each row of data
                for (const row of rows) {
                    response[row.id] = {
                        "name": row.name,
                        "url": row.url
                    }
                }

                return response;
            })
    } else {
        return new Promise(resolve => {
            resolve(null);
        });
    }
}

module.exports = {init, get}