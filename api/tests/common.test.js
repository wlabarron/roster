'use strict';

const common = require('../src/common');
const validateFields = common.createFieldValidator(["nick", "name", "description", "email", "profileImage", "coverImage", "url"]);

test('Check if "all" is treated as a valid UUID', () => {
    expect(common.validateUUID("all")).toBe(true);
});

test('Check if various numbers are treated as valid UUIDs', () => {
    expect(common.validateUUID("12345678901234567")).toBe(true);
    expect(common.validateUUID("27346501345608324")).toBe(true);
    expect(common.validateUUID("89726345809723459")).toBe(true);
    expect(common.validateUUID("98716523598785921")).toBe(true);
    expect(common.validateUUID("23458435787692874")).toBe(true);
    expect(common.validateUUID("29783546872634576")).toBe(true);
});

test('Check if various invalid UUIDs are rejected correctly', () => {
    // variations of "all"
    expect(common.validateUUID("a l l")).toBe(false);
    expect(common.validateUUID("notall")).toBe(false);
    expect(common.validateUUID("allbutone")).toBe(false);

    // too short
    expect(common.validateUUID("2978354687263457")).toBe(false);

    // too long
    expect(common.validateUUID("297835468726345765")).toBe(false);

    // valid, but padded with invalid characters
    expect(common.validateUUID("a29783546872634576")).toBe(false);
    expect(common.validateUUID("29783546872634576 ")).toBe(false);
    expect(common.validateUUID(" 29783546872634576")).toBe(false);
    expect(common.validateUUID("29783546872634576 ")).toBe(false);

    // Simon and Garfunkel
    expect(common.validateUUID(" ")).toBe(false);
    expect(common.validateUUID("")).toBe(false);
    expect(common.validateUUID()).toBe(false);

    // random strings
    expect(common.validateUUID("frankie")).toBe(false);
    expect(common.validateUUID("help me I'm stuck in a test writing factory and can't get out")).toBe(false);
    expect(common.validateUUID("twoHundredAndFortySeven")).toBe(false);
});


test('Check various valid sets of fields to request are handled correctly', () => {
    // Map, mapping inputs to expected outputs
    let sets = new Map();
    sets.set(["nick"],
        ["nick"]);
    sets.set(["nick", "name"],
        ["nick", "name"]);
    sets.set(["nick", "name", "description"],
        ["nick", "name", "description"]);
    sets.set(["nick", "name", "description", "email"],
        ["nick", "name", "description", "email"]);
    sets.set(["nick", "name", "description", "email", "profileImage"],
        ["nick", "name", "description", "email", "profileImage"]);
    sets.set(["nick", "name", "description", "email", "profileImage", "coverImage"],
        ["nick", "name", "description", "email", "profileImage", "coverImage"]);
    sets.set(["nick", "name", "description", "email", "profileImage", "coverImage", "url"],
        ["nick", "name", "description", "email", "profileImage", "coverImage", "url"]);
    sets.set(["nick", "name", "email", "profileImage", "url"],
        ["nick", "name", "email", "profileImage", "url"]);
    sets.set(["nick", "name", "description", "email", "profileImage", "coverImage", "url"],
        ["nick", "name", "description", "email", "profileImage", "coverImage", "url"]);
    sets.set(["name", "description", "profileImage", "coverImage", "url"],
        ["name", "description", "profileImage", "coverImage", "url"]);
    sets.set(["description", "email", "url"],
        ["description", "email", "url"]);

    for (const input of sets.keys()) {
        // Expect the set to be treated as valid and return correctly
        expect(validateFields(input)).toStrictEqual(sets.get(input));
    }
})

test('Check various valid sets of fields which are incorrectly ordered are reordered and treated as valid', () => {
    // Map, mapping inputs to expected outputs
    let sets = new Map();
    sets.set(["name", "nick"],
        ["nick", "name"]);
    sets.set(["url", "coverImage", "profileImage", "email", "description", "name", "nick"],
        ["nick", "name", "description", "email", "profileImage", "coverImage", "url"]);

    for (const input of sets.keys()) {
        // Expect the set to be treated as valid and return correctly
        expect(validateFields(input)).toStrictEqual(sets.get(input));
    }
})

test('Check invalid fields are removed during validation', () => {
    // Map, mapping inputs to expected outputs
    let sets = new Map();
    sets.set(["nick", "frank"],
        ["nick"]);
    sets.set(["nick", "help me I'm stuck in a test factory", "name"],
        ["nick", "name"]);
    sets.set(["I can't tell what's JavaScript and real life any more", "nick", "name", "description"],
        ["nick", "name", "description"]);

    for (const input of sets.keys()) {
        // Expect the set to be treated as valid and return correctly
        expect(validateFields(input)).toStrictEqual(sets.get(input));
    }
})

test('Check various types of emptiness are treated correctly', () => {
    expect(validateFields([])).toStrictEqual([]);
    expect(validateFields("")).toStrictEqual([]);
})