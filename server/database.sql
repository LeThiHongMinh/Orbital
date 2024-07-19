CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE,
    bio TEXT,
    full_name VARCHAR(255),
     tele TEXT
);

CREATE TABLE tokens (
    token_id SERIAL PRIMARY KEY,
    user_id SERIAL REFERENCES users(user_id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ
);

-- matchform table
CREATE TABLE matchform (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    coursecode VARCHAR(50) NOT NULL,
    expectations TEXT,
    academiclevel VARCHAR(50) NOT NULL,
    studygoal VARCHAR(50) NOT NULL,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
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
  user_id INTEGER,
  partner_id INTEGER,
  course_code VARCHAR(255),
  activity_type VARCHAR(255),
  activity_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  status BOOLEAN DEFAULT false, --Pending
  file_data BYTEA,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE course (
  id SERIAL PRIMARY KEY,
  course_code VARCHAR(255),
  course_name VARCHAR(255)
);

CREATE TABLE partners (
  id SERIAL PRIMARY KEY,
  course_code VARCHAR(255),
  partner_1_id INTEGER NOT NULL,
  partner_2_id INTEGER NOT NULL,
  status BOOLEAN DEFAULT true
);

CREATE TABLE feedback (
  feedback_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  partner_id INT NOT NULL,
  comments TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (partner_id) REFERENCES users(user_id)
);
CREATE TABLE matched_files (
   id SERIAL PRIMARY KEY,
   name VARCHAR(255),
   description TEXT,
   file_data BYTEA ,
   course_code VARCHAR(50) ,
                 email1 VARCHAR(255),
                 email2 VARCHAR(255),  
                 upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP );