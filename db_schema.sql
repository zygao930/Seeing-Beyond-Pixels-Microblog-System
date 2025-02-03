-- Enable foreign key constraint enforcement, ensuring referential integrity across tables
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- Create the 'users' table to store user information
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unique user ID
    user_name TEXT NOT NULL,  -- Name of the user
    user_email TEXT NOT NULL  -- Email of the user
);

-- Create the 'workshop' table to store workshop details
CREATE TABLE IF NOT EXISTS workshop (
    workshop_id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unique workshop ID
    workshop_code INTEGER NOT NULL UNIQUE,  -- Unique code for each workshop
    workshop_title TEXT NOT NULL,  -- Title of the workshop
    workshop_subtitle TEXT NOT NULL,  -- Subtitle of the workshop
    workshop_description TEXT NOT NULL,  -- Description of the workshop
    workshop_created_time DATETIME DEFAULT (datetime('now')),  -- Timestamp of when the workshop is created
    workshop_last_modified DATETIME DEFAULT (datetime('now')),  -- Timestamp of when the workshop is last modified
    workshop_event_date DATETIME NOT NULL,  -- Date and time when the workshop will be held
    workshop_status TEXT NOT NULL,  -- Status (e.g., draft, published) of the workshop
    workshop_available_tickets INTEGER  -- Number of available tickets for the workshop
);

-- Create the 'tickets' table to manage different types of tickets for workshops
CREATE TABLE IF NOT EXISTS tickets (
    tickets_id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unique ticket ID
    tickets_type TEXT NOT NULL,  -- Type of ticket (e.g., General Admission, VIP)
    tickets_price INTEGER NOT NULL,  -- Price of the ticket
    tickets_number_available INTEGER NOT NULL CHECK (tickets_number_available > 0),  -- Available tickets, must be greater than 0
    tickets_workshop_id INTEGER,  -- Reference to the associated workshop
    FOREIGN KEY (tickets_workshop_id) REFERENCES workshop(workshop_id) ON DELETE CASCADE  -- Ensures referential integrity: delete tickets if workshop is deleted
);

-- Create the 'booked_tickets' table to record ticket bookings by users
CREATE TABLE IF NOT EXISTS booked_tickets (
    booked_tickets_id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unique booking ID
    booked_tickets_user_id INTEGER,  -- Reference to the user making the booking
    booked_tickets_tickets_id INTEGER,  -- Reference to the booked ticket
    booked_tickets_tickets_number INTEGER,  -- Number of tickets booked
    booked_tickets_time DATETIME NOT NULL,  -- Timestamp of when the booking was made
    FOREIGN KEY (booked_tickets_user_id) REFERENCES users(user_id) ON DELETE CASCADE,  -- Ensures user-related bookings are deleted when user is deleted
    FOREIGN KEY (booked_tickets_tickets_id) REFERENCES tickets(tickets_id) ON DELETE CASCADE  -- Ensures ticket-related bookings are deleted when ticket is deleted
);

-- Create the 'blog_info' table to store blog-related information for the website
CREATE TABLE IF NOT EXISTS blog_info (
    blog_id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unique blog ID
    blog_title TEXT NOT NULL,  -- Title of the blog
    blog_subtitle TEXT NOT NULL,  -- Subtitle of the blog
    blog_author TEXT NOT NULL  -- Author of the blog
);

-- Trigger to update workshop_available_tickets after a new ticket is inserted
CREATE TRIGGER update_workshop_available_tickets_after_insert
AFTER INSERT ON tickets
BEGIN
    -- Updates available tickets in the workshop table based on tickets inserted
    UPDATE workshop
    SET workshop_available_tickets = (
        SELECT SUM(tickets_number_available)
        FROM tickets
        WHERE tickets_workshop_id = NEW.tickets_workshop_id
    )
    WHERE workshop_id = NEW.tickets_workshop_id;
END;

-- Trigger to update workshop_available_tickets after a ticket is updated
CREATE TRIGGER update_workshop_available_tickets_after_update
AFTER UPDATE ON tickets
BEGIN
    -- Updates available tickets in the workshop table after a ticket is updated
    UPDATE workshop
    SET workshop_available_tickets = (
        SELECT SUM(tickets_number_available)
        FROM tickets
        WHERE tickets_workshop_id = OLD.tickets_workshop_id
    )
    WHERE workshop_id = OLD.tickets_workshop_id;
END;

-- Trigger to update workshop_available_tickets after a ticket is deleted
CREATE TRIGGER update_workshop_available_tickets_after_delete
AFTER DELETE ON tickets
BEGIN
    -- Updates available tickets in the workshop table after a ticket is deleted
    UPDATE workshop
    SET workshop_available_tickets = (
        SELECT SUM(tickets_number_available)
        FROM tickets
        WHERE tickets_workshop_id = OLD.tickets_workshop_id
    )
    WHERE workshop_id = OLD.tickets_workshop_id;
