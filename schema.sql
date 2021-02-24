create table images
(
    id  bigint unsigned default uuid_short() not null
        primary key,
    url text                                 not null,
    alt text                                 not null
);

create table people
(
    id           bigint unsigned default uuid_short() not null
        primary key,
    nick         text                                 not null,
    name         text                                 not null,
    description  text                                 null,
    email        text                                 null,
    profileImage bigint unsigned                      null,
    coverImage   bigint unsigned                      null,
    constraint people_coverImage
        foreign key (coverImage) references images (id),
    constraint people_profileImage
        foreign key (profileImage) references images (id)
);

create table shows
(
    id           bigint unsigned default uuid_short() not null
        primary key,
    nick         text                                 not null,
    name         text                                 not null,
    tagline      text                                 null,
    description  text                                 null,
    email        text                                 null,
    profileImage bigint unsigned                      null,
    coverImage   bigint unsigned                      null,
    constraint shows_coverImage
        foreign key (coverImage) references images (id),
    constraint shows_profileImage
        foreign key (profileImage) references images (id)
);

create table rel_shows_people
(
    id     bigint unsigned default uuid_short() not null
        primary key,
    `show` bigint unsigned                      not null,
    person bigint unsigned                      not null,
    role   text                                 null,
    constraint rel_shows_people_person
        foreign key (person) references people (id),
    constraint rel_shows_people_shows
        foreign key (`show`) references shows (id)
);

create table sponsors
(
    id           bigint unsigned default uuid_short() not null
        primary key,
    nick         text                                 not null,
    name         text                                 not null,
    description  text                                 not null,
    email        text                                 null,
    profileImage bigint unsigned                      null,
    coverImage   bigint unsigned                      null,
    constraint sponsors_coverImage
        foreign key (coverImage) references images (id),
    constraint sponsors_profileImage
        foreign key (profileImage) references images (id)
);

create table rel_shows_sponsors
(
    id      bigint unsigned default uuid_short() not null
        primary key,
    `show`  bigint unsigned                      not null,
    sponsor bigint unsigned                      not null,
    detail  text                                 null,
    constraint rel_shows_sponsors_show
        foreign key (`show`) references shows (id),
    constraint rel_shows_sponsors_sponsor
        foreign key (sponsor) references sponsors (id)
);

create table times
(
    id                bigint unsigned default uuid_short() not null
        primary key,
    `show`            bigint unsigned                      not null,
    new_show          tinyint(1)      default 1            not null,
    start_time        time                                 not null,
    duration          int                                  not null,
    recurrence_type   text                                 null,
    recurrence_period text                                 null,
    recurrence_start  date                                 null,
    recurrence_end    date                                 null,
    constraint times_shows
        foreign key (`show`) references shows (id)
);

create table urls
(
    id   bigint unsigned default uuid_short() not null
        primary key,
    name text                                 not null,
    url  text                                 not null
);

create table rel_urls
(
    id        bigint unsigned default uuid_short() not null
        primary key,
    url       bigint unsigned                      not null,
    `show`    bigint unsigned                      null,
    sponsor   bigint unsigned                      null,
    people    bigint unsigned                      null,
    `primary` tinyint(1)      default 0            not null,
    constraint rel_urls_people
        foreign key (people) references people (id),
    constraint rel_urls_shows
        foreign key (`show`) references shows (id),
    constraint rel_urls_sponsors
        foreign key (sponsor) references sponsors (id),
    constraint rel_urls_url
        foreign key (url) references urls (id)
);

