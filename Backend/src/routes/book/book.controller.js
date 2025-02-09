import pool from "../../Database/db.js";

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
    image_url,
  } = req.body;

  if (
    !title ||
    !author ||
    !category ||
    !isbn ||
    !publication ||
    !quantity ||
    !available ||
    !image_url
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const query = `
        INSERT INTO books (title, author, category, isbn, publication_year, quantity, available, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING book_id, title, author, category, isbn, publication_year, quantity, available, image_url;
      `;
    const values = [
      title,
      author,
      category,
      isbn,
      publication,
      quantity,
      available,
      image_url,
    ];

    const result = await pool.query(query, values);

    return res.status(201).json({ message: "Book added successfully" });
  } catch (error) {
    console.error(error);
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
        SELECT book_id, title, author, category, isbn, publication_year, quantity, available, average_rating, image_url
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
      "SELECT book_id, title, author, category, isbn, publication_year, quantity, available, average_rating, image_url FROM books";
    let params = [];

    if (category) {
      query += " WHERE category = $1";
      params = [category];
    }

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