END;

-- Insert sample users into the 'users' table
INSERT INTO users (user_name, user_email) VALUES ('Alice Johnson', 'alice.johnson@example.com');
INSERT INTO users (user_name, user_email) VALUES ('Bob Smith', 'bob.smith@example.com');
INSERT INTO users (user_name, user_email) VALUES ('Charlie Davis', 'charlie.davis@example.com');

-- Insert sample workshop data into the 'workshop' table (with different statuses: draft/published)
INSERT INTO workshop (workshop_code, workshop_title, workshop_subtitle, workshop_description, workshop_event_date, workshop_status, workshop_available_tickets) VALUES 
(2501, 'Introduction to Computer Vision', 
 'Understanding the basics of image processing and visual data analysis.',
 'In this workshop, participants will explore the fundamentals of computer vision, including image processing techniques, 
  edge detection, image transformations, and how these principles are applied in real-world scenarios.',
  '2025-01-20 14:30:00', 'draft', 0);

INSERT INTO workshop (workshop_code, workshop_title, workshop_subtitle, workshop_description, workshop_event_date, workshop_status, workshop_available_tickets) VALUES 
(2502, 'Deep Learning for Image Classification', 
 'Mastering neural networks to classify and interpret visual data.',
 'This workshop focuses on applying deep learning models, particularly convolutional neural networks (CNNs), to classify and analyze images. 
  Participants will learn how to train and fine-tune neural networks for image classification tasks.',
  '2025-05-12 10:00:00', 'draft', 0);

INSERT INTO workshop (workshop_code, workshop_title, workshop_subtitle, workshop_description, workshop_event_date, workshop_status, workshop_available_tickets) VALUES 
(2503, 'Real-Time Object Detection with OpenCV', 
 'Develop systems that detect and track objects in real-time using OpenCV',
 'Participants will learn to implement real-time object detection algorithms using OpenCV. This hands-on workshop covers the use of pre-trained models, 
  object tracking, and real-time application integration for building robust computer vision systems.',
  '2024-09-18 11:00:00', 'draft', 0);

INSERT INTO workshop (workshop_code, workshop_title, workshop_subtitle, workshop_description, workshop_event_date, workshop_status, workshop_available_tickets) VALUES 
(2411, 'Introduction to Deep Learning for Computer Vision', 
 'Learn the fundamentals of deep learning and its applications in computer vision.',
 'This workshop introduces participants to the world of deep learning, with a focus on its applications in computer vision. 
  It covers the basics of neural networks, the architecture of deep learning models, 
  and their practical uses in solving vision-related problems such as object recognition, image segmentation, and classification.',
  '2025-09-11 17:40:00', 'published', 0);

-- Insert ticket information for each workshop
INSERT INTO tickets (tickets_type, tickets_price, tickets_number_available, tickets_workshop_id)
VALUES ('General Admission', 50, 30, 1),
       ('VIP', 100, 20, 1),
       ('Student', 30, 50, 1);

INSERT INTO tickets (tickets_type, tickets_price, tickets_number_available, tickets_workshop_id)
VALUES ('General Admission', 50, 30, 2),
       ('VIP', 100, 20, 2);

INSERT INTO tickets (tickets_type, tickets_price, tickets_number_available, tickets_workshop_id)
VALUES ('General Admission', 50, 10, 3);

INSERT INTO tickets (tickets_type, tickets_price, tickets_number_available, tickets_workshop_id)
VALUES ('General Admission', 500, 10, 4),
       ('VIP', 100, 100, 4);

-- Book tickets for Alice Johnson
INSERT INTO booked_tickets (booked_tickets_user_id, booked_tickets_tickets_id, booked_tickets_tickets_number, booked_tickets_time) 
VALUES (1, 7, 5, '2024-12-18 13:07:00');
INSERT INTO booked_tickets (booked_tickets_user_id, booked_tickets_tickets_id, booked_tickets_tickets_number, booked_tickets_time) 
VALUES (1, 8, 10, '2024-11-18 14:05:00');  

-- Book tickets for Bob Smith
INSERT INTO booked_tickets (booked_tickets_user_id, booked_tickets_tickets_id, booked_tickets_tickets_number, booked_tickets_time) 
VALUES (2, 8, 4, '2025-01-08 11:12:00');  
INSERT INTO booked_tickets (booked_tickets_user_id, booked_tickets_tickets_id, booked_tickets_tickets_number, booked_tickets_time) 
VALUES (2, 7, 5, '2024-09-18 11:00:00');  

-- Insert a blog entry
INSERT INTO blog_info (blog_title, blog_subtitle, blog_author) VALUES 
('Seeing Beyond Pixels','A hub for exploring Computer Vision workshops, techniques, and innovations.','Ziyuan G');

COMMIT;
