const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db'); // Assuming the MySQL connection is in db.js

// Example of a login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Here you would check credentials from the database
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).send('Error checking user');
        }

        if (results.length > 0 && results[0].password === password) {
            // Create JWT token if credentials are correct
            const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            res.status(200).send('Login successful');
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});

module.exports = router;
