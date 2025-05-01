const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = 3000;

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'lavisha',
    database: 'Library_Management_System',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL!');
});

// Serve static files
app.use(express.static(__dirname));
app.use(express.json());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'User_home.html'));
});

app.get('/User_MyAccount.html', (req, res) => {
    res.sendFile(path.join(__dirname,  'User_MyAccount.html'));
});

// Fetch all books
app.get('/books', (req, res) => {
    const query = 'SELECT * FROM books';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching books:', err);
            res.status(500).send('Error fetching book data');
            return;
        }
        res.json(results);
    });
});

// Fetch borrowed books
app.get('/mybooks', (req, res) => {
    const query = 'SELECT * FROM books WHERE Borrowed_Status = "borrowed"';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching borrowed books:', err);
            res.status(500).send('Error fetching borrowed books');
            return;
        }
        res.json(results);
    });
});

// Borrow a book
app.post('/borrow', (req, res) => {
    const { bookId } = req.body;
    const query = 'UPDATE books SET Borrowed_Status = "borrowed" WHERE Book_ID = ?';

    db.query(query, [bookId], (err) => {
        if (err) {
            console.error('Error borrowing book:', err);
            res.status(500).send('Error borrowing book');
            return;
        }
        res.send('Book borrowed successfully');
    });
});

// Return a book
app.post('/return', (req, res) => {
    const { bookId } = req.body;
    const query = 'UPDATE books SET Borrowed_Status = "available" WHERE Book_ID = ?';

    db.query(query, [bookId], (err) => {
        if (err) {
            console.error('Error returning book:', err);
            res.status(500).send('Error returning book');
            return;
        }
        res.send('Book returned successfully');
    });
});

app.get('/user-info', (req, res) => {
    const Serial_number  = 1; 
    const query = 'SELECT Name, Email, DOB FROM user WHERE Serial_number  = ?';

    db.query(query, [Serial_number], (err, results) => {
        if (err) {
            console.error('Error fetching user info:', err);
            res.status(500).send('Error fetching user info');
            return;
        }

        if (results.length > 0) {
            // Send user data as JSON
            res.json(results[0]);
        } else {
            res.status(404).send('User not found');
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
