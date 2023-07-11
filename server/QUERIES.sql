CREATE TABLE IF NOT EXISTS users(
    uid varchar(255) primary key,
    role varchar(10),
    fname varchar(64),
    lname varchar(64),
    email varchar(128),
    password varchar(64),
);

CREATE TABLE IF NOT EXISTS  short (
	id SERIAL PRIMARY KEY,
	question TEXT,
	answer TEXT,
	sec INT,
	points INT
);
CREATE TABLE IF NOT EXISTS  multiple (
	id SERIAL PRIMARY KEY,
	question TEXT,
	option1 VARCHAR(255),
	option2 VARCHAR(255),
	option3 VARCHAR(255),
	option4 VARCHAR(255),
	answer VARCHAR(255),
	sec INT,
	points INT
	);
CREATE TABLE IF NOT EXISTS tf (
	id SERIAL PRIMARY KEY,
	question TEXT,
	answer TEXT,
	sec INT,
	points INT
);
CREATE TABLE IF NOT EXISTS quizzes(
    quizid SERIAL PRIMARY KEY,
    teacherid varchar(255),
    tname varchar(255),
	mid INT,
	sid INT,
	tfid INT,
    created TIMESTAMP,
    FOREIGN KEY (teacherid) REFERENCES users(uid)
);
CREATE TABLE IF NOT EXISTS mclist(
	mclistid int,
	mid INT,
	FOREIGN KEY (mid) REFERENCES multiple(id),
	FOREIGN KEY (mclistid) REFERENCES quizzes(quizid),
	PRIMARY KEY(mclistid,mid)
);
CREATE TABLE IF NOT EXISTS slist(
	slistid int,
	sid INT,
	FOREIGN KEY (sid) REFERENCES short(id),
	FOREIGN KEY (slistid) REFERENCES quizzes(quizid),
	PRIMARY KEY(slistid,sid)
);
CREATE TABLE IF NOT EXISTS tflist(
	tflistid int,
	tfid INT,
	FOREIGN KEY (tfid) REFERENCES tf(id),
	FOREIGN KEY (tflistid) REFERENCES quizzes(quizid),
	PRIMARY KEY(tflistid,tfid)
)