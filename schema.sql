create table images
(
    id  int auto_increment
        primary key,
    url text not null,
    alt text not null
);

create table people
(
    id           int auto_increment
        primary key,
    name         text not null,
    description  text null,
    email        text null,
    profileImage int  null,
    coverImage   int  null,
    constraint people_coverImage
        foreign key (coverImage) references images (id),
    constraint people_profileImage
        foreign key (profileImage) references images (id)
);

create table shows
(
    id           int auto_increment
        primary key,
    name         text not null,
    tagline      text null,
    description  text null,
    email        text null,
    profileImage int  null,
    coverImage   int  null,
    constraint shows_coverImage
        foreign key (coverImage) references images (id),
    constraint shows_profileImage
        foreign key (profileImage) references images (id)
);

create table rel_shows_people
(
    id     int auto_increment
        primary key,
    `show` int  not null,
    person int  not null,
    role   text null,
    constraint rel_shows_people_person
        foreign key (person) references people (id),
    constraint rel_shows_people_shows
        foreign key (`show`) references shows (id)
);

create table sponsors
(
    id           int auto_increment
        primary key,
    name         text not null,
    description  text not null,
    email        text null,
    profileImage int  null,
    coverImage   int  null,
    constraint sponsors_coverImage
        foreign key (coverImage) references images (id),
    constraint sponsors_profileImage
        foreign key (profileImage) references images (id)
);

create table rel_shows_sponsors
(
    id      int auto_increment
        primary key,
    `show`  int  not null,
    sponsor int  not null,
    detail  text null,
    constraint rel_shows_sponsors_show
        foreign key (`show`) references shows (id),
    constraint rel_shows_sponsors_sponsor
        foreign key (sponsor) references sponsors (id)
);

create table times
(
    id         int auto_increment
        primary key,
    `show`     int                  not null,
    new        tinyint(1) default 1 not null,
    datetime   text                 not null,
    exceptions text                 null,
    start      time                 not null,
    end        time                 not null,
    constraint times_shows
        foreign key (`show`) references shows (id)
);

create table urls
(
    id   int auto_increment
        primary key,
    name text not null,
    url  text not null
);

create table rel_urls
(
    id      int auto_increment
        primary key,
    url     int not null,
    `show`  int null,
    sponsor int null,
    people  int null,
    constraint rel_urls_people
        foreign key (people) references people (id),
    constraint rel_urls_shows
        foreign key (`show`) references shows (id),
    constraint rel_urls_sponsors
        foreign key (sponsor) references sponsors (id),
    constraint rel_urls_url
        foreign key (url) references urls (id)
);


