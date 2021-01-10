'use strict';

const images = require("../src/images");
const db = require("../src/dbmanager");

/**
 * Initialise sponsors API with a database connection.
 */
beforeAll(() => {
    // Create a database connection, then start the web server parts
    return db.connect().then(connection => {
        db.init(connection)
        images.init(db);
    });
});

test('Request an image with invalid ID', () => {
    return images.get("argh").then(img => {
        expect(img).toBe(null);
    });
})

test('Request an image which doesn\'t exist', () => {
    return images.get("01234567891234567").then(img => {
        expect(img).toBe(null);
    });
})

test('Request an image', () => {
    return images.get("99066300793356293").then(img => {
        expect(img).toStrictEqual({
            "url": "https://via.placeholder.com/750.png",
            "alt": "Andrew smiles at the camera, with headphones around his neck."
        });
    });
})