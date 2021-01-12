/**
 * Common functions used across the Roster API.
 * @author Andrew Barron
 * @see https://github.com/wlabarron/roster/
 */

'use strict';

/**
 * Checks that the passed ID is of a valid form (but not that it exists in the given context).
 * @param {string} id The ID to check.
 * @returns {boolean} true if the ID is formed correctly, otherwise false.
 */
function validateID(id) {
    // "all" is valid to return all information
    // otherwise, check the ID against the regex for a well-formed ID
    return id === "all" || /^[0-9]{17}$/.test(id);
}

module.exports = {validateID};