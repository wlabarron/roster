'use strict';

const people = require("../src/people");
const db = require("../src/dbmanager");

/**
 * Initialise people API with a database connection.
 */
beforeAll(() => {
    return db.connect().then(connection => {
        db.init(connection);
        people.init(db);
    })
});

test('Get details about an invalid ID', () => {
    return people.get(["invalid"]).then(data => {
        expect(data).toBe(null);
    })
});

test('Get details about a non-existent ID', () => {
    return people.get(["01234567891234567"]).then(data => {
        expect(data).toBe(null);
    })
});

test('Get details about a person using their ID', () => {
    return people.get(["99066300793356288"]).then(data => {
        expect(data).toStrictEqual({
                '99066300793356288': {
                    nick: 'ab',
                    name: 'Andrew Barron',
                    description: "Andrew's been on the airwaves since he was 13, and somehow we still let him have a show!",
                    email: null,
                    profileImage: {
                        url: 'https://via.placeholder.com/750.png',
                        alt: 'Andrew smiles at the camera, with headphones around his neck.'
                    },
                    coverImage: {
                        url: 'https://via.placeholder.com/1200x750.png',
                        alt: 'The sun rises over the mountains'
                    },
                    url: null
                }
            }
        )
    })
});

test('Get details about two people using their IDs', () => {
    return people.get(["99066300793356288", "99066300793356289"]).then(data => {
        expect(data).toStrictEqual({
                '99066300793356288': {
                    nick: 'ab',
                    name: 'Andrew Barron',
                    description: "Andrew's been on the airwaves since he was 13, and somehow we still let him have a show!",
                    email: null,
                    profileImage: {
                        url: 'https://via.placeholder.com/750.png',
                        alt: 'Andrew smiles at the camera, with headphones around his neck.'
                    },
                    coverImage: {
                        url: 'https://via.placeholder.com/1200x750.png',
                        alt: 'The sun rises over the mountains'
                    },
                    url: null
                },
                '99066300793356289': {
                    nick: 'wogan',
                    name: 'Terry Wogan',
                    description: "Terry graced the airwaves from 1956 til 2016, and his name lives on in Wogan House, one of the BBC's buildings in London. ",
                    email: 'wogan@bbc.co.uk',
                    profileImage: null,
                    coverImage: null,
                    url: {
                        '99076705234190336': {
                            "name": "BBC",
                            "url": "https://www.bbc.co.uk"
                        }
                    }
                }
            }
        )
    })
});

test('Get details about everybody', () => {
    return people.get(["all"]).then(data => {
        expect(data).toStrictEqual({
                '99066300793356288': {
                    nick: 'ab',
                    name: 'Andrew Barron',
                    description: "Andrew's been on the airwaves since he was 13, and somehow we still let him have a show!",
                    email: null,
                    profileImage: {
                        url: 'https://via.placeholder.com/750.png',
                        alt: 'Andrew smiles at the camera, with headphones around his neck.'
                    },
                    coverImage: {
                        url: 'https://via.placeholder.com/1200x750.png',
                        alt: 'The sun rises over the mountains'
                    },
                    url: null
                },
                '99066300793356289': {
                    nick: 'wogan',
                    name: 'Terry Wogan',
                    description: "Terry graced the airwaves from 1956 til 2016, and his name lives on in Wogan House, one of the BBC's buildings in London. ",
                    email: 'wogan@bbc.co.uk',
                    profileImage: null,
                    coverImage: null,
                    url: {
                        '99076705234190336': {
                            "name": "BBC",
                            "url": "https://www.bbc.co.uk"
                        }
                    }
                }
            }
        )
    })
});
