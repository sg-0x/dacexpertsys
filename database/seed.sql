-- =========================
-- USERS
-- =========================

-- Students (10)
INSERT INTO users (name, email, role, program, year, hostel, room)
VALUES
('Rahul Sharma','rahul1@test.com','student','btech',2,'BSH','101'),
('Aman Verma','aman@test.com','student','btech',3,'BSH','102'),
('Priya Singh','priya@test.com','student','bba',1,'GH','201'),
('Neha Gupta','neha@test.com','student','bcom',2,'GH','202'),
('Arjun Mehta','arjun@test.com','student','mba',1,'BSH','103'),
('Karan Patel','karan@test.com','student','btech',4,'BSH','104'),
('Simran Kaur','simran@test.com','student','ballb',3,'GH','203'),
('Rohit Yadav','rohit@test.com','student','btech',2,'BSH','105'),
('Sneha Jain','sneha@test.com','student','bba',1,'GH','204'),
('Vikas Roy','vikas@test.com','student','bcom',2,'BSH','106');

-- Wardens (2)
INSERT INTO users (name, email, role)
VALUES
('Warden A','warden1@test.com','warden'),
('Warden B','warden2@test.com','warden');

-- Chief Warden
INSERT INTO users (name, email, role)
VALUES ('Chief Warden','chief@test.com','chief_warden');

-- DSW
INSERT INTO users (name, email, role)
VALUES ('DSW Officer','dsw@test.com','dsw');

-- Admin
INSERT INTO users (name, email, role)
VALUES ('Admin User','admin@test.com','admin');


-- =========================
-- CASES (5)
-- =========================

INSERT INTO cases (student_id, reported_by, offense_type, severity, status, description, location, penalty_points)
VALUES
(1, 11, 'smoking', 'low', 'pending', 'Smoking in hostel', 'BSH', 10),
(2, 11, 'alcohol', 'medium', 'investigation', 'Alcohol possession', 'BSH', 20),
(3, 12, 'late entry', 'low', 'resolved', 'Late hostel entry', 'GH', 5),
(4, 12, 'noise', 'low', 'pending', 'Disturbing others', 'GH', 5),
(5, 11, 'ragging', 'high', 'dac_review', 'Ragging junior', 'BSH', 50);


-- =========================
-- CASE TIMELINE
-- =========================

INSERT INTO case_timeline (case_id, event, performed_by)
VALUES
(1, 'Case Created', 11),
(2, 'Case Created', 11),
(2, 'Investigation Started', 11),
(3, 'Case Created', 12),
(3, 'Resolved', 14);


-- =========================
-- RULES
-- =========================

INSERT INTO rules (question, weight, category)
VALUES
('Was the student intoxicated?', 1.0, 'severity'),
('Was this a repeated offense?', 1.0, 'history'),
('Did it involve others?', 0.5, 'impact'),
('Was property damaged?', 1.0, 'damage'),
('Was it in hostel premises?', 0.5, 'location');


-- =========================
-- EVIDENCE
-- =========================

INSERT INTO evidence (case_id, file_url, file_type, uploaded_by)
VALUES
(1, 'http://example.com/img1.jpg', 'image', 11),
(2, 'http://example.com/img2.jpg', 'image', 11),
(3, 'http://example.com/doc1.pdf', 'pdf', 12),
(4, 'http://example.com/img3.jpg', 'image', 12),
(5, 'http://example.com/img4.jpg', 'image', 11);


-- =========================
-- NOTIFICATIONS
-- =========================

INSERT INTO notifications (user_id, message)
VALUES
(1, 'You have a new case'),
(2, 'Your case is under investigation'),
(3, 'Case resolved'),
(4, 'Attend DAC meeting'),
(5, 'Penalty assigned');