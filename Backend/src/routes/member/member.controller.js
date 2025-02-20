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

//get individual member details

export const getIndividualDetail = async (req, res) => {
  const { user_id } = req.params;

  if (user_id === null && user_id < 0) {
    return res.status.json({ message: "No User_id" });
  }
  try {
    const result = await pool.query(
      `SELECT loans.loan_id, loans.book_id, loans.loan_date, loans.return_date, loans.due_date, loans.returned, 
              books.title, books.author, books.category, books.isbn, books.bookimage,
              users.user_id, users.name, users.email, users.password, users.sex, users.age,
              users.studying, users.course, users.role, users.userimage, users.phone_number
       FROM loans
       JOIN books ON loans.book_id = books.book_id
       JOIN users ON loans.user_id = users.user_id
       WHERE loans.user_id = $1 AND loans.returned = false
       ORDER BY loans.loan_date DESC`,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No loans found for this user" });
    }

    const userData = {
      user_id: result.rows[0].user_id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      sex: result.rows[0].sex,
      age: result.rows[0].age,
      studying: result.rows[0].studying,
      course: result.rows[0].course,
      role: result.rows[0].role,
      userimage: result.rows[0].userimage,
      phone_number: result.rows[0].phone_number,
    };

    const loansData = result.rows.map((row) => ({
      loan_id:row.loan_id,
      book_id: row.book_id,
      loan_date: row.loan_date,
      return_date: row.return_date,
      due_date: row.due_date,
      returned: row.returned,
      title: row.title,
      author: row.author,
      category: row.category,
      isbn: row.isbn,
      bookimage: row.bookimage,
    }));

    res.status(200).json({ user: userData, loans: loansData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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
