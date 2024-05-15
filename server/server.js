const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = 3003;

let onlineUsers = [];

app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'sccinventory'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
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


app.post('/studentaccount/login', (req, res) => {
  const { username, password } = req.body;
  connection.query('SELECT * FROM studentaccount WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      console.error('Error verifying student account:', err);
      res.status(500).json({ error: 'Error verifying student account' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Student account not found or invalid credentials' });
      return;
    }

    const user = results[0];
    const isUserOnline = onlineUsers.find(user => user.username === username);
    if (!isUserOnline) {
      connection.query('UPDATE studentaccount SET is_online = 1 WHERE id = ?', [user.id], (err, result) => {
        if (err) {
          console.error('Error updating online status:', err);
          res.status(500).json({ error: 'Error updating online status' });
          return;
        }
        console.log(`User ${username} is now online`);
        onlineUsers.push({ username });
      });
    }

    res.json(user);
  });
});

app.get('/onlineusers', (_, res) => {
  connection.query('SELECT username FROM studentaccount WHERE is_online = 1', (err, results) => {
    if (err) {
      console.error('Error fetching online users:', err);
      res.status(500).json({ error: 'Error fetching online users' });
      return;
    }
    const usernames = results.map(result => result.username);
    res.json(usernames);
  });
});

app.post('/studentaccount/register', (req, res) => {
  const { username, password } = req.body;
  connection.query('INSERT INTO studentaccount (username,password) VALUES (?, ?)', [username, password], (err, result) => {
    if (err) {
      console.error('Error adding new student account:', err);
      res.status(500).json({ error: 'Error adding new student account' });
      return;
    }
    res.json({ id: result.insertId, username, password });
  });
});

app.get('/studentaccount', (req, res) => {
  connection.query('SELECT * FROM studentaccount', (err, results) => {
    if (err) {
      console.error('Error fetching data from database:', err);
      res.status(500).json({ error: 'Error fetching data from database' });
      return;
    }
    res.json(results);
  });
});

app.put('/studentaccount/:username', (req, res) => {
  const { username } = req.params;
  const { is_online } = req.body;

  connection.query('UPDATE studentaccount SET is_online = ? WHERE username = ?', [is_online, username], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ error: 'Error updating user' });
      return;
    }
    res.json({ message: 'User updated successfully' });
  });
});

app.get('/studentaccount', async (req, res) => {
  try {
    // Fetch student accounts from your database or external service
    // For example, using a hypothetical StudentAccount model
    const studentAccounts = await StudentAccount.find(); // Assuming you're using Mongoose

    res.json(studentAccounts);
  } catch (error) {
    console.error('Error fetching student accounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Add a new route to fetch student profile by school ID



app.get('/studentprofiles', (req, res) => {
  connection.query('SELECT * FROM studentprofile', (err, results) => {
    if (err) {
      console.error('Error fetching data from database:', err);
      res.status(500).json({ error: 'Error fetching data from database' });
      return;
    }
    res.json(results);
  });
}); 

app.get('/studentprofiles/:schoolId', (req, res) => {
  const { schoolId } = req.params;
  connection.query(
    'SELECT first_name, last_name, course, section, email FROM studentprofile WHERE school_id = ?',
    [schoolId],
    (err, results) => {
      if (err) {
        console.error('Error fetching data from database:', err);
        res.status(500).json({ error: 'Error fetching data from database' });
        return;
      }
      console.log('Fetched data:', results); // Log the fetched data
      res.json(results);
    }
  );
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
