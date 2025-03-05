import bcrypt from "bcrypt";
import pool from "../../Database/db.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../model/user.model.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userSignUp = async (req, res) => {
  const { name, email, password, phone_number, age, sex, course } = req.body;
  const userimage = req.file ? req.file.filename : null;

  if (
    !name ||
    !email ||
    !password ||
    !phone_number ||
    !sex ||
    !age ||
    !course
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const checkUserQuery = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    if (checkUserQuery.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password, name, sex, age, course, userimage, phone_number) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING user_id, email, name, sex, age, course, userimage, phone_number`,
      [email, hashedPassword, name, sex, age, course, userimage, phone_number]
    );

    return res.status(201).json({
      message: "User signed up successfully",
    });
  } catch (error) {
    console.error("Error signing up user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// user login
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const query =
      "SELECT user_id, name, password, role, userimage FROM users WHERE email = $1";
    const { rows } = await pool.query(query, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      partitioned: true, 
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      partitioned: true,
    });

    res.status(200).json({
      message: "Login successful",
      user_id: user.user_id,
      role: user.role,
      accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// signout
const userSignOut = (req, res) => {
  res.cookie("refresh_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie("access_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logout successful" });
};

// profile
const getProfile = async (req, res) => {
  const { userId } = req.params;

  if (!userId || userId === null) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const result = await pool.query(
      "SELECT name, email, sex, age, studying, course, role, userimage, phone_number FROM users WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        user_id: result.rows[0].user_id,
        email: result.rows[0].email,
        name: result.rows[0].name,
        sex: result.rows[0].sex,
        age: result.rows[0].age,
        studying: result.rows[0].studying,
        course: result.rows[0].course,
        role: result.rows[0].role,
        userimage: result.rows[0].userimage,
        phone_number: result.rows[0].phone_number,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// edit profile
const editProfile = async (req, res) => {
  const { user_id } = req.params;
  const { name, email, sex, age, course, phone_number } = req.body;

  if (!name || !email || !sex || !age || !course || !phone_number) {
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
        phone_number = $6,
        userimage = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $8
      RETURNING *;
    `;

    const values = [
      name,
      email,
      sex,
      age,
      course,
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

export { userLogin, userSignOut, userSignUp, getProfile, editProfile };
