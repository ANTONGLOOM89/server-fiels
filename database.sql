create Table person(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    password VARCHAR(255),
    diskSpace INTEGER,
    usedSpace INTEGER,
    avatar VARCHAR(255)
);
