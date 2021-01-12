'use strict';

const common = require('../src/common');

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