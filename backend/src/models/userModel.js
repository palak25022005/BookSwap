import pool from "../config/db.js";

export async function findUserByFirebaseUID(uid) {
  const result = await pool.query(
    "SELECT * FROM users WHERE firebase_uid=$1",
    [uid]
  );

  return result.rows[0];
}

export async function createUser(user) {
  const result = await pool.query(
    `INSERT INTO users
    (firebase_uid,name,email)
    VALUES($1,$2,$3)
    RETURNING *`,
    [
      user.uid,
      user.name,
      user.email
    ]
  );

  return result.rows[0];
}