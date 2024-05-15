const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = 3002;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'sccinventory'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});


app.get('/teacher/exists', (req, res) => {
  connection.query('SELECT username FROM teacheraccount', (err, results) => {
    if (err) {
      console.error('Error fetching user accounts:', err);
      res.status(500).json({ error: 'Error fetching user accounts' });
      return;
    }
    const usernames = results.map(result => result.username);
    res.json({ usernames });
  });
});


app.post('/teacheraccount/login', (req, res) => {
  const { username, password } = req.body;
  connection.query('SELECT * FROM teacheraccount WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      console.error('Error verifying teacher account:', err);
      res.status(500).json({ error: 'Error verifying teacher account' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Teacher account not found or invalid credentials' });
      return;
    }

    const user = results[0];
    const isUserOnline = onlineUsers.find(user => user.username === username);
    if (!isUserOnline) {
      connection.query('UPDATE teacheraccount SET is_online = 1 WHERE id = ?', [user.id], (err, result) => {
        if (err) {
          console.error('Error updating online status:', err);
          res.status(500).json({ error: 'Error updating online status' });
          return;
        }
        console.log(`Teacher ${username} is now online`);
        onlineUsers.push({ username });
      });
    }

    res.json(user);
  });
});

app.get('/onlineTeachers', (_, res) => {
  connection.query('SELECT username FROM teacheraccount WHERE is_online = 1', (err, results) => {
    if (err) {
      console.error('Error fetching online teachers:', err);
      res.status(500).json({ error: 'Error fetching online teachers' });
      return;
    }
    const usernames = results.map(result => result.username);
    res.json(usernames);
  });
});

app.post('/teacheraccount/register', (req, res) => {
  const { username, password } = req.body;
  connection.query('INSERT INTO teacheraccount (username,password) VALUES (?, ?)', [username, password], (err, result) => {
    if (err) {
      console.error('Error adding new teacher account:', err);
      res.status(500).json({ error: 'Error adding new teacher account' });
      return;
    }
    res.json({ id: result.insertId, username, password });
  });
});

app.get('/teacheraccount', (req, res) => {
  connection.query('SELECT * FROM teacheraccount', (err, results) => {
    if (err) {
      console.error('Error fetching data from teacher database:', err);
      res.status(500).json({ error: 'Error fetching data from teacher database' });
      return;
    }
    res.json(results);
  });
});

app.get('/teacheraccount', (req, res) => {
  const { teacherId } = req.query;

  connection.query('SELECT * FROM teacheraccount WHERE teacher_id = ?', [teacherId], (err, result) => {
    if (err) {
      console.error('Error checking teacher ID:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json(result);
  });
});


// Handle GET request to fetch all student profile data
app.get('/studentprofiles', (req, res) => {
  connection.query('SELECT * FROM studentprofile', (err, result) => {
    if (err) {
      console.error('Error fetching student profiles:', err);
      res.status(500).send('Error fetching student profiles');
      return;
    }

    res.json(result);
  });
});


app.get('/studentprofile', (req, res) => {
  const { schoolId } = req.query;

  connection.query('SELECT * FROM studentprofile WHERE school_id = ?', [schoolId], (err, result) => {
    if (err) {
      console.error('Error checking school ID:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json(result);
  });
});


// Handle POST request to insert a new student profile and account
app.post('/studentprofile', (req, res) => {
  const { schoolId, email, lastname, course, firstname, section, middleInitial, year, age, contact} = req.body;

  connection.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      res.status(500).send('Error starting transaction');
      return;
    }

    connection.query(
      'INSERT INTO studentprofile(school_id, email, last_name, course, first_name, section, middle_initial, year_level, age, contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [schoolId, email, lastname, course, firstname, section, middleInitial, year, age, contact],
      (err, profileResult) => {
        if (err) {
          console.error('Error inserting into studentprofile table:', err);
          connection.rollback(() => {
            res.status(500).send('Error inserting into studentprofile table');
          });
          return;
        }
            connection.commit((err) => {
              if (err) {
                console.error('Error committing transaction:', err);
                connection.rollback(() => {
                  res.status(500).send('Error committing transaction');
                });
                return;
              }

              res.status(201).send('Student profile and account inserted successfully');
            });
          }
        );
      }
    );
  });


  app.get('/studentprofile/exists', (req, res) => {
    connection.query('SELECT school_id FROM studentprofile', (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }   
  
      const schoolIds = results.map(result => result.school_id);
      res.json({ schoolIds });
    });
  });

  app.get('/teachersid/exist', (req, res) => {
    connection.query('SELECT teacherId FROM teacherprofile', (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  

  const teacherIds = results.map(result => result.teacherId);
  res.json({ teacherIds });
});
});

  app.post('/teacherprofile', (req, res) => {
    const { teacherId, email, lastname, department, firstname, contact, middleInitial, age } = req.body;
  
    connection.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        res.status(500).send('Error starting transaction');
        return;
      }
  
      connection.query(
        'INSERT INTO teacherprofile(teacherId, email, lastname, department, firstname, contact, middleInitial, age) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [teacherId, email, lastname, department, firstname, contact, middleInitial, age],
        (err, profileResult) => {
          if (err) {
            console.error('Error inserting into teacherprofile table:', err);
            connection.rollback(() => {
              res.status(500).send('Error inserting into teacherprofile table');
            });
            return;
          }
          
          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              connection.rollback(() => {
                res.status(500).send('Error committing transaction');
              });
              return;
            }
  
            res.status(201).send('Teacher profile and account inserted successfully');
          });
        }
      );
    });
  });

// Make the server publicly accessible
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


