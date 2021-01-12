/**
 * Common functions used across the Roster API.
 * @author Andrew Barron
 * @see https://github.com/wlabarron/roster/
 */

'use strict';

/**
 * Checks that the passed UUID is of a valid form (but not that it exists in the given context).
 * @param {string} uuid The UUID to check.
 * @returns {boolean} true if the UUID is formed correctly, otherwise false.
 */
function validateUUID(uuid) {
    // "all" is valid to return all information
    // otherwise, check the UUID against the regex for a well-formed UUID
    return uuid === "all" || /^[0-9]{17}$/.test(uuid);
}

module.exports = {validateUUID};