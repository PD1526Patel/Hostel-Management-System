const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import the connection

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_super_secret_key_123'; // In a real app, use an .env file

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to parse JSON from the frontend

// Simple Test Route
app.get('/', (req, res) => {
  res.send('Hostel Management System Backend is Running');
});

const PORT = 3001;

const verifyJWT = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res
      .status(403)
      .send('We need a token, please give it to us next time!');
  } else {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).send('Authentication failed!');
      } else {
        req.userId = decoded.id; // Save the ID for use in the next function
        next(); // Move to the actual API logic
      }
    });
  }
};

// Register API
app.post('/register', (req, res) => {
  const { username, password, name, role, rollNo, course } = req.body;

  // 1. Hash the password
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error hashing password' });
    }

    // 2. Insert into Base 'Users' Table
    const sqlInsertUser =
      'INSERT INTO Users (username, password, name, role) VALUES (?,?,?,?)';
    db.query(sqlInsertUser, [username, hash, name, role], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Database error' });
      }

      const newUserID = result.insertId; // Get the ID of the user just created

      // 3. If role is 'student', insert into 'Students' table too
      if (role === 'student') {
        const sqlInsertStudent =
          'INSERT INTO Students (studentID, rollNo, course) VALUES (?,?,?)';
        db.query(
          sqlInsertStudent,
          [newUserID, rollNo, course],
          (err, result) => {
            if (err) return res.status(500).send(err);
            res.send({ message: 'Registration Successful' });
          },
        );
      } else {
        res.send({ message: 'User registered successfully' });
      }
    });
  });
});

// Login API
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM Users WHERE username = ?',
    [username],
    (err, result) => {
      if (err) return res.status(500).send(err);

      if (result.length > 0) {
        const user = result[0];

        // This is the magic part that compares the typing to the hash
        bcrypt.compare(password, user.password, (error, isMatch) => {
          if (isMatch) {
            const token = jwt.sign(
              { id: user.userID, role: user.role },
              SECRET_KEY,
              { expiresIn: '2h' },
            );
            res.send({
              auth: true,
              token: token,
              user: { userID: user.userID, name: user.name, role: user.role },
            });
          } else {
            // Password didn't match
            res.status(401).send({ auth: false, message: 'Wrong password!' });
          }
        });
      } else {
        res.status(404).send({ auth: false, message: "User doesn't exist" });
      }
    },
  );
});
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   const sqlFindUser = 'SELECT * FROM Users WHERE username = ?';

//   db.query(sqlFindUser, [username], (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: 'Database error' });
//     }

//     if (result.length > 0) {
//       const user = result[0];

//       // Compare provided password with stored hash
//       bcrypt.compare(password, user.password, (error, response) => {
//         if (response) {
//           // Password Match
//           res.json({
//             message: 'Login Successful',
//             user: {
//               id: user.userID,
//               username: user.username,
//               role: user.role,
//             },
//           });
//         } else {
//           // Password Wrong
//           res
//             .status(401)
//             .json({ message: 'Wrong username/password combination' });
//         }
//       });
//     } else {
//       res.status(404).json({ message: "User doesn't exist" });
//     }
//   });
// });

// API to Lodge a Complaint
// Add 'verifyJWT' between the path and the (req, res)
app.post('/lodge-complaint', verifyJWT, (req, res) => {
  const { title, description } = req.body;
  const studentID = req.userId; // We get this from the token now! Super secure.

  const sqlInsert =
    "INSERT INTO Complaints (studentID, title, description, status) VALUES (?, ?, ?, 'New')";
  db.query(sqlInsert, [studentID, title, description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send({ message: 'Complaint lodged successfully!' });
  });
});
// app.post('/lodge-complaint', (req, res) => {
//   const { studentID, title, description } = req.body;

//   // Default status is 'New' as per schema
//   const sqlInsert =
//     "INSERT INTO Complaints (studentID, title, description, status, dateFiled) VALUES (?, ?, ?, 'New', NOW())";

//   db.query(sqlInsert, [studentID, title, description], (err, result) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     res.send({ message: 'Complaint lodged successfully!' });
//   });
// });

// API to Get Complaints
// app.get('/complaints', (req, res) => {
//     const studentID = req.query.studentID; // Optional query parameter

//     let sqlSelect = "SELECT c.*, u.name as studentName, r.roomNo FROM Complaints c JOIN Students s ON c.studentID = s.studentID JOIN Users u ON s.studentID = u.userID JOIN Rooms r ON s.roomID = r.roomID";
//     let params = [];

//     // If studentID is provided, filter results (Student View)
//     if (studentID) {
//         sqlSelect += " WHERE c.studentID = ?";
//         params.push(studentID);
//     }
//     // If no studentID, return all (Warden View)

//     db.query(sqlSelect, params, (err, result) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).json({ error: "Database error" });
//         }
//         res.send(result);
//     });
// });

// API to Update Complaint Status
app.put('/update-complaint', (req, res) => {
  const { complaintID, status } = req.body; // status can be 'Resolved', 'Rejected', etc.

  const sqlUpdate = 'UPDATE Complaints SET status = ? WHERE complaintID = ?';

  db.query(sqlUpdate, [status, complaintID], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.send({ message: 'Complaint status updated!' });
  });
});

// API to Get Available Rooms
app.get('/rooms', (req, res) => {
  const sqlSelect = "SELECT * FROM Rooms WHERE status = 'Available'";

  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.send(result);
  });
});

