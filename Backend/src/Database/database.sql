-- Users Table with course information
-- Users Table with image URL
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
    image_url VARCHAR(255),  -- URL of the user's profile image
    phone_number VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the user was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- When the user information was last updated
);

-- Books Table with image URL
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
    image_url VARCHAR(255),  -- URL of the book's cover image
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the book was added
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- When the book information was last updated
);

-- Loans Table
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

-- Reviews Table (User Reviews for Books)
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,  -- User who left the review
    book_id INT REFERENCES books(book_id) ON DELETE CASCADE,  -- Book being reviewed
    rating INT CHECK (rating >= 1 AND rating <= 5),  -- Rating (1 to 5)
    review_text TEXT,  -- Optional text review
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the review was added
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the review was last updated
    UNIQUE(user_id, book_id)  -- Ensure each user can only review a book once
);

-- Trigger Function to Update Book Rating after Review Change
CREATE OR REPLACE FUNCTION update_book_rating() 
RETURNS TRIGGER AS $$
BEGIN
    UPDATE books
    SET average_rating = (
        SELECT AVG(rating)
        FROM reviews
        WHERE book_id = NEW.book_id
    )
    WHERE book_id = NEW.book_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update the book rating when a review is inserted, updated, or deleted
CREATE TRIGGER update_book_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_book_rating();
