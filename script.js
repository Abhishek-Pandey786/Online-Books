const baseURL = "https://api.nytimes.com/svc/books/v3/lists/2019-01-20/hardcover-fiction.json?api-key=QTd4H7HDVpLKhqIqtV42NmAthrt8ub4b";
const localDataURL = 'books.json';
const defaultImageURL = "images/programming-image.jpg";

let booklist = [];
let currentPage = 1;
const booksPerPage = 3;

window.onload = () => {
    const signUpForm = document.getElementById('signupForm');
    const signedInAs = document.getElementById('signedInAs');
    const loadingElement = document.getElementById('loading');
    const bookListContainer = document.getElementById('booklist');
    const filterCategory = document.getElementById('filterCategory');
    const sortOptions = document.getElementById('sortOptions');
    const fetchRemoteButton = document.getElementById('fetchRemoteButton');
    const fetchLocalButton = document.getElementById('fetchLocalButton');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');

    // Handle sign-up form submission
    signUpForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        if (name) {
            signedInAs.innerHTML = `Signed in as: ${name}`;
            signedInAs.style.display = 'block';
            signUpForm.style.display = 'none';
            fetchRemoteButton.disabled = false;
            fetchLocalButton.disabled = false;
        }
    });

    // Display Books
    function displayBooks() {
        const startIndex = (currentPage - 1) * booksPerPage;
        const endIndex = startIndex + booksPerPage;
        const booksToDisplay = booklist.slice(startIndex, endIndex);

        bookListContainer.innerHTML = '';
        booksToDisplay.forEach((book) => {
            const newBook = document.createElement('div');
            newBook.className = 'single-book';

            const bookImg = document.createElement('img');
            bookImg.src = book.book_image || defaultImageURL;
            bookImg.className = 'book-image';
            bookImg.width = 100;
            bookImg.height = 100;

            const bookInfo = document.createElement('div');
            bookInfo.className = 'book-info';

            const bookId = document.createElement('div');
            bookId.className = 'book-id';
            bookId.innerHTML = `ID: ${book.bookId}`;

            const title = document.createElement('div');
            title.className = 'book-title';
            title.innerHTML = `Title: ${book.title}`;

            const author = document.createElement('div');
            author.className = 'book-author';
            author.innerHTML = `Author: ${book.author}`;

            const pages = document.createElement('div');
            pages.className = 'book-pages';
            pages.innerHTML = `Pages: ${book.pages}`;

            const rating = document.createElement('div');
            rating.className = 'book-rating';
            rating.innerHTML = `Rating: ${book.rating}`;

            const price = document.createElement('div');
            price.className = 'book-price';
            price.innerHTML = `Price: ${book.price}`;

            bookInfo.appendChild(bookId);
            bookInfo.appendChild(title);
            bookInfo.appendChild(author);
            bookInfo.appendChild(pages);
            bookInfo.appendChild(rating);
            bookInfo.appendChild(price);
            newBook.appendChild(bookImg);
            newBook.appendChild(bookInfo);
            bookListContainer.appendChild(newBook);
        });
    }

    // Fetch Books Function
    async function fetchBooks(url) {
        try {
            loadingElement.style.display = 'block';
            const response = await fetch(url);
            const data = await response.json();
            booklist = data.results ? data.results.books : data; // Handle remote and local data
            applySortAndFilter();
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            loadingElement.style.display = 'none';
        }
    }

    // Fetch Local Books
    fetchLocalButton.addEventListener('click', () => {
        fetchBooks(localDataURL);
    });

    // Fetch Remote Books
    fetchRemoteButton.addEventListener('click', () => {
        fetchBooks(baseURL);
    });

    // Sort and Filter Functionality
    function applySortAndFilter() {
        let filteredBooks = [...booklist];

        // Filter by category
        const selectedCategory = filterCategory.value;
        if (selectedCategory !== 'all') {
            filteredBooks = filteredBooks.filter(book => book.category.toLowerCase() === selectedCategory.toLowerCase());
        }

        // Sort the books
        const selectedSort = sortOptions.value;
        filteredBooks.sort((a, b) => {
            if (a[selectedSort] < b[selectedSort]) return -1;
            if (a[selectedSort] > b[selectedSort]) return 1;
            return 0;
        });

        booklist = filteredBooks;
        displayBooks();
    }

    // Pagination
    function paginate(direction) {
        const totalPages = Math.ceil(booklist.length / booksPerPage);
        if (direction === 'next' && currentPage < totalPages) {
            currentPage++;
        } else if (direction === 'prev' && currentPage > 1) {
            currentPage--;
        }
        displayBooks();
    }

    // Event listeners for sort, filter, and pagination
    filterCategory.addEventListener('change', applySortAndFilter);
    sortOptions.addEventListener('change', applySortAndFilter);
    nextPageButton.addEventListener('click', () => paginate('next'));
    prevPageButton.addEventListener('click', () => paginate('prev'));
};
