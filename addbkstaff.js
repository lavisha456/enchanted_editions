const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname)); 

// Database connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'library_management_system'
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Staff_home.html'));
});


// Fetch all books
app.get('/books', async (req, res) => {
    try {
        const [books] = await db.query('SELECT * FROM books');
        res.json(books);
    } catch (error) {
        res.status(500).send({ message: error.message || 'Error fetching books' });
    }
});

// Add a new book
app.post('/add-book', async (req, res) => {
    const { Serial_number, Book_ID, Book_Name, Author_Name, Link, Image } = req.body;
    try {
        await db.query(
            'INSERT INTO books (Serial_number, Book_ID, Book_Name, Author_Name, Link, Image, Borrowed_Status) VALUES (?, ?, ?, ?, ?, ?, "Available")',
            [Serial_number, Book_ID, Book_Name, Author_Name, Link, Image]
        );
        res.status(201).send({ message: 'Book added successfully!' });
    } catch (error) {
        res.status(500).send({ message: error.message || 'Failed to add book' });
    }
});

app.delete('/delete-book/:bookId', async (req, res) => {
    const { bookId } = req.params;
    console.log('Received Book ID:', bookId);
    console.log('DELETE request received for Book_ID:', bookId);

    try {
        const [result] = await db.query('DELETE FROM books WHERE Book_ID = ?', [bookId]);
        console.log('Delete result:', result);

        if (result.affectedRows === 0) {
            res.status(404).send({ message: 'Book not found' });
        } else {
            res.send({ message: 'Book deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).send({ message: 'Failed to delete the book' });
    }
});



// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
