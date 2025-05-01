fetch('/books')
    .then(response => response.json())
    .then(data => {
        const bookContainer = document.getElementById('book-container');

        data.forEach(book => {
            const bookBox = document.createElement('div');
            bookBox.className = 'book-box';

            bookBox.innerHTML = `
                <img src="/Book Thumbnails/${book.Image}" alt="${book.Book_Name}" class="book-cover">
                <div class="book-details">
                    <p><strong>Title:</strong> ${book.Book_Name}</p>
                    <p><strong>Author:</strong> ${book.Author_Name}</p>
                    <p><strong>Status:</strong> ${book.Borrowed_Status}</p>
                    <button class="delete-button" data-id="${book.Book_ID}">Delete</button>
                </div>
            `;

            bookContainer.appendChild(bookBox);
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const bookId = e.target.getAttribute('data-id');

                fetch(`/delete-book/${bookId}`, {
                    method: 'DELETE',
                })
                .then(response => {
                    if (response.ok) {
                        e.target.closest('.book-box').remove();
                        alert('Book deleted successfully!');
                    } else {
                        alert('Failed to delete the book.');
                        console.error('Delete failed:', response.status, response.statusText);
                    }
                })
                .catch(error => console.error('Error deleting book:', error));
            });
        });
    })
    .catch(error => console.error('Error fetching books:', error));

    function searchBooks() {
        const input = document.getElementById('searchBooks').value.toLowerCase();
        const staticBooks = document.getElementsByClassName('books'); // Hardcoded <li> books
        const dynamicBooks = document.querySelectorAll('#book-container .book-box'); // Dynamically loaded books
        const noResults = document.getElementById('noResults');
        let found = false;
    
        // Search static books
        for (let i = 0; i < staticBooks.length; i++) {
            if (staticBooks[i].textContent.toLowerCase().includes(input)) {
                staticBooks[i].style.display = "list-item";
                found = true;
            } else {
                staticBooks[i].style.display = "none";
            }
        }
    
        // Search dynamic books
        dynamicBooks.forEach(book => {
            const title = book.querySelector('.book-details p strong').nextSibling.textContent.trim().toLowerCase();
            if (title.includes(input)) {
                book.style.display = "block";
                found = true;
            } else {
                book.style.display = "none";
            }
        });
    
        // Show or hide the "No books found" message
        if (found) {
            noResults.style.display = "none";
        } else {
            noResults.style.display = "block";
        }
    }
    
    
    function showBooks() {
        const container = document.getElementById('booklist-container');
        container.style.display = "block"; // Always display when typing
    }

    function hideBooks() {
        const container = document.getElementById('booklist-container');
        const input = document.getElementById('searchBooks').value;
        if (!input) {
            container.style.display = "none"; // Only hide if the search box is empty
        }
    }
    
    // Event listener to hide the book list when clicking outside
    document.addEventListener('click', (event) => {
        const searchBar = document.getElementById('searchBooks');
        const bookListContainer = document.getElementById('booklist-container');
    
        // Check if the clicked element is outside the search bar or book list
        if (!searchBar.contains(event.target) && !bookListContainer.contains(event.target)) {
            bookListContainer.style.display = "none";
        }
    });




