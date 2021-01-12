'use strict';

const urls = require("../src/urls");
const db = require("../src/dbmanager");

/**
 * Initialise sponsors API with a database connection.
 */
beforeAll(() => {
    // Create a database connection, then start the web server parts
    return db.connect().then(connection => {
        db.init(connection)
        urls.init(db);
    });
});

test('Request related URLs using an invalid type', () => {
    return urls.get("argh", "99066300793356292").then(url => {
        expect(url).toBe(null);
    });
})

test('Request related URLs to an invalid UUID', () => {
    return urls.get("sponsor", "argh").then(url => {
        expect(url).toBe(null);
    });
})

test('Request related URLs to a non-existent UUID', () => {
    return urls.get("sponsor", "12345678901234567").then(url => {
        expect(url).toBe(null);
    });
})

test('Request a URLs related to a sponsor', () => {
    return urls.get("sponsor", "99066300793356292").then(url => {
        expect(url).toStrictEqual({
            "99075283969114114": {
                "name": "Facebook",
                "url": "https://www.facebook.com/speedytaxis"
            },
            "99075283969114116": {
                "name": "Twitter",
                "url": "https://twitter.com/speedytaxis"
            }
        });
    });
})

// TODO tests for other types
// TODO tests for valid types and UUID but with no related images