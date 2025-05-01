document.addEventListener('DOMContentLoaded', () => {
    const bookContainer = document.getElementById('book-container');
    const noBooksMessage = document.getElementById('no-books-message');

    fetch('/mybooks')
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                noBooksMessage.style.display = 'block';
                return;
            }

            data.forEach(book => {
                const bookBox = document.createElement('div');
                bookBox.className = 'book-box';

                bookBox.innerHTML = `
                    <img src="/Book Thumbnails/${book.Image}" alt="${book.Book_Name}" class="book-cover">
                    <div class="book-details">
                        <p><strong>Title:</strong> ${book.Book_Name}</p>
                        <p><strong>Author:</strong> ${book.Author_Name}</p>
                        <p><strong>Status:</strong> ${book.Borrowed_Status}</p>
                        <div class="button-group">
                            <button class="return-button" data-id="${book.Book_ID}">Return</button>
                            <button class="view-button" data-link="${book.Link}">View</button>
                        </div>
                    </div>
                `;

                bookContainer.appendChild(bookBox);
            });

            document.querySelectorAll('.return-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const bookId = e.target.getAttribute('data-id');

                    fetch('/return', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ bookId }),
                    })
                    .then(response => {
                        if (response.ok) {
                            e.target.closest('.book-box').remove();
                            if (bookContainer.children.length === 0) {
                                noBooksMessage.style.display = 'block';
                            }
                        } else {
                            console.error('Failed to return book');
                        }
                    });
                });
            });

            document.querySelectorAll('.view-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const bookLink = e.target.getAttribute('data-link');
                    window.open(bookLink, '_blank');
                });
            });
        })
        .catch(error => console.error('Error fetching borrowed books:', error));
});
