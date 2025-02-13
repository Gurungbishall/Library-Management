import pool from "../../Database/db.js";

//loan a book
export const loanBook = async (req, res) => {
  const { user_id, book_id, due_date } = req.body;

  if (!user_id || !book_id || !due_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const checkUserQuery = await pool.query(
      `SELECT * FROM users WHERE user_id = $1`,
      [user_id]
    );

    if (checkUserQuery.rows.length === 0) {
      return res.status(400).json({ message: "No User found with that ID" });
    }

    const checkBookQuery = await pool.query(
      `SELECT * FROM books WHERE book_id = $1`,
      [book_id]
    );

    if (checkBookQuery.rows.length === 0) {
      return res.status(400).json({ message: "No Book found with that ID" });
    }

    const checkBookLoanQuery = await pool.query(
      `SELECT * FROM loans WHERE user_id = $1 AND book_id = $2 AND returned = false`,
      [user_id, book_id]
    );

    if (checkBookLoanQuery.rows.length > 0) {
      return res.status(400).json({
        message:
          "You have already borrowed this book and have not returned it yet.",
      });
    }

    const checkBookAvailabilityQuery = await pool.query(
      `SELECT available FROM books WHERE book_id = $1`,
      [book_id]
    );

    if (
      checkBookAvailabilityQuery.rows.length === 0 ||
      checkBookAvailabilityQuery.rows[0].available <= 0
    ) {
      return res
        .status(400)
        .json({ message: "This book is not available for borrowing." });
    }

    await pool.query(
      `UPDATE books SET available = available - 1 WHERE book_id = $1`,
      [book_id]
    );

    const result = await pool.query(
      `INSERT INTO loans (user_id, book_id, loan_date, due_date, returned, created_at, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP, $3, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [user_id, book_id, due_date]
    );

    res.status(201).json({
      message: "You have successfully borrowed the book.",
    });
  } catch (error) {
    console.error("Error creating loan:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//get user loans book
export const getUserLoans = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT loans.book_id, loans.loan_date, loans.return_date, loans.due_date, loans.returned, books.title, books.author, books.category, books.isbn, books.bookimage
         FROM loans
         JOIN books ON loans.book_id = books.book_id
         WHERE loans.user_id = $1
         ORDER BY loans.loan_date DESC`,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No loans found for this user" });
    }

    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error fetching user loans:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
