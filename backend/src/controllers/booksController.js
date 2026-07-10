import pool from "../config/db.js";
import { fetchBookImage } from "../utils/fetchBookImage.js";

export const addBook = async (req, res) => {
  try {
    const {
      user_id, // Firebase UID
      title,
      author,
      genre,
      description,
    } = req.body;

    // Find PostgreSQL UUID using Firebase UID
    const userResult = await pool.query(
      `
      SELECT id
      FROM users
      WHERE firebase_uid = $1
      `,
      [user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const dbUserId = userResult.rows[0].id;

    const image = await fetchBookImage(title);

    const result = await pool.query(
      `
      INSERT INTO books_owned
      (user_id, title, author, genre, description, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `,
      [dbUserId, title, author, genre, description, image]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getBooks = async (req, res) => {
  try {

    const { user_id } = req.params; // Firebase UID

    const userResult = await pool.query(
      `
      SELECT id
      FROM users
      WHERE firebase_uid = $1
      `,
      [user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const dbUserId = userResult.rows[0].id;

    const result = await pool.query(
      `
      SELECT *
      FROM books_owned
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [dbUserId]
    );

    res.status(200).json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message,
    });

  }
};