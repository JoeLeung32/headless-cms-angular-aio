create table Administrator
(
    id       INTEGER not null
        constraint id
            primary key autoincrement,
    username TEXT    not null,
    password TEXT    not null,
    createAt TEXT,
    isValid  INTEGER default 0 not null
);

create unique index Administrator_username_unique
    on Administrator (username);

create table AdministratorToken
(
    id       INTEGER not null
        constraint id
            primary key autoincrement,
    adminId  INTEGER not null,
    token    TEXT    not null,
    createAt TEXT,
    expiryAt TEXT,
    isValid  INTEGER default 0 not null
);

create table ApiToken
(
    id          INTEGER
        constraint id
            primary key autoincrement,
    token       TEXT not null,
    description TEXT,
    createAt    TEXT,
    expiryAt    INTEGER,
    isValid     INTEGER default 0 not null
);

create unique index ApiToken_token_unique
    on ApiToken (token);

create table ContentObject
(
    id             INTEGER not null
        constraint id
            primary key autoincrement,
    object_name    TEXT    not null,
    object_catalog TEXT
);

create table ContentData
(
    id            INTEGER not null
        constraint id
            primary key autoincrement,
    title         TEXT,
    content       TEXT,
    createAt      TEXT,
    updateAt      TEXT,
    isPublished   INTEGER default 0,
    contentObject TEXT
);


