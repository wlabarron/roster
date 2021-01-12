'use strict';

const common = require('../src/common');

test('Check if "all" is treated as a valid ID', () => {
    expect(common.validateID("all")).toBe(true);
});

test('Check if various numbers are treated as valid IDs', () => {
    expect(common.validateID("12345678901234567")).toBe(true);
    expect(common.validateID("27346501345608324")).toBe(true);
    expect(common.validateID("89726345809723459")).toBe(true);
    expect(common.validateID("98716523598785921")).toBe(true);
    expect(common.validateID("23458435787692874")).toBe(true);
    expect(common.validateID("29783546872634576")).toBe(true);
});

test('Check if various invalid IDs are rejected correctly', () => {
    // variations of "all"
    expect(common.validateID("a l l")).toBe(false);
    expect(common.validateID("notall")).toBe(false);
    expect(common.validateID("allbutone")).toBe(false);

    // too short
    expect(common.validateID("2978354687263457")).toBe(false);

    // too long
    expect(common.validateID("297835468726345765")).toBe(false);

    // valid, but padded with invalid characters
    expect(common.validateID("a29783546872634576")).toBe(false);
    expect(common.validateID("29783546872634576 ")).toBe(false);
    expect(common.validateID(" 29783546872634576")).toBe(false);
    expect(common.validateID("29783546872634576 ")).toBe(false);

    // Simon and Garfunkel
    expect(common.validateID(" ")).toBe(false);
    expect(common.validateID("")).toBe(false);
    expect(common.validateID()).toBe(false);

    // random strings
    expect(common.validateID("frankie")).toBe(false);
    expect(common.validateID("help me I'm stuck in a test writing factory and can't get out")).toBe(false);
    expect(common.validateID("twoHundredAndFortySeven")).toBe(false);
});