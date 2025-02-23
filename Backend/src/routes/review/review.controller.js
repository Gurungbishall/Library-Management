import pool from "../../Database/db.js";

const validContentTypes = ["book", "article", "music"];

export const review = async (req, res) => {
  const { user_id, content_type, content_id, rating, review_text } = req.body;

  if (!user_id || !content_type || !content_id || !rating) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (![1, 2, 3, 4, 5].includes(rating)) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  if (!validContentTypes.includes(content_type)) {
    return res.status(400).json({ error: "Invalid content type" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO reviews (user_id, content_type, content_id, rating, review_text)
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
      [user_id, content_type, content_id, rating, review_text]
    );

    res.status(201).json({
      message: "Review added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const accessReviews = async (req, res) => {
  const { content_type, content_id } = req.query;

  if (!content_type || !content_id) {
    return res.status(400).json({
      error: "Missing required parameters: content_type and content_id",
    });
  }

  if (!validContentTypes.includes(content_type)) {
    return res.status(400).json({ error: "Invalid content type" });
  }

  try {
    const result = await pool.query(
      `SELECT r.review_id, r.user_id, u.name AS user_name, r.rating, r.review_text, r.created_at
       FROM reviews r
       JOIN users u ON r.user_id = u.user_id
       WHERE r.content_type = $1 AND r.content_id = $2
       ORDER BY r.created_at DESC`,
      [content_type, content_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this content." });
    }

    res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteReview = async (req, res) => {
  const { review_id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM reviews WHERE review_id = $1 RETURNING *",
      [review_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
