const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = 3004;

app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'PUT'],
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

// Get all student accounts
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

// Update a student account
app.put('/studentaccount/:username', (req, res) => {
  const { username } = req.params;
  const { password } = req.body;
  connection.query('UPDATE studentaccount SET password = ? WHERE username = ?', [password, username], (err, result) => {
    if (err) {
      console.error('Error updating data in database:', err);
      res.status(500).json({ error: 'Error updating data in database' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Student account not found' });
      return;
    }
    res.json({ username, password });
  });
});

// Make the server publicly accessible
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
