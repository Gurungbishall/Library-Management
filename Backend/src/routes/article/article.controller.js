import pool from "../../Database/db.js";

//loan a book
export const getArticleOnCategory = async (req, res) => {
  const { category } = req.params;

  try {
    let query =
      "SELECT article_id, title, author, articleimage, description, average_rating FROM articles";
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
