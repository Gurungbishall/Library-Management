import pool from "../../Database/db.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//get Members
export const getMembers = async (req, res) => {
  const { member_Name } = req.query;

  try {
    let query =
      "SELECT user_id, name, email, sex, age, studying, course, role, userimage, phone_number FROM users";
    let params = [];

    if (member_Name) {
      query += " WHERE name ILIKE $1 OR email ILIKE $1 OR course ILIKE $1";
      params = [`%${member_Name}%`];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: searchBook
          ? "No Member found matching the search criteria."
          : "No Members Available",
      });
    }

    return res.status(200).json({
      data: result.rows,
    });
  } catch {
    return res.status(500).json({ message: "Error searching for members." });
  }
};

//edit Member
export const editMember = async (req, res) => {
  const { user_id } = req.params;
  const { name, email, sex, age, course, role, phone_number } = req.body;

  if (!name || !email || !sex || !age || !course || !role || !phone_number) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const checkUserQuery = await pool.query(
      `SELECT * FROM users WHERE email = $1 AND user_id != $2`,
      [email, user_id]
    );

    if (checkUserQuery.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Error checking email availability",
      error: err.message,
    });
  }
  let userImage;

  if (req.file) {
    try {
      const result = await pool.query(
        "SELECT userimage FROM users WHERE user_id = $1",
        [user_id]
      );

      const user = result.rows[0];

      if (user && user.userimage) {
        const oldImagePath = path.join(
          __dirname,
          "../../..",
          "public/image/user",
          user.userimage
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      userImage = req.file.filename;
    } catch {
      return res.status(500).json({ message: "Error deleting old image" });
    }
  } else {
    try {
      const result = await pool.query(
        "SELECT userimage FROM users WHERE user_id = $1",
        [user_id]
      );

      const user = result.rows[0];
      if (user && user.userimage) {
        userImage = user.userimage;
      }
    } catch {
      return res
        .status(500)
        .json({ message: "Error retrieving current image" });
    }
  }

  try {
    const query = `
      UPDATE users
      SET
        name = $1,
        email = $2,
        sex = $3,
        age = $4,
        course = $5,
        role = $6,
        phone_number = $7,
        userimage = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $9
      RETURNING *;
    `;

    const values = [
      name,
      email,
      sex,
      age,
      course,
      role,
      phone_number,
      userImage,
      user_id,
    ];

    const updatedUser = await pool.query(query, values);

    if (updatedUser.rows.length > 0) {
      return res.status(200).json({ message: "Member updated successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch {
    return res.status(500).json({ message: "Error updating Member" });
  }
};

//delete member

export const deleteMember = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id)
    return res.status(500).json({ message: "No user Id is provided" });

  try {
    const checkUserQuery = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id]
    );

    if (checkUserQuery === 0)
      return res.status(500).json({ message: "User not Found" });

    const filename = checkUserQuery.rows[0].userimage;

    if (filename) {
      const filepath = path.join(
        __dirname,
        "../../..",
        "public/image/user",
        filename
      );

      try {
        await fs.promises.unlink(filepath);
      } catch {
        return res.status(404).json({ message: "File not found for deletion" });
      }
    }

    const result = await pool.query("DELETE FROM users WHERE user_id = $1", [
      user_id,
    ]);

    return res.status(200).json({ message: "Member deleted successfully" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// returnloanBook
export const returnedloanBook = async (req, res) => {
  const { loan_id } = req.body;
  if (!loan_id) {
    return res.status(400).json({ message: "Loan ID is required" });
  }
  try {
    const result = await pool.query(
      `UPDATE loans
        SET returned = TRUE,
            return_date = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE loan_id = $1`,
      [loan_id]
    );

    if (result.rowCount > 0) {
      res.json({ message: "Book returned" });
    } else {
      res.json({
        message: "Loan not found or already returned.",
      });
    }
  } catch (err) {
    res.status(500).json({ smessage: "Error returning book." });
  }
};

//Delete member return info
export const deleteReturnedBookInfo = async (req, res) => {
  const { loan_id } = req.body;

  if (!loan_id) {
    return res.status(400).json({ message: "Loan ID is required" });
  }

  try {
    const loanResult = await pool.query(
      `SELECT * FROM loans WHERE loan_id = $1 AND returned = true`,
      [loan_id]
    );

    if (loanResult.rowCount === 0) {
      return res.json({ message: "Loan not found or has not returned." });
    }

    const deleteResult = await pool.query(
      `DELETE FROM loans WHERE loan_id = $1 AND returned = true`,
      [loan_id]
    );

    if (deleteResult.rowCount > 0) {
      res.json({ message: "Returned Book deleted" });
    } else {
      res.json({ message: "Not Found" });
    }
  } catch {
    res.status(500).json({ message: "Error deleting " });
  }
};

//get member loan lists
export const getMemberLoanBooks = async (req, res) => {
  const { user_id } = req.params;
  const { search_Book } = req.query;

  if (user_id === null) {
    return res.status(500).json({ message: "Null user_id" });
  }
  try {
    let query = `SELECT loans.loan_id, loans.book_id, loans.loan_date, loans.return_date, loans.due_date, loans.returned, 
                        books.title, books.author, books.category, books.isbn, books.bookimage
                  FROM loans
                  JOIN books ON loans.book_id = books.book_id
                 WHERE loans.user_id = $1 AND loans.returned = false`;

    let params = [user_id];

    if (search_Book) {
      query += ` AND (books.title ILIKE $2 OR books.author ILIKE $2 OR books.category ILIKE $2)`;
      params.push(`%${search_Book}%`);
    }

    query += ` ORDER BY loans.loan_date DESC`;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No loans found matching the search criteria." });
    }

    return res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    console.error("Error searching user loans:", error);
    return res.status(500).json({ message: "Error searching for loans." });
  }
};

//get member returnList
export const getMemberReturnBooks = async (req, res) => {
  const { user_id } = req.params;
  const { search_Book } = req.query;

  if (user_id === null) {
    return res.status(500).json({ message: "Null user_id" });
  }
  try {
    let query = `SELECT loans.loan_id, loans.book_id, loans.loan_date, loans.return_date, loans.due_date, loans.returned, 
                        books.title, books.author, books.category, books.isbn, books.bookimage
                  FROM loans
                  JOIN books ON loans.book_id = books.book_id
                 WHERE loans.user_id = $1 AND loans.returned = true`;

    let params = [user_id];

    if (search_Book) {
      query += ` AND (books.title ILIKE $2 OR books.author ILIKE $2 OR books.category ILIKE $2)`;
      params.push(`%${search_Book}%`);
    }

    query += ` ORDER BY loans.loan_date DESC`;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No loans found matching the search criteria." });
    }

    return res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    console.error("Error searching user loans:", error);
    return res.status(500).json({ message: "Error searching for loans." });
  }
};
