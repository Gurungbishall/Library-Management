import pool from "../../Database/db.js";

// Search a book by title, author, or category
export const searchBook = async (req, res) => {
  const { search_Book } = req.query;
  if (!search_Book) {
    return res
      .status(500)
      .json({ message: "Enter book title, author, or category to search" });
  }

  try {
    const result = await pool.query(
      `SELECT book_id, title, author, average_rating, bookimage FROM books 
       WHERE title ILIKE $1 OR author ILIKE $1 OR category ILIKE $1`,
      [`%${search_Book}%`]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found matching the search criteria." });
    }

    return res.status(200).json({
      data: result.rows,
    });
  } catch {
    return res.status(500).json({ message: "Error searching for books." });
  }
};

export const adminSearch = async (req, res) => {
  const { search_Book } = req.query;

  try {
    let query =
      "SELECT book_id, title, author, category, isbn, publication_year, quantity, available, average_rating, bookimage, description FROM books";
    let params = [];

    if (search_Book) {
      query += " WHERE title ILIKE $1 OR author ILIKE $1 OR category ILIKE $1";
      params = [`%${search_Book}%`];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: searchBook
          ? "No books found matching the search criteria."
          : "No Books Available",
      });
    }

    return res.status(200).json({
      data: result.rows,
    });
  } catch {
    return res.status(500).json({ message: "Error searching for books." });
  }
};
