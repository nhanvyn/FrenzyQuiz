CREATE TABLE IF NOT EXISTS users(
    uid varchar(255) primary key,
    role varchar(10),
    fname varchar(64),
    lname varchar(64),
    email varchar(128),
    password varchar(64),
);