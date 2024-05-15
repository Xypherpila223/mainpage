const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
const express = require('express');

const app = express();
const port = 3010;

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'sccinventory'
});

// Connect to the database
connection.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware to check for duplicate ticket
const checkDuplicateTicket = (req, res, next) => {
    const { email, ticketnum } = req.body;
    const sql = "SELECT COUNT(*) as count FROM tickets WHERE email = ? OR ticketnum = ?";
    const values = [email, ticketnum];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error checking duplicate ticket:', err);
            res.status(500).send('Failed to submit the form. Please try again.');
            return;
        }
        const count = result[0].count;
        if (count > 0) {
            res.status(400).send('Ticket with the same information already exists.');
        } else {
            next(); // Proceed to the next middleware
        }
    });
};

// Routes
app.get('/alltickets', (req, res) => {
    const sql = "SELECT * FROM tickets";
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching all tickets:', err);
            res.status(500).send('Failed to fetch all tickets.');
            return;
        }
        res.json(result);
    });
});

app.post('/Ticketsubmit', checkDuplicateTicket, (req, res) => {
    const { firstname, surname, section, course, email, number, message, ticketnum } = req.body;
    const sql = "INSERT INTO tickets (firstname, surname, section, course, email, number, message, ticketnum) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [firstname, surname, section, course, email, number, message, ticketnum];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting into database:', err);
            res.status(500).send('Failed to submit the form. Please try again.');
            return;
        }
        res.status(200).send('Form submitted successfully!');
    });
});

app.get('/getNextTicketNumber', (req, res) => {
    const sql = "SELECT ticketnum FROM tickets ORDER BY ticketnum DESC LIMIT 1";
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching ticket number:', err);
            res.status(500).send('Error fetching ticket number.');
            return;
        }
        let nextTicketNum = result.length > 0 ? result[0].ticketnum + 1 : 1;
        res.send({ ticketNumber: nextTicketNum });
    });
});

app.get('/ticketInfo', (req, res) => {
    const sql = "SELECT firstname, ticketnum FROM tickets ORDER BY ticketnum DESC LIMIT 1";
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching ticket information:', err);
            res.status(500).send('Failed to fetch ticket information');
            return;
        }
        const ticketInfo = result.length > 0 ? {
            customerName: result[0].firstname,
            ticketNumber: result[0].ticketnum
        } : null;
        if (ticketInfo) {
            res.json(ticketInfo);
        } else {
            res.status(404).send('Ticket information not found');
        }
    });
});

app.post('/calendar', (req, res) => {
    const { selectedDate, selectedTime } = req.body;
    const sql = `INSERT INTO calendar_entries (selected_date, selected_time) VALUES (?, ?)`;
    connection.query(sql, [selectedDate, selectedTime], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ error: 'Error inserting data' });
            return;
        }
        res.status(200).json({ message: 'Data inserted successfully' });
    });
});

app.post('/insertFormData', (req, res) => {
    const { schoolId, firstName, lastName, email, equipment, room, status, selectedDate1, selectedTime1, selectedDate2, selectedTime2, section, sectionRoom } = req.body;

    // Check if a request with the same equipment, room, and status "requested" already exists
    const checkQuery = 'SELECT * FROM userrequest WHERE equipment = ? AND room = ? AND status = ?';
    connection.query(checkQuery, [equipment, room, 'requested'], (checkError, checkResults, checkFields) => {
        if (checkError) {
            console.error('Error checking existing request:', checkError);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (checkResults.length > 0) {
            // Update existing request
            const updateQuery = 'UPDATE requester SET school_id = ?,status ="REQUESTED",selected_date1 = ?, selected_time1 = ?, selected_date2 = ?, selected_time2 = ? WHERE equipment = ? AND room = ?';
            const updateValues = [schoolId, selectedDate1, selectedTime1, selectedDate2, selectedTime2, equipment, room];
            connection.query(updateQuery, updateValues, (updateError, updateResults, updateFields) => {
                if (updateError) {
                    console.error('Error updating existing request:', updateError);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.json(updateResults);
            });
        } else {
            // Insert new request
            const insertQuery = 'INSERT INTO userrequest (school_id, first_name, last_name, email, equipment, room, status, selected_date1, selected_time1, selected_date2, selected_time2, section, section_room) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const insertValues = [schoolId, firstName, lastName, email, equipment, room, status, selectedDate1, selectedTime1, selectedDate2, selectedTime2, section, sectionRoom];
            connection.query(insertQuery, insertValues, (insertError, insertResults, insertFields) => {
                if (insertError) {
                    console.error('Error inserting new request:', insertError);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.json(insertResults);
            });
        }
    });
});




app.get('/allrequests', (req, res) => {
    connection.query('SELECT * FROM requester', (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
    });
});

app.post('/calendars', (req, res) => {
    const { selectedDate1, selectedTime1, selectedDate2, selectedTime2 } = req.body;
    const sql = `INSERT INTO calendar_entriess (selected_date1, selected_time1, selected_date2, selected_time2) VALUES (?, ?, ?, ?)`;
    connection.query(sql, [selectedDate1, selectedTime1, selectedDate2, selectedTime2], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Error inserting data');
        }
        res.send('Data successfully inserted');
    });
});

app.get('/calendars', (req, res) => {
    const sql = 'SELECT * FROM calendar_entriess';
connection.query(sql, (err, results) => {
if (err) {
console.error('Error fetching data:', err);
return res.status(500).send('Error fetching data');
}
res.json(results);
});
});

// Start the server
app.listen(port, () => {
console.log('Server is running on port 3010');
});