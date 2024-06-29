CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE
);

CREATE TABLE tokens (
    token_id SERIAL PRIMARY KEY,
    user_id SERIAL REFERENCES users(user_id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ
);

CREATE TABLE profile (
    profile_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT
);



-- matchform table
CREATE TABLE matchform (
id SERIAL PRIMARY KEY,
fullname VARCHAR(100) NOT NULL,
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

CREATE TABLE study_activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  activity_type VARCHAR(255),
  activity_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  status BOOLEAN DEFAULT false, --Pending
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Update on the users table whenver email in profile table updates
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET email = NEW.email
    WHERE user_id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_email
AFTER UPDATE OF email ON profile
FOR EACH ROW
EXECUTE FUNCTION sync_user_email();

-- Update on the users table whenver password in profile table updates
CREATE OR REPLACE FUNCTION sync_user_password()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET password = NEW.password
    WHERE user_id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_password
AFTER UPDATE OF password ON profile
FOR EACH ROW
EXECUTE FUNCTION sync_user_password();
