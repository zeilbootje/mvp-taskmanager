const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');


const PORT = process.env.PORT || 3000; /* use environment variable or default to 3000 */

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  } else {
    console.log('Connected to the database.');
    console.log('DB Host:', process.env.DB_HOST);
  }
});

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public'))); /* tells express to serve everything in the public map */


app.get('/api/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error'});
        }
        res.json(results); /* stuurt terug als JSON */
    });
});

app.post('/data', (req, res) => {
    const { Title, date, Notes } = req.body;
    const formattedDate = date.replace('T', ' ');
    const sql = 'INSERT INTO tasks (title, task_date, notes) VALUES (?, ?, ?)';
    db.query(sql, [Title, formattedDate, Notes], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        res.send('Message received and stored!');
    });
});

/* Start server */
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



