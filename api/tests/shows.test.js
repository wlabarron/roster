'use strict';

const shows = require("../src/shows");
const db = require("../src/dbmanager");

/**
 * Initialise sponsors API with a database connection.
 */
beforeAll(() => {
    return db.connect().then(connection => {
        db.init(connection);
        shows.init(db);
    })
});

test('Get details about an invalid ID', () => {
    return shows.get(["invalid"]).then(data => {
        expect(data).toBe(null);
    })
});

test('Get details about a non-existent ID', () => {
    return shows.get(["01234567891234567"]).then(data => {
        expect(data).toBe(null);
    })
});

test('Get details about a show using its ID', () => {
    return shows.get(["99066300793356290"]).then(data => {
        expect(data).toStrictEqual({
            '99066300793356290': {
                nick: 'satbreak',
                name: 'Saturday Breakfast',
                tagline: 'Wake up to the weekend with a great mix of music.',
                description: 'Since 2015, Andrew has been starting your weekend off with a great mix of feel-good music, from the latest chart-topping tunes to the golden oldies you love.',
                email: null,
                profileImage: {
                    url: 'https://via.placeholder.com/750.png',
                    alt: 'Andrew smiles at the camera, with headphones around his neck.'
                },
                coverImage: {
                    url: 'https://via.placeholder.com/1200x750.png',
                    alt: 'The sun rises over the mountains'
                },
                url: null,
                people: {
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
                        url: null,
                        role: "Presenter"
                    }
                },
                sponsors: {
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
                                "url": "https://www.facebook.com/speedytaxis"
                            },
                            '99075283969114116': {
                                "name": "Twitter",
                                "url": "https://twitter.com/speedytaxis"
                            }
                        },
                        detail: "Sponsors Song from a Soundtrack"
                    }
                }
            }
        })
    })
});

test('Get details about two show using their IDs', () => {
    return shows.get(["99066300793356290", "99066300793356291"]).then(data => {
        expect(data).toStrictEqual({
                '99066300793356290': {
                    nick: 'satbreak',
                    name: 'Saturday Breakfast',
                    tagline: 'Wake up to the weekend with a great mix of music.',
                    description: 'Since 2015, Andrew has been starting your weekend off with a great mix of feel-good music, from the latest chart-topping tunes to the golden oldies you love.',
                    email: null,
                    profileImage: {
                        url: 'https://via.placeholder.com/750.png',
                        alt: 'Andrew smiles at the camera, with headphones around his neck.'
                    },
                    coverImage: {
                        url: 'https://via.placeholder.com/1200x750.png',
                        alt: 'The sun rises over the mountains'
                    },
                    url: null,
                    people: {
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
                            url: null,
                            role: "Presenter"
                        }
                    },
                    sponsors: {
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
                                    "url": "https://www.facebook.com/speedytaxis"
                                },
                                '99075283969114116': {
                                    "name": "Twitter",
                                    "url": "https://twitter.com/speedytaxis"
                                }
                            },
                            detail: "Sponsors Song from a Soundtrack"
                        }
                    }
                },
                '99066300793356291': {
                    nick: 'weekend',
                    name: 'Weekend Wogan',
                    tagline: 'Join Sir Terry Wogan for live music and musings every Sunday morning.',
                    description: 'Weekend Wogan was originally broadcast in front of a studio audience, but moved to a studio after the first year.',
                    email: 'weekendwogan@bbc.co.uk',
                    profileImage: null,
                    coverImage: null,
                    url: null,
                    people: {
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
                            },
                            role: "Presenter"
                        },
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
                            url: null,
                            role: "Producer"
                        }
                    },
                    sponsors: null
                }
            }
        )
    })
});

test('Get details about all shows', () => {
    return shows.get(["all"]).then(data => {
        expect(data).toStrictEqual({
            '99066300793356290': {
                nick: 'satbreak',
                name: 'Saturday Breakfast',
                tagline: 'Wake up to the weekend with a great mix of music.',
                description: 'Since 2015, Andrew has been starting your weekend off with a great mix of feel-good music, from the latest chart-topping tunes to the golden oldies you love.',
                email: null,
                profileImage: {
                    url: 'https://via.placeholder.com/750.png',
                    alt: 'Andrew smiles at the camera, with headphones around his neck.'
                },
                coverImage: {
                    url: 'https://via.placeholder.com/1200x750.png',
                    alt: 'The sun rises over the mountains'
                },
                url: null,
                people: {
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
                        url: null,
                        role: "Presenter"
                    }
                },
                sponsors: {
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
                                "url": "https://www.facebook.com/speedytaxis"
                            },
                            '99075283969114116': {
                                "name": "Twitter",
                                "url": "https://twitter.com/speedytaxis"
                            }
                        },
                        detail: "Sponsors Song from a Soundtrack"
                    }
                }
            },
            '99066300793356291': {
                nick: 'weekend',
                name: 'Weekend Wogan',
                tagline: 'Join Sir Terry Wogan for live music and musings every Sunday morning.',
                description: 'Weekend Wogan was originally broadcast in front of a studio audience, but moved to a studio after the first year.',
                email: 'weekendwogan@bbc.co.uk',
                profileImage: null,
                coverImage: null,
                url: null,
                people: {
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
                        },
                        role: "Presenter"
                    },
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
                        url: null,
                        role: "Producer"
                    }
                },
                sponsors: null
            }
        })
    })
});
