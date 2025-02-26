import pool from "../../Database/db.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Add book in database
export const addBook = async (req, res) => {
  const {
    title,
    author,
    category,
    isbn,
    publication,
    quantity,
    available,
    average_rating,
    description,
  } = req.body;

  const bookimage = req.file ? req.file.filename : null;

  if (
    !title ||
    !author ||
    !category ||
    !isbn ||
    !publication ||
    !quantity ||
    !available ||
    !average_rating ||
    !description
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (new Date(publication).getFullYear() > new Date().getFullYear()) {
    return res
      .status(400)
      .json({ message: "Publication year cannot be in the future." });
  }

  const isbnCheckQuery = "SELECT * FROM books WHERE isbn = $1";
  const isbnCheckResult = await pool.query(isbnCheckQuery, [isbn]);

  if (isbnCheckResult.rows.length > 0) {
    return res.status(400).json({ message: "ISBN must be unique." });
  }

  try {
    const query = `
      INSERT INTO books (title, author, category, isbn, publication_year, quantity, available, average_rating, bookimage, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING book_id, title, author, category, isbn, publication_year, quantity, available, average_rating, bookimage, description;
    `;
    const values = [
      title,
      author,
      category,
      isbn,
      publication,
      quantity,
      available,
      average_rating,
      bookimage,
      description,
    ];

    const result = await pool.query(query, values);

    return res.status(201).json({
      message: "Book added successfully",
      book: result.rows[0],
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding book", error: error.message });
  }
};

//get a Book Details
export const getBookDetails = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Book ID  is required" });
  }

  try {
    const result = await pool.query(
      `
        SELECT book_id, title, author, category, isbn, publication_year, quantity, available, average_rating, bookimage, description
        FROM books
        WHERE book_id = $1;
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching book", error: error.message });
  }
};

//Fetch the books on Category
export const getBookOnCategory = async (req, res) => {
  const { category } = req.params;

  try {
    let query =
      "SELECT book_id, title, author, category, isbn, publication_year, quantity, available, average_rating, bookimage, description FROM books";
    let params = [];

    if (category) {
      query += " WHERE category ILIKE $1";
      params = [category];
    }

    query += " LIMIT 20";
    
    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: category
          ? "No books found in this category"
          : "No books available",
      });
    }

    res.json({
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// edit book
export const editBook = async (req, res) => {
  const { book_id } = req.params;
  const {
    title,
    author,
    category,
    isbn,
    publication,
    quantity,
    available,
    average_rating,
    description,
  } = req.body;

  let bookImage;

  if (req.file) {
    try {
      const result = await pool.query(
        "SELECT bookimage FROM books WHERE book_id = $1",
        [book_id]
      );
      const book = result.rows[0];

      if (book && book.bookimage) {
        const oldImagePath = path.join(
          __dirname,
          "../../..",
          "public/image/book",
          book.bookimage
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      bookImage = req.file.filename;
    } catch {
      return res.status(500).json({ message: "Error deleting old image" });
    }
  } else {
    try {
      const result = await pool.query(
        "SELECT bookimage FROM books WHERE book_id = $1",
        [book_id]
      );

      const book = result.rows[0];
      if (book && book.bookimage) {
        bookImage = book.bookimage;
      }
    } catch {
      return res
        .status(500)
        .json({ message: "Error retrieving current image" });
    }
  }

  try {
    const query = `
      UPDATE books
      SET title = $1, author = $2, category = $3, isbn = $4, publication_year = $5, quantity = $6, 
          available = $7, average_rating = $8, description = $9, bookimage = $10, updated_at = CURRENT_TIMESTAMP
      WHERE book_id = $11 RETURNING *;
    `;
    const values = [
      title,
      author,
      category,
      isbn,
      publication,
      quantity,
      available,
      average_rating,
      description,
      bookImage,
      book_id,
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book updated successfully" });
  } catch {
    res.status(500).json({ message: "Error updating book: " });
  }
};

//Delete a Book
export const deleteBook = async (req, res) => {
  const { book_id } = req.body;

  if (!book_id) {
    return res.status(400).json({ message: "Book ID is required" });
  }

  try {
    const checkBookQuery = await pool.query(
      `SELECT * FROM books WHERE book_id = $1`,
      [book_id]
    );

    if (checkBookQuery.rowCount === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    const filename = checkBookQuery.rows[0].bookimage;
    if (filename) {
      const filepath = path.join(
        __dirname,
        "../../..",
        "public/image/book",
        filename
      );

      try {
        await fs.promises.unlink(filepath);
      } catch (err) {
        return res.status(404).json({ message: "File not found for deletion" });
      }
    }

    const result = await pool.query(`DELETE FROM books WHERE book_id = $1`, [
      book_id,
    ]);

    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
