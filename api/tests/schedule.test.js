'use strict';

const schedule = require("../src/schedule");
const db = require("../src/dbmanager");
const dayjs = require('dayjs');

/**
 * Initialise people API with a database connection.
 */
beforeAll(() => {
    return db.connect().then(connection => {
        db.init(connection);
        schedule.init(db);
    })
});

test("Parse the start time of some shows", () => {
    expect(
        schedule.calculateStart({
            "start_time": "14:00"
        }, "2020-11-14").format()
    ).toBe("2020-11-14T14:00:00+00:00")

    expect(
        schedule.calculateStart({
            "start_time": "00:00"
        }, "2022-04-08").format()
    ).toBe("2022-04-08T00:00:00+01:00")

    expect(
        schedule.calculateStart({
            "start_time": "23:30"
        }, "2050-09-29").format()
    ).toBe("2050-09-29T23:30:00+01:00")
});

test("Parse the end time of some shows", () => {
    expect(
        schedule.calculateEnd({
            "start_time": "14:00",
            "duration": 3600
        }, "2020-11-14").format()
    ).toBe("2020-11-14T15:00:00+00:00")

    expect(
        schedule.calculateEnd({
            "start_time": "00:00",
            "duration": 16200
        }, "2022-04-08").format()
    ).toBe("2022-04-08T04:30:00+01:00")

    expect(
        schedule.calculateEnd({
            "start_time": "23:30",
            "duration": 5400
        }, "2050-09-29").format()
    ).toBe("2050-09-30T01:00:00+01:00")
});

test("Get low-detail information about a show occurrence", () => {
    let december26at9am = dayjs("2020-12-26T09:00:00+00:00");
    let december26at1030am = dayjs("2020-12-26T10:30:00+00:00");

    return schedule.prepareShowInfo("99066300793356290", december26at9am, december26at1030am, false).then(data => {
        expect(data)
            .toStrictEqual({
                from: "2020-12-26T09:00:00+00:00",
                to: "2020-12-26T10:30:00+00:00",
                detail: {
                    id: "99066300793356290"
                }
            })
    })
});

test("Get high-detail information about a show occurrence", () => {
    let december26at9am = dayjs("2020-12-26T09:00:00+00:00");
    let december26at1030am = dayjs("2020-12-26T10:30:00+00:00");

    return schedule.prepareShowInfo("99066300793356290", december26at9am, december26at1030am, true).then(data => {
        expect(data)
            .toStrictEqual({
                from: "2020-12-26T09:00:00+00:00",
                to: "2020-12-26T10:30:00+00:00",
                detail: {
                    id: "99066300793356290",
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

test("Calculate a one-off show occurrence and get low-detail information about it", () => {
    let december25at9am = dayjs("2020-12-25T09:00:00+00:00");
    let december27at1030am = dayjs("2020-12-27T10:30:00+00:00");

    return schedule.scheduleOnce({
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        recurrence_start: "2020-12-26",
        recurrence_end: "2020-12-26"
    }, december25at9am, december27at1030am, false).then(data => {
        expect(data).toStrictEqual({
            from: "2020-12-26T09:00:00+00:00",
            to: "2020-12-26T10:30:00+00:00",
            detail: {
                id: "99066300793356290"
            }
        })
    })
});

test("Calculate a one-off show occurrence and get high-detail information about it", () => {
    let december25at9am = dayjs("2020-12-25T09:00:00+00:00");
    let december27at1030am = dayjs("2020-12-27T10:30:00+00:00");

    return schedule.scheduleOnce({
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        recurrence_start: "2020-12-26",
        recurrence_end: "2020-12-26"
    }, december25at9am, december27at1030am, true).then(data => {
        expect(data).toStrictEqual({
            from: "2020-12-26T09:00:00+00:00",
            to: "2020-12-26T10:30:00+00:00",
            detail: {
                id: "99066300793356290",
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

test("Calculate a one-off show occurrence which starts but doesn't finish in the request period", () => {
    let december26at9am = dayjs("2020-12-26T09:00:00+00:00");
    let december26at10am = dayjs("2020-12-26T10:00:00+00:00");

    return schedule.scheduleOnce({
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        recurrence_start: "2020-12-26",
        recurrence_end: "2020-12-26"
    }, december26at9am, december26at10am, false).then(data => {
        expect(data).toStrictEqual({
            from: "2020-12-26T09:00:00+00:00",
            to: "2020-12-26T10:30:00+00:00",
            detail: {
                id: "99066300793356290"
            }
        })
    })
});

test("Calculate a one-off show occurrence which finishes but doesn't start in the request period", () => {
    let december26at930am = dayjs("2020-12-26T09:30:00+00:00");
    let december26at11am = dayjs("2020-12-26T11:00:00+00:00");

    return schedule.scheduleOnce({
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        recurrence_start: "2020-12-26",
        recurrence_end: "2020-12-26"
    }, december26at930am, december26at11am, false).then(data => {
        expect(data).toStrictEqual({
            from: "2020-12-26T09:00:00+00:00",
            to: "2020-12-26T10:30:00+00:00",
            detail: {
                id: "99066300793356290"
            }
        })
    })
});

test("Calculate a one-off show occurrence which doesn't occur in the request period", () => {
    let december27at9am = dayjs("2020-12-27T09:00:00+00:00");
    let december31at1030am = dayjs("2020-12-31T10:30:00+00:00");

    return schedule.scheduleOnce({
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        recurrence_start: "2020-12-26",
        recurrence_end: "2020-12-26"
    }, december27at9am, december31at1030am, true).then(data => {
        expect(data).toBe(null)
    })
});

test("Calculate a regularly-recurring show and get low-detail information about it", () => {
    let january1at0am = dayjs("2021-01-01T00:00:00+00:00");
    let january31at1159pm = dayjs("2021-01-31T23:59:00+00:00");

    return schedule.scheduleEvery({
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        recurrence_period: "7",
        recurrence_start: "2020-12-19",
        recurrence_end: "2021-01-23"
    }, january1at0am, january31at1159pm, false).then(data => {
        expect(data).toStrictEqual([
            {
                from: "2021-01-02T09:00:00+00:00",
                to: "2021-01-02T10:30:00+00:00",
                detail: {
                    id: "99066300793356290"
                }
            },
            {
                from: "2021-01-09T09:00:00+00:00",
                to: "2021-01-09T10:30:00+00:00",
                detail: {
                    id: "99066300793356290"
                }
            },
            {
                from: "2021-01-16T09:00:00+00:00",
                to: "2021-01-16T10:30:00+00:00",
                detail: {
                    id: "99066300793356290"
                }
            },
            {
                from: "2021-01-23T09:00:00+00:00",
                to: "2021-01-23T10:30:00+00:00",
                detail: {
                    id: "99066300793356290"
                }
            }
        ])
    })
});

test("Calculate a regularly-recurring show and get high-detail information about it", () => {
    let january1at0am = dayjs("2021-01-01T00:00:00+00:00");
    let january3at1159pm = dayjs("2021-01-03T23:59:00+00:00");

    return schedule.scheduleEvery({
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        recurrence_period: "7",
        recurrence_start: "2021-01-02",
        recurrence_end: "2021-01-23"
    }, january1at0am, january3at1159pm, true).then(data => {
        expect(data).toStrictEqual([{
            from: "2021-01-02T09:00:00+00:00",
            to: "2021-01-02T10:30:00+00:00",
            detail: {
                id: "99066300793356290",
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
        }])
    })
});