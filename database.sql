create Table person(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    diskSpace INTEGER,
    usedSpace INTEGER,
    avatar VARCHAR(255)
);

create Table file(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(255),
    access_link VARCHAR(255),
    size INTEGER,
    path VARCHAR(255),
    date_create varchar(10) default to_char(CURRENT_DATE, 'DD.MM.YYYY'),
    user_id INTEGER,
    parent_id INTEGER,
    childs_id INTEGER[],
    FOREIGN KEY (user_id) REFERENCES person (id)
);
