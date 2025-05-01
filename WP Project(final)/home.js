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
                    <button class="borrow-button" data-id="${book.Book_ID}" ${book.Borrowed_Status === 'borrowed' ? 'disabled' : ''}>Borrow</button>
                </div>
            `;

            bookContainer.appendChild(bookBox);
        });

        document.querySelectorAll('.borrow-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const bookId = e.target.getAttribute('data-id');

                fetch('/borrow', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ bookId }),
                })
                .then(response => {
                    if (response.ok) {
                        e.target.disabled = true;
                        e.target.closest('.book-details').querySelector('p:nth-child(3)').innerText = 'Status: Borrowed';
                        alert('Book borrowed successfully!');
                    } else {
                        alert('Failed to borrow the book.');
                    }
                })
                .catch(error => console.error('Error borrowing book:', error));
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