// API to Get Complaints (CORRECTED)
// API to Get ALL Complaints (For Warden)
app.get('/complaints', (req, res) => {
  // We removed the input check. Now it just grabs everything.
  const sqlSelect = `
        SELECT c.*, u.name as studentName, r.roomNo 
        FROM Complaints c 
        JOIN Students s ON c.studentID = s.studentID 
        JOIN Users u ON s.studentID = u.userID 
        LEFT JOIN Rooms r ON s.roomID = r.roomID
    `;

  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.send(result);
  });
});

// 1. Get Students who don't have a room yet
app.get('/students-no-room', (req, res) => {
  const sqlSelect = `
        SELECT s.studentID, u.name, s.rollNo 
        FROM Students s 
        JOIN Users u ON s.studentID = u.userID 
        WHERE s.roomID IS NULL
    `;
  db.query(sqlSelect, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send(result);
  });
});

// 2. Get Available Rooms (Occupancy < Capacity)
app.get('/available-rooms', (req, res) => {
  const sqlSelect = 'SELECT * FROM Rooms WHERE occupancy < capacity';
  db.query(sqlSelect, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send(result);
  });
});

// 3. Allocate Room (Update Student & Update Room Occupancy)
app.post('/allocate-room', (req, res) => {
  const { studentID, roomID } = req.body;

  // This technically requires a Transaction, but we will keep it simple for now.

  // A. Update Student
  const updateStudent = 'UPDATE Students SET roomID = ? WHERE studentID = ?';
  db.query(updateStudent, [roomID, studentID], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    // B. Increase Room Occupancy
    const updateRoom =
      'UPDATE Rooms SET occupancy = occupancy + 1 WHERE roomID = ?';
    db.query(updateRoom, [roomID], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.send({ message: 'Room allocated successfully!' });
    });
  });
});

// --- FEE MANAGEMENT APIs ---

// 1. Generate Bill (Warden)
app.post('/generate-bill', (req, res) => {
  const { studentID, amount, description, dueDate } = req.body;
  const sqlInsert =
    "INSERT INTO Fees (studentID, amount, description, dueDate, status) VALUES (?, ?, ?, ?, 'Pending')";

  db.query(
    sqlInsert,
    [studentID, amount, description, dueDate],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.send({ message: 'Bill generated successfully!' });
    },
  );
});

// 2. Get Bills (For a specific Student)
app.get('/student-bills', (req, res) => {
  const studentID = req.query.studentID;
  const sqlSelect = 'SELECT * FROM Fees WHERE studentID = ?';

  db.query(sqlSelect, [studentID], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send(result);
  });
});

// 3. Pay Bill (Simulate Payment)
app.post('/pay-bill', (req, res) => {
  const { feeID } = req.body;
  const sqlUpdate = "UPDATE Fees SET status = 'Paid' WHERE feeID = ?";

  db.query(sqlUpdate, [feeID], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send({ message: 'Bill paid successfully!' });
  });
});

// --- VISITOR MANAGEMENT APIs ---

// 1. Record Entry
app.post('/visitor-entry', (req, res) => {
  const { studentID, name, contact } = req.body;
  const sqlInsert =
    'INSERT INTO VisitorLog (studentID, name, contact, inTime) VALUES (?, ?, ?, NOW())';

  db.query(sqlInsert, [studentID, name, contact], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send({ message: 'Visitor Entry Recorded!' });
  });
});

// 2. Record Exit (Update outTime)
app.put('/visitor-exit', (req, res) => {
  const { visitorID } = req.body;
  const sqlUpdate = 'UPDATE VisitorLog SET outTime = NOW() WHERE visitorID = ?';

  db.query(sqlUpdate, [visitorID], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send({ message: 'Visitor Exit Recorded!' });
  });
});

// 3. Get All Visitors (Active & History)
app.get('/visitors', (req, res) => {
  // We Join with Users to get the Student's Name instead of just ID
  const sqlSelect = `
        SELECT v.*, u.name as studentName 
        FROM VisitorLog v 
        JOIN Students s ON v.studentID = s.studentID 
        JOIN Users u ON s.studentID = u.userID 
        ORDER BY v.inTime DESC
    `;

  db.query(sqlSelect, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send(result);
  });
});

// --- ADMIN APIs ---

// 1. Get System Stats (Protected)
app.get('/admin/stats', verifyJWT, (req, res) => {
  const queries = {
    students: "SELECT COUNT(*) as count FROM Users WHERE role='student'",
    wardens: "SELECT COUNT(*) as count FROM Users WHERE role='warden'",
    complaints: "SELECT COUNT(*) as count FROM Complaints WHERE status='New'",
    rooms: 'SELECT COUNT(*) as count FROM Rooms WHERE occupancy < capacity',
  };

  db.query(queries.students, (err, r1) => {
    db.query(queries.wardens, (err, r2) => {
      db.query(queries.complaints, (err, r3) => {
        db.query(queries.rooms, (err, r4) => {
          res.send({
            students: r1[0].count,
            wardens: r2[0].count,
            complaints: r3[0].count,
            rooms: r4[0].count,
          });
        });
      });
    });
  });
});

// 2. Get All Users (Protected)
app.get('/admin/users', verifyJWT, (req, res) => {
  db.query('SELECT userID, name, username, role FROM Users', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send(result);
  });
});

// 3. Delete User (Protected)
app.delete('/admin/delete-user/:id', verifyJWT, (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM Users WHERE userID = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send({ message: 'User deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
