-- Users Table with Course Information and Profile Image URL
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,  -- Full name of the user
    email VARCHAR(100) NOT NULL UNIQUE,  -- Email address
    password VARCHAR(255) NOT NULL,  -- Hashed password
    sex VARCHAR(10) CHECK(sex IN ('male', 'female', 'other')) NOT NULL,  -- Sex (male/female/other)
    age INT CHECK(age >= 0),  -- Age of the user
    studying BOOLEAN NOT NULL DEFAULT TRUE,  -- Whether the user is currently studying or not
    course VARCHAR(255),  -- Course that the user is studying
    role VARCHAR(10) CHECK(role IN ('user', 'admin')) NOT NULL DEFAULT 'user',
    userimage VARCHAR(255),  -- URL of the user's profile image
    phone_number VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the user was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- When the user information was last updated
);

-- Books Table (Remove download_count)
CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,  -- Title of the book
    author VARCHAR(100),  -- Author of the book
    category VARCHAR(100),  -- Category/genre of the book
    isbn VARCHAR(20) UNIQUE,  -- ISBN number (unique for each book)
    publication_year INT,  -- Year the book was published
    quantity INT DEFAULT 0,  -- Total number of copies available in the library
    available INT DEFAULT 0,  -- Number of available copies for loan
    average_rating FLOAT DEFAULT 0,  -- Average rating of the book
    bookimage VARCHAR(255),  -- URL of the book's cover image
    description TEXT,  -- Description of the book
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the book was added
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- When the book information was last updated
);

-- Ebooks Table (Includes download_count)
CREATE TABLE ebooks (
    ebook_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,  -- Title of the ebook
    author VARCHAR(100),  -- Author of the ebook
    category VARCHAR(100),  -- Category/genre of the ebook
    isbn VARCHAR(20) UNIQUE,  -- ISBN number (unique for each ebook)
    publication_year INT,  -- Year the ebook was published
    download_count INT DEFAULT 0,  -- Counter for ebook downloads
    ebookimage VARCHAR(255),  -- URL of the ebook's cover image
    description TEXT,  -- Description of the ebook   
    average_rating FLOAT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the ebook was added
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- When the ebook information was last updated
);

-- Audiobooks Table (Includes download_count)
CREATE TABLE audiobooks (
    audiobook_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,  -- Title of the audiobook
    author VARCHAR(100),  -- Author of the audiobook
    category VARCHAR(100),  -- Category/genre of the audiobook
    isbn VARCHAR(20) UNIQUE,  -- ISBN number (unique for each audiobook)
    publication_year INT,  -- Year the audiobook was published
    download_count INT DEFAULT 0,  -- Counter for audiobook downloads
    audioimage VARCHAR(255),  -- URL of the audiobook's cover image
    description TEXT,  -- Description of the audiobook
    average_rating FLOAT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the audiobook was added
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- When the audiobook information was last updated
);

-- Articles Table (Includes download_count)
CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,  -- Title of the article
    author VARCHAR(100),  -- Author of the article
    category VARCHAR(100),  -- Category/genre of the article
    publication_year INT,  -- Year the article was published
    download_count INT DEFAULT 0,  -- Counter for article downloads
    articleimage VARCHAR(255),  -- URL of the article's cover image
    description TEXT,  -- Description of the article
    average_rating FLOAT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the article was added
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- When the article information was last updated
);

-- Journals Table (Includes download_count)
CREATE TABLE journals (
    journal_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,  -- Title of the journal
    author VARCHAR(100),  -- Author of the journal
    category VARCHAR(100),  -- Category/genre of the journal
    publication_year INT,  -- Year the journal was published
    download_count INT DEFAULT 0,  -- Counter for journal downloads
    journalimage VARCHAR(255),  -- URL of the journal's cover image
    description TEXT,  -- Description of the journal
    average_rating FLOAT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the journal was added
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- When the journal information was last updated
);

-- Loans Table (For Books Loan Tracking)
CREATE TABLE loans (
    loan_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,  -- User who borrowed the book
    book_id INT REFERENCES books(book_id) ON DELETE CASCADE,  -- Book that was borrowed
    loan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Date when the book was borrowed
    return_date TIMESTAMP,  -- Date when the book was returned
    due_date TIMESTAMP NOT NULL,  -- Due date for returning the book
    returned BOOLEAN DEFAULT FALSE,  -- Whether the book has been returned
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the loan was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- When the loan details were last updated
);

-- Downloads Table (For Download Tracking of Ebooks, Audiobooks, Articles, and Journals)
CREATE TABLE downloads (
    download_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,  -- User who downloaded the content
    content_type VARCHAR(50) CHECK(content_type IN ('ebook', 'audiobook', 'article', 'journal')),  -- Type of content downloaded
    content_id INT,  -- ID of the downloaded content (ebook_id, audiobook_id, article_id, journal_id)
    download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Date when the download occurred
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the download record was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the download record was last updated
    UNIQUE(user_id, content_type, content_id)
);

-- Favorites Table
CREATE TABLE favorites (
    favorite_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,  -- User who added the content to their favorites
    content_type VARCHAR(50) CHECK(content_type IN ('book', 'ebook', 'audiobook', 'article', 'journal')),  -- Type of content (book, ebook, audiobook, article, journal)
    content_id INT,  -- ID of the content (book_id, ebook_id, audiobook_id, article_id, journal_id)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the favorite was added
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the favorite was last updated
    UNIQUE(user_id, content_type, content_id)
);

-- Reviews Table (User Reviews for Books, Ebooks, Audiobooks, Articles, and Journals)
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,  -- User who left the review
    content_type VARCHAR(50) CHECK(content_type IN ('book', 'ebook', 'audiobook', 'article', 'journal')),  -- Type of content being reviewed
    content_id INT,  -- ID of the content being reviewed (book_id, ebook_id, audiobook_id, article_id, journal_id)
    rating INT CHECK (rating >= 1 AND rating <= 5),  -- Rating (1 to 5)
    review_text TEXT,  -- Optional text review
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the review was added
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the review was last updated
    UNIQUE(user_id, content_type, content_id)  -- Ensure each user can only review a content once
);

-- Trigger Function to Update Content Rating After Review Change
CREATE OR REPLACE FUNCTION update_content_rating() 
RETURNS TRIGGER AS $$
BEGIN
    -- For books
    UPDATE books
    SET average_rating = (
        SELECT AVG(rating)
        FROM reviews
        WHERE content_id = NEW.content_id AND content_type = 'book'
    )
    WHERE book_id = NEW.content_id;

    -- For ebooks
    UPDATE ebooks
    SET average_rating = (
        SELECT AVG(rating)
        FROM reviews
        WHERE content_id = NEW.content_id AND content_type = 'ebook'
    )
    WHERE ebook_id = NEW.content_id;

    -- For audiobooks
    UPDATE audiobooks
    SET average_rating = (
        SELECT AVG(rating)
        FROM reviews
        WHERE content_id = NEW.content_id AND content_type = 'audiobook'
    )
    WHERE audiobook_id = NEW.content_id;

    -- For articles
    UPDATE articles
    SET average_rating = (
        SELECT AVG(rating)
        FROM reviews
        WHERE content_id = NEW.content_id AND content_type = 'article'
    )
    WHERE article_id = NEW.content_id;

    -- For journals
    UPDATE journals
    SET average_rating = (
        SELECT AVG(rating)
        FROM reviews
        WHERE content_id = NEW.content_id AND content_type = 'journal'
    )
    WHERE journal_id = NEW.content_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to Update Content Rating on Insert, Update, or Delete of Review
CREATE TRIGGER update_content_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_content_rating();
