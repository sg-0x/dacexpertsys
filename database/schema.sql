-- =========================
-- ENUMS
-- =========================

CREATE TYPE user_role AS ENUM ('student', 'warden', 'chief_warden', 'dsw', 'admin');

CREATE TYPE case_status AS ENUM ('pending_chief', 'pending_dsw', 'pending_admin', 'resolved');

CREATE TYPE case_severity AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TYPE program_type AS ENUM ('btech', 'bba', 'mba', 'ballb', 'bcom');


-- =========================
-- TABLES
-- =========================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    role user_role NOT NULL,
    program program_type,
    enrollment_no TEXT,
    year INT,
    hostel TEXT,
    room TEXT,
    total_points INT DEFAULT 0
);

CREATE TABLE cases (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES users(id),
    created_by INT REFERENCES users(id),
    assigned_to_role user_role,
    reported_by INT REFERENCES users(id),
    resolved_by INT REFERENCES users(id),
    offense_type TEXT,
    severity case_severity NOT NULL,
    status case_status NOT NULL,
    description TEXT,
    location TEXT,
    incident_date DATE,
    penalty_points INT,
    severity_score FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE case_timeline (
    id SERIAL PRIMARY KEY,
    case_id INT REFERENCES cases(id),
    event TEXT,
    performed_by INT REFERENCES users(id),
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rules (
    id SERIAL PRIMARY KEY,
    question TEXT,
    weight FLOAT,
    category TEXT
);

CREATE TABLE evidence (
    id SERIAL PRIMARY KEY,
    case_id INT REFERENCES cases(id),
    file_url TEXT NOT NULL,
    file_type TEXT,
    uploaded_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    message TEXT,
    case_id INT REFERENCES cases(id),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);