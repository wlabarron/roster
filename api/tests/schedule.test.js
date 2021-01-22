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

    return schedule.prepareShowInfo("99066300793356290", true, december26at9am, december26at1030am, false).then(data => {
        expect(data)
            .toStrictEqual({
                from: "2020-12-26T09:00:00+00:00",
                to: "2020-12-26T10:30:00+00:00",
                detail: {
                    id: "99066300793356290",
                    newShow: true
                }
            })
    })
});

test("Get high-detail information about a show occurrence", () => {
    let december26at9am = dayjs("2020-12-26T09:00:00+00:00");
    let december26at1030am = dayjs("2020-12-26T10:30:00+00:00");

    return schedule.prepareShowInfo("99066300793356290", false, december26at9am, december26at1030am, true).then(data => {
        expect(data)
            .toStrictEqual({
                from: "2020-12-26T09:00:00+00:00",
                to: "2020-12-26T10:30:00+00:00",
                detail: {
                    id: "99066300793356290",
                    newShow: false,
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
        "new_show": false,
        recurrence_start: "2020-12-26",
        recurrence_end: "2020-12-26"
    }, december25at9am, december27at1030am, false).then(data => {
        expect(data).toStrictEqual({
            from: "2020-12-26T09:00:00+00:00",
            to: "2020-12-26T10:30:00+00:00",
            detail: {
                id: "99066300793356290",
                newShow: false
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
        "new_show": true,
        recurrence_start: "2020-12-26",
        recurrence_end: "2020-12-26"
    }, december25at9am, december27at1030am, true).then(data => {
        expect(data).toStrictEqual({
            from: "2020-12-26T09:00:00+00:00",
            to: "2020-12-26T10:30:00+00:00",
            detail: {
                id: "99066300793356290",
                newShow: true,
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
        "new_show": true,
        recurrence_start: "2020-12-26",
        recurrence_end: "2020-12-26"
    }, december26at9am, december26at10am, false).then(data => {
        expect(data).toStrictEqual({
            from: "2020-12-26T09:00:00+00:00",
            to: "2020-12-26T10:30:00+00:00",
            detail: {
                id: "99066300793356290",
                newShow: true
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
        "new_show": true,
        recurrence_start: "2020-12-26",
        recurrence_end: "2020-12-26"
    }, december26at930am, december26at11am, false).then(data => {
        expect(data).toStrictEqual({
            from: "2020-12-26T09:00:00+00:00",
            to: "2020-12-26T10:30:00+00:00",
            detail: {
                id: "99066300793356290",
                newShow: true
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
        "new_show": true,
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
        "new_show": false,
        recurrence_period: "7",
        recurrence_start: "2020-12-19",
        recurrence_end: "2021-01-23"
    }, january1at0am, january31at1159pm, false).then(data => {
        expect(data).toStrictEqual([
            {
                from: "2021-01-02T09:00:00+00:00",
                to: "2021-01-02T10:30:00+00:00",
                detail: {
                    id: "99066300793356290",
                    newShow: false
                }
            },
            {
                from: "2021-01-09T09:00:00+00:00",
                to: "2021-01-09T10:30:00+00:00",
                detail: {
                    id: "99066300793356290",
                    newShow: false
                }
            },
            {
                from: "2021-01-16T09:00:00+00:00",
                to: "2021-01-16T10:30:00+00:00",
                detail: {
                    id: "99066300793356290",
                    newShow: false
                }
            },
            {
                from: "2021-01-23T09:00:00+00:00",
                to: "2021-01-23T10:30:00+00:00",
                detail: {
                    id: "99066300793356290",
                    newShow: false
                }
            }
        ])
    })
});

test("Calculate a regularly-recurring show with an occurrence starting but not finishing within the request frame", () => {
    let january2at8am = dayjs("2021-01-02T08:00:00+00:00");
    let january2at10am = dayjs("2021-01-02T10:00:00+00:00");

    return schedule.scheduleEvery({
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        "new_show": true,
        recurrence_period: "7",
        recurrence_start: "2020-12-19",
        recurrence_end: "2021-01-23"
    }, january2at8am, january2at10am, false).then(data => {
        expect(data).toStrictEqual([
            {
                from: "2021-01-02T09:00:00+00:00",
                to: "2021-01-02T10:30:00+00:00",
                detail: {
                    id: "99066300793356290",
                    newShow: true
                }
            }
        ])
    })
});

test("Calculate a regularly-recurring show with an occurrence finishing but not starting within the request frame", () => {
    let january2at930am = dayjs("2021-01-02T08:09:30+00:00");
    let january2at11am = dayjs("2021-01-02T11:00:00+00:00");

    return schedule.scheduleEvery({
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        "new_show": true,
        recurrence_period: "7",
        recurrence_start: "2020-12-19",
        recurrence_end: "2021-01-23"
    }, january2at930am, january2at11am, false).then(data => {
        expect(data).toStrictEqual([
            {
                from: "2021-01-02T09:00:00+00:00",
                to: "2021-01-02T10:30:00+00:00",
                detail: {
                    id: "99066300793356290",
                    newShow: true
                }
            }
        ])
    })
});

test("Calculate a regularly-recurring show which does not occur within the request frame", () => {
    let january4at930am = dayjs("2021-01-04T08:09:30+00:00");
    let january6at11am = dayjs("2021-01-06T11:00:00+00:00");

    return schedule.scheduleEvery({
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        "new_show": false,
        recurrence_period: "7",
        recurrence_start: "2020-12-19",
        recurrence_end: "2021-01-23"
    }, january4at930am, january6at11am, false).then(data => {
        expect(data).toStrictEqual([])
    })
});

test("Calculate a regularly-recurring show and get high-detail information about it", () => {
    let january1at0am = dayjs("2021-01-01T00:00:00+00:00");
    let january3at1159pm = dayjs("2021-01-03T23:59:00+00:00");

    return schedule.scheduleEvery({
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        "new_show": false,
        recurrence_period: "7",
        recurrence_start: "2021-01-02",
        recurrence_end: "2021-01-23"
    }, january1at0am, january3at1159pm, true).then(data => {
        expect(data).toStrictEqual([{
            from: "2021-01-02T09:00:00+00:00",
            to: "2021-01-02T10:30:00+00:00",
            detail: {
                id: "99066300793356290",
                newShow: false,
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

test("Calculate a show on 2nd Wednesday of month and get low-detail information about it", () => {
    let january1at0am = dayjs("2021-01-01T00:00:00+00:00");
    let january31at1159pm = dayjs("2021-01-31T23:59:00+00:00");

    return schedule.scheduleDayOfMonth("start", {
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        "new_show": true,
        recurrence_period: "3,2",
        recurrence_start: "2020-12-19",
        recurrence_end: "2021-01-23"
    }, january1at0am, january31at1159pm, false).then(data => {
        expect(data).toStrictEqual([
            {
                from: "2021-01-13T09:00:00+00:00",
                to: "2021-01-13T10:30:00+00:00",
                detail: {
                    id: "99066300793356290",
                    newShow: true
                }
            }
        ])
    })
});

test("Calculate a show on 1st Tuesday of month and get low-detail information about it", () => {
    let january1at0am = dayjs("2021-01-01T00:00:00+00:00");
    let may31at1159pm = dayjs("2021-05-31T23:59:00+00:00");

    return schedule.scheduleDayOfMonth("start", {
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        "new_show": false,
        recurrence_period: "2,1",
        recurrence_start: "2020-10-19",
        recurrence_end: "2021-04-29"
    }, january1at0am, may31at1159pm, false).then(data => {
        expect(data).toStrictEqual([
            {
                from: "2021-01-05T09:00:00+00:00",
                to: "2021-01-05T10:30:00+00:00",
                detail: {
                    id: "99066300793356290",
                    newShow: false
                }
            },
            {
                from: "2021-02-02T09:00:00+00:00",
                to: "2021-02-02T10:30:00+00:00",
                detail: {
                    id: "99066300793356290",
                    newShow: false
                }
            },
            {
                from: "2021-03-02T09:00:00+00:00",
                to: "2021-03-02T10:30:00+00:00",
                detail: {
                    id: "99066300793356290",
                    newShow: false
                }
            },
            {
                from: "2021-04-06T09:00:00+01:00",
                to: "2021-04-06T10:30:00+01:00",
                detail: {
                    id: "99066300793356290",
                    newShow: false
                }
            }
        ])
    })
});

test("Calculate a show on 1st Friday of month and get low-detail information about it", () => {
    let january1at0am = dayjs("2021-01-01T00:00:00+00:00");
    let january31at1159pm = dayjs("2021-01-31T23:59:00+00:00");

    return schedule.scheduleDayOfMonth("start", {
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        "new_show": true,
        recurrence_period: "5,1",
        recurrence_start: "2020-12-19",
        recurrence_end: "2021-01-23"
    }, january1at0am, january31at1159pm, false).then(data => {
        expect(data).toStrictEqual([
            {
                from: "2021-01-01T09:00:00+00:00",
                to: "2021-01-01T10:30:00+00:00",
                detail: {
                    id: "99066300793356290",
                    newShow: true
                }
            }
        ])
    })
});

test("Calculate a show on 6th Friday of month (doesn't exist) and get low-detail information about it", () => {
    let january1at0am = dayjs("2021-01-01T00:00:00+00:00");
    let february14at1159pm = dayjs("2021-02-14T23:59:00+00:00");

    return schedule.scheduleDayOfMonth("start", {
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        "new_show": true,
        recurrence_period: "5,6",
        recurrence_start: "2020-12-19",
        recurrence_end: "2021-03-23"
    }, january1at0am, february14at1159pm, false).then(data => {
        expect(data).toStrictEqual([])
    })
});

test("Calculate a show on 3rd Friday of month, starting but not finishing within the request frame", () => {
    let january2at8am = dayjs("2021-01-02T08:00:00+00:00");
    let january15at10am = dayjs("2021-01-15T10:00:00+00:00");

    return schedule.scheduleDayOfMonth("start", {
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        "new_show": false,
        recurrence_period: "5,3",
        recurrence_start: "2020-12-19",
        recurrence_end: "2021-01-23"
    }, january2at8am, january15at10am, false).then(data => {
        expect(data).toStrictEqual([
            {
                from: "2021-01-15T09:00:00+00:00",
                to: "2021-01-15T10:30:00+00:00",
                detail: {
                    id: "99066300793356290",
                    newShow: false
                }
            }
        ])
    })
});

test("Calculate a show on 3rd Friday of month, finishing but not starting within the request frame", () => {
    let january15at930am = dayjs("2021-01-02T08:09:30+00:00");
    let january15at11am = dayjs("2021-01-15T11:00:00+00:00");

    return schedule.scheduleDayOfMonth("start", {
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        new_show: false,
        recurrence_period: "5,3",
        recurrence_start: "2020-12-19",
        recurrence_end: "2021-01-23"
    }, january15at930am, january15at11am, false).then(data => {
        expect(data).toStrictEqual([
            {
                from: "2021-01-15T09:00:00+00:00",
                to: "2021-01-15T10:30:00+00:00",
                detail: {
                    id: "99066300793356290",
                    newShow: false,
                }
            }
        ])
    })
});

test("Calculate a week-of-month show which does not occur within the request frame", () => {
    let january4at930am = dayjs("2021-01-04T08:09:30+00:00");
    let january6at11am = dayjs("2021-01-06T11:00:00+00:00");

    return schedule.scheduleDayOfMonth("start", {
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        "new_show": false,
        recurrence_period: "5,3",
        recurrence_start: "2020-12-19",
        recurrence_end: "2021-01-23"
    }, january4at930am, january6at11am, false).then(data => {
        expect(data).toStrictEqual([])
    })
});

test("Calculate a week-of-month show and get high-detail information about it", () => {
    let january1at0am = dayjs("2021-01-01T00:00:00+00:00");
    let january31at1159pm = dayjs("2021-01-31T23:59:00+00:00");

    return schedule.scheduleDayOfMonth("start", {
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        "new_show": true,
        recurrence_period: "2,4",
        recurrence_start: "2021-01-02",
        recurrence_end: "2021-01-31"
    }, january1at0am, january31at1159pm, true).then(data => {
        expect(data).toStrictEqual([{
            from: "2021-01-26T09:00:00+00:00",
            to: "2021-01-26T10:30:00+00:00",
            detail: {
                id: "99066300793356290",
                newShow: true,
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

test("Calculate a show on 2nd-to-last Wednesday of month and get low-detail information about it", () => {
    let april1at0am = dayjs("2021-04-01T00:00:00+00:00");
    let april30at1159pm = dayjs("2021-04-30T23:59:00+00:00");

    return schedule.scheduleDayOfMonth("end", {
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        "new_show": false,
        recurrence_period: "3,2",
        recurrence_start: "2021-01-19",
        recurrence_end: "2021-06-23"
    }, april1at0am, april30at1159pm, false).then(data => {
        expect(data).toStrictEqual([
            {
                from: "2021-04-21T09:00:00+01:00",
                to: "2021-04-21T10:30:00+01:00",
                detail: {
                    id: "99066300793356290",
                    newShow: false,
                }
            }
        ])
    })
});

test("Calculate a show on last Tuesday of month and get low-detail information about it", () => {
    let april1at0am = dayjs("2021-04-01T00:00:00+00:00");
    let may31at1159pm = dayjs("2021-05-31T23:59:00+00:00");

    return schedule.scheduleDayOfMonth("end", {
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        "new_show": true,
        recurrence_period: "2,1",
        recurrence_start: "2020-10-19",
        recurrence_end: "2021-07-29"
    }, april1at0am, may31at1159pm, false).then(data => {
        expect(data).toStrictEqual([
            {
                from: "2021-04-27T09:00:00+01:00",
                to: "2021-04-27T10:30:00+01:00",
                detail: {
                    id: "99066300793356290",
                    newShow: true
                }
            },
            {
                from: "2021-05-25T09:00:00+01:00",
                to: "2021-05-25T10:30:00+01:00",
                detail: {
                    id: "99066300793356290",
                    newShow: true
                }
            }
        ])
    })
});

test("Calculate a show on last Sunday of month and get low-detail information about it", () => {
    let april1at0am = dayjs("2021-04-01T00:00:00+00:00");
    let april30at1159pm = dayjs("2021-04-30T23:59:00+00:00");

    return schedule.scheduleDayOfMonth("end", {
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        "new_show": true,
        recurrence_period: "0,1",
        recurrence_start: "2020-12-19",
        recurrence_end: "2021-10-23"
    }, april1at0am, april30at1159pm, false).then(data => {
        expect(data).toStrictEqual([
            {
                from: "2021-04-25T09:00:00+01:00",
                to: "2021-04-25T10:30:00+01:00",
                detail: {
                    id: "99066300793356290",
                    newShow: true
                }
            }
        ])
    })
});

test("Calculate a show on 6th-to-last Friday of month (doesn't exist) and get low-detail information about it", () => {
    let january1at0am = dayjs("2021-01-01T00:00:00+00:00");
    let february14at1159pm = dayjs("2021-02-14T23:59:00+00:00");

    return schedule.scheduleDayOfMonth("end", {
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        "new_show": false,
        recurrence_period: "5,6",
        recurrence_start: "2020-12-19",
        recurrence_end: "2021-03-23"
    }, january1at0am, february14at1159pm, false).then(data => {
        expect(data).toStrictEqual([])
    })
});

test("Calculate a show on 3rd-to-last Friday of month, starting but not finishing within the request frame", () => {
    let january2at8am = dayjs("2021-01-02T08:00:00+00:00");
    let january15at10am = dayjs("2021-01-15T10:00:00+00:00");

    return schedule.scheduleDayOfMonth("end", {
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        "new_show": true,
        recurrence_period: "5,3",
        recurrence_start: "2020-12-19",
        recurrence_end: "2021-01-23"
    }, january2at8am, january15at10am, false).then(data => {
        expect(data).toStrictEqual([
            {
                from: "2021-01-15T09:00:00+00:00",
                to: "2021-01-15T10:30:00+00:00",
                detail: {
                    id: "99066300793356290",
                    newShow: true
                }
            }
        ])
    })
});

test("Calculate a show on 3rd-to-last Friday of month, finishing but not starting within the request frame", () => {
    let january15at930am = dayjs("2021-01-02T08:09:30+00:00");
    let january15at11am = dayjs("2021-01-15T11:00:00+00:00");

    return schedule.scheduleDayOfMonth("end", {
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        "new_show": false,
        recurrence_period: "5,3",
        recurrence_start: "2020-12-19",
        recurrence_end: "2021-01-23"
    }, january15at930am, january15at11am, false).then(data => {
        expect(data).toStrictEqual([
            {
                from: "2021-01-15T09:00:00+00:00",
                to: "2021-01-15T10:30:00+00:00",
                detail: {
                    id: "99066300793356290",
                    newShow: false
                }
            }
        ])
    })
});

test("Calculate a week-from-end-of-month show which does not occur within the request frame", () => {
    let january4at930am = dayjs("2021-01-04T08:09:30+00:00");
    let january6at11am = dayjs("2021-01-06T11:00:00+00:00");

    return schedule.scheduleDayOfMonth("end", {
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        "new_show": true,
        recurrence_period: "5,3",
        recurrence_start: "2020-12-19",
        recurrence_end: "2021-01-23"
    }, january4at930am, january6at11am, false).then(data => {
        expect(data).toStrictEqual([])
    })
});

test("Calculate a week-from-end-of-month show and get high-detail information about it", () => {
    let january1at0am = dayjs("2021-01-01T00:00:00+00:00");
    let january31at1159pm = dayjs("2021-01-31T23:59:00+00:00");

    return schedule.scheduleDayOfMonth("end", {
        id: "99066300793356290",
        start_time: "9:00",
        duration: 5400,
        "new_show": true,
        recurrence_period: "2,4",
        recurrence_start: "2021-01-02",
        recurrence_end: "2021-01-31"
    }, january1at0am, january31at1159pm, true).then(data => {
        expect(data).toStrictEqual([{
            from: "2021-01-05T09:00:00+00:00",
            to: "2021-01-05T10:30:00+00:00",
            detail: {
                id: "99066300793356290",
                newShow: true,
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