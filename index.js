const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const PORT = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Reidinga14!SQL',
    database: 'taskDB'
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


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



