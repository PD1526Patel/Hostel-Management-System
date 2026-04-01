CREATE DATABASE hostel_management;
USE hostel_management;

-- 1. Base User Table (From 'User' Class)
CREATE TABLE Users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- We will hash this later
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    role ENUM('student', 'warden', 'admin') NOT NULL
);

-- 2. Hostels Table
CREATE TABLE Hostels (
    hostelID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    location VARCHAR(255),
    totalRooms INT
);

-- 3. Rooms Table (From 'Room' Class)
CREATE TABLE Rooms (
    roomID INT AUTO_INCREMENT PRIMARY KEY,
    roomNo VARCHAR(10) NOT NULL,
    hostelID INT,
    type VARCHAR(50), -- e.g., 'Single', 'Double'
    capacity INT,
    occupancy INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Available',
    FOREIGN KEY (hostelID) REFERENCES Hostels(hostelID)
);

-- 4. Specific Student Table (Extends User, Links to Room)
CREATE TABLE Students (
    studentID INT PRIMARY KEY, -- Same as userID
    rollNo VARCHAR(50) UNIQUE,
    course VARCHAR(100),
    roomID INT,
    feesDue FLOAT DEFAULT 0.0,
    FOREIGN KEY (studentID) REFERENCES Users(userID) ON DELETE CASCADE,
    FOREIGN KEY (roomID) REFERENCES Rooms(roomID)
);

-- 5. Specific Warden Table (Extends User, Manages Hostel)
CREATE TABLE Wardens (
    wardenID INT PRIMARY KEY, -- Same as userID
    hostelID INT,
    FOREIGN KEY (wardenID) REFERENCES Users(userID) ON DELETE CASCADE,
    FOREIGN KEY (hostelID) REFERENCES Hostels(hostelID)
);

-- 6. Complaints Table (From Activity Diagram logic)
CREATE TABLE Complaints (
    complaintID INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT,
    title VARCHAR(100),
    description TEXT,
    status ENUM('New', 'Assigned', 'Resolved', 'Rejected') DEFAULT 'New',
    dateFiled DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentID) REFERENCES Students(studentID)
);

-- 7. Visitor Log
DROP TABLE IF EXISTS visitorlog;
CREATE TABLE VisitorLog (
    visitorID INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT,
    name VARCHAR(100),
    contact VARCHAR(20),
    inTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    outTime DATETIME,
    FOREIGN KEY (studentID) REFERENCES Students(studentID)
);

-- TRUNCATE TABLE complaints;


SELECT c.complaintID, c.title, u.name, s.studentID 
FROM Complaints c 
JOIN Students s ON c.studentID = s.studentID 
JOIN Users u ON s.studentID = u.userID;

INSERT INTO Hostels (name, location, totalRooms) VALUES ('Boys Hostel A', 'North Campus', 50);

-- Add some dummy rooms linked to Hostel ID 1
INSERT INTO Rooms (roomNo, hostelID, type, capacity, occupancy, status) VALUES 
('101', 1, 'Single', 1, 0, 'Available'),
('102', 1, 'Double', 2, 0, 'Available'),
('103', 1, 'Double', 2, 0, 'Available'),
('104', 1, 'Triple', 3, 0, 'Available');

CREATE TABLE Fees (
    feeID INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT,
    amount FLOAT,
    description VARCHAR(100), -- e.g., "Hostel Fee Sem 5"
    dueDate DATE,
    status ENUM('Pending', 'Paid') DEFAULT 'Pending',
    FOREIGN KEY (studentID) REFERENCES Students(studentID)
);

-- Password is 'admin123' (hashed for demo purposes, or use your bcrypt logic)
-- For now, let's insert a row. If you try to login, you might need to register a user 
-- via the Register page as 'student' first, then manually change their role to 'admin' in the database.

-- QUICK WAY:
-- 1. Go to your Website Register Page.
-- 2. Register a user: Username: 'admin', Password: 'admin123'.
-- 3. Go to MySQL Workbench and run:
UPDATE Users SET role = 'admin' WHERE username = 'admin';
UPDATE Users 
SET role = 'admin' 
WHERE username = 'admin';

SHOW TABLES FROM hostel_management;
SELECT * from Students;
SELECT * from Users;
Select * from Complaints;
Select* from  fees;
Select* from  rooms;
Select* from  visitorlog;
Select* from  wardens;
Select* from  hostels;

DELETE FROM fees 
WHERE feeID = 2;
