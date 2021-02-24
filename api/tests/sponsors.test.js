'use strict';

const sponsors = require("../src/sponsors");
const db = require("../src/dbmanager");

/**
 * Initialise sponsors API with a database connection.
 */
beforeAll(() => {
    return db.connect().then(connection => {
        db.init(connection);
        sponsors.init(db);
    })
});

test('Get details about an invalid ID', () => {
    return sponsors.get(["invalid"]).then(data => {
        expect(data).toBe(null);
    })
});

test('Get details about a non-existent ID', () => {
    return sponsors.get(["01234567891234567"]).then(data => {
        expect(data).toBe(null);
    })
});

test('Get details about a sponsor using their ID', () => {
    return sponsors.get(["99066300793356292"]).then(data => {
        expect(Object.keys(data).length).toBe(1);
        expect(data).toStrictEqual({
            '99066300793356292': {
                nick: 'taxi',
                name: 'Speedy Taxis',
                description: "Get where you're going safely and quickly with Speedy Taxis - mention This Radio Station for 10% off!",
                email: 'book@example.com',
                profileImage: {
                    url: 'https://via.placeholder.com/750.png',
                        alt: 'Speedy Taxis'
                    },
                    coverImage: null,
                    url: {
                        '99075283969114114': {
                            "name": "Facebook",
                            "url": "https://www.facebook.com/speedytaxis",
                            "primary": true
                        },
                        '99075283969114116': {
                            "name": "Twitter",
                            "url": "https://twitter.com/speedytaxis",
                            "primary": false
                        }
                    }
                }
            }
        )
    })
});

// TODO test retrieving multiple sponsors