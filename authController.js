const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Handle user signup
exports.signup = (req, res) => {
    const { username, email, password } = req.body;

    // Check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ error: 'Password hashing error' });
            }

            // Insert the new user into the database
            db.query(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: 'Database insertion error' });
                    }

                    res.status(201).json({ message: 'User created successfully' });
                }
            );
        });
    });
};

// Handle user login
exports.login = (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Compare the password with the hashed one
        bcrypt.compare(password, result[0].password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Password comparison error' });
            }

            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid password' });
            }

            // Create JWT token
            const token = jwt.sign({ userId: result[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Set token as a cookie
            res.cookie('auth_token', token, { httpOnly: true, maxAge: 3600000 });

            res.status(200).json({ message: 'Login successful', token });
        });
    });
};

// Middleware to verify token
exports.verifyToken = (req, res, next) => {
    const token = req.cookies.auth_token || req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'Token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        req.user = decoded;
        next();
    });
};

// Profile route (protected)
exports.profile = (req, res) => {
    const userId = req.user.userId;

    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user: result[0] });
    });
};
