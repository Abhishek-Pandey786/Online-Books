// URL for local JSON file and remote API endpoint
const localJsonUrl = 'books.json';
const remoteApiUrl = 'https://api.nytimes.com/svc/books/v3/lists/2019-01-20/hardcover-fiction.json?api-key=QTd4H7HDVpLKhqIqtV42NmAthrt8ub4b';

let booklist = [];
let currentPage = 1;
const booksPerPage = 5;

// Event listeners setup once the window has loaded
window.onload = () => {
    // Fetch local books on button click
    document.getElementById('fetch-local').addEventListener('click', async () => {
        document.getElementById("loading").style.display = "block";
        try {
            const response = await fetch(localJsonUrl);
            const data = await response.json();
            booklist = data;
            displayBooks();
        } catch (error) {
            console.error('Error fetching local books:', error);
        } finally {
            document.getElementById("loading").style.display = "none";
        }
    });

    // Fetch remote books on button click
    document.getElementById('fetch-remote').addEventListener('click', async () => {
        document.getElementById("loading").style.display = "block";
        try {
            const response = await fetch(remoteApiUrl);
            const data = await response.json();
            booklist = data.results.books.map(book => ({
                bookId: book.primary_isbn13,
                title: book.title,
                author: book.author,
                pages: book.number_of_pages,
                rating: book.rank,
                category: book.list_name,
                price: '$' + (Math.random() * 50 + 10).toFixed(2) // Random price for demo
            }));
            displayBooks();
        } catch (error) {
            console.error('Error fetching remote books:', error);
        } finally {
            document.getElementById("loading").style.display = "none";
        }
    });

    // Sign-up form validation
    document.getElementById('signupForm').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevents form from submitting the traditional way
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (username && email && password) {
            document.getElementById('signup-message').innerText = 'Sign up successful!';
            document.getElementById('signupForm').reset(); // Clears the form
        } else {
            document.getElementById('signup-message').innerText = 'Please fill all fields.';
        }
    });
}

// Function to display books with pagination, sorting, and filtering
function displayBooks() {
    const sortBy = document.getElementById('sort').value;
    const filterCategory = document.getElementById('category').value.toLowerCase();
    let filteredBooks = booklist;

    // Filtering books by category
    if (filterCategory) {
        filteredBooks = filteredBooks.filter(book => 
            book.category.toLowerCase().includes(filterCategory)
        );
    }

    // Sorting books
    filteredBooks.sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'author') return a.author.localeCompare(b.author);
        if (sortBy === 'rating') return b.rating - a.rating;
    });

    // Paginate books
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    const booklistElement = document.getElementById('booklist');
    booklistElement.innerHTML = '';

    if (paginatedBooks.length === 0) {
        booklistElement.innerHTML = '<p class="text-center text-gray-500">No books available.</p>';
        return;
    }

    // Create and append book elements
    paginatedBooks.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'single-book';

        const bookImg = document.createElement('img');
        bookImg.src = book.book_image || 'https://via.placeholder.com/100';
        bookImg.className = 'book-image';
        bookImg.width = 100;
        bookImg.height = 100;

        const bookInfo = document.createElement('div');
        bookInfo.className = 'book-info';

        const title = document.createElement('div');
        title.className = 'book-title';
        title.innerHTML = book.title;

        const author = document.createElement('div');
        author.className = 'book-author';
        author.innerHTML = book.author;

        const desc = document.createElement('div');
        desc.className = 'book-desc';
        desc.innerHTML = `${book.pages || 'N/A'} pages<br>Category: ${book.category || 'Not Available'}<br>Rating: ${book.rating || 'N/A'}<br>Price: ${book.price}`;

        bookInfo.appendChild(title);
        bookInfo.appendChild(author);
        bookInfo.appendChild(desc);
        bookElement.appendChild(bookImg);
        bookElement.appendChild(bookInfo);
        booklistElement.appendChild(bookElement);
    });

    // Display pagination controls
    displayPagination(filteredBooks.length);
}

// Function to display pagination controls
function displayPagination(totalBooks) {
    const totalPages = Math.ceil(totalBooks / booksPerPage);
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = 'fetchButton';
        pageButton.innerText = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayBooks();
        });
        paginationElement.appendChild(pageButton);
    }
}
