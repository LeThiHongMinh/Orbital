-- users table
create table users(
    user_id serial primary key,
    email varchar(255) unique not null,
    password varchar(255) not null,
    created_at date default current_date
    full_name varchar(255) not null,
    bio TEXT not null,
);
-- matchform table
CREATE TABLE matchform (
id SERIAL PRIMARY KEY,
ullname VARCHAR(100) NOT NULL,
coursecode VARCHAR(50) NOT NULL,
expectations TEXT,
academiclevel VARCHAR(50) NOT NULL,
studygoal VARCHAR(50) NOT NULL,
createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a table in PostgreSQL to store files in library
CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  file_data BYTEA
);
