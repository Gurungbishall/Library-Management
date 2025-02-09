import bcrypt from "bcrypt";
import pool from "../../Database/db.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../model/user.model.js";

// user signup
const userSignUp = async (req, res) => {
  const {
    name,
    email,
    password,
    phone_number,
    sex,
    age,
    studying,
    course,
    role,
    image_url,
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !phone_number ||
    !sex ||
    !age ||
    !studying ||
    !course ||
    !role
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
      `INSERT INTO users (email, password, name, sex, age, studying, course, role, image_url, phone_number) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING user_id, email, name, sex, age, studying, course, role, image_url, phone_number`,
      [
        email,
        hashedPassword,
        name,
        sex,
        age,
        studying,
        course,
        role,
        image_url,
        phone_number,
      ]
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
      "SELECT user_id, name, password, role, image_url FROM users WHERE email = $1";
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

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
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
  res.status(200).json({ message: "Logout successful" });
};

// profile
const getProfile = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const result = await pool.query(
      "SELECT name, email, sex, age, studying, course, role, image_url FROM users WHERE user_id = $1",
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
        image_url: result.rows[0].image_url,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// edit profile
const editProfile = async (req, res) => {
  const { name, email, sex, age, studying, course, role, image_url, user_id } =
    req.body;

  if (
    !name ||
    !email ||
    !sex ||
    !age ||
    !studying ||
    !course ||
    !role ||
    !user_id
  ) {
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

    const result = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2, sex = $3, age = $4, studying = $5, course = $6, role = $7, image_url = $8 
       WHERE user_id = $9
       RETURNING user_id, name, email, sex, age, studying, course, role, image_url`,
      [name, email, sex, age, studying, course, role, image_url, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User profile updated successfully",
    });
  } catch (error) {
    console.error("Error editing profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { userLogin, userSignOut, userSignUp, getProfile, editProfile };
