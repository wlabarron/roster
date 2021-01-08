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

/**
 * Creates a function to check if a given array of fields matches an approved set of field names.
 *
 * The returned function takes one parameter, an array of fields. Values which are not on the valid list are removed
 * (checked using a case-insensitive match with whitespace trimmed), and a new array of normalised field names in the
 * same order as the list of valid field names is returned. If nothing valid is found, an empty array is returned.
 * @param {Array<string>} validFieldNames The array of field names which are valid, in the order and case you expect
 * the array to check to be normalised to.
 * @returns {function(fields:Array<string>)} A validator function based on the set of valid field names.
 */
function createFieldValidator(validFieldNames) {
    return function validateFields(fields) {
        // Check fields are of correct type and not empty.
        if (Object.prototype.toString.call(fields) !== "[object Array]" ||
            fields.length < 1) {
            return [];
        }

        // Normalise fields for comparing
        let normalisedFields = fields.map(value => {
            return value.trim().toLowerCase();
        });

        let finalisedFields = [];

        // Work through all of the valid field names, checking if the set of fields requested includes that specific
        // valid field name. If it does, add the field name to the array of finalised fields. Otherwise, ignore it and
        // move on.
        validFieldNames.forEach((validFieldName) => {
            if (normalisedFields.includes(validFieldName.toLowerCase())) {
                finalisedFields.push(validFieldName);
            }
        })

        return finalisedFields;
    }
}

module.exports = {validateUUID, createFieldValidator};