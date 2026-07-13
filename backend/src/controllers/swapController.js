import pool from "../config/db.js";

export const getMatches = async (req, res) => {
  try {
    const { firebase_uid } = req.params;

    // Find logged-in user's PostgreSQL ID
    const userResult = await pool.query(
      `
      SELECT id
      FROM users
      WHERE firebase_uid = $1
      `,
      [firebase_uid]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userId = userResult.rows[0].id;

    // Find matching users from the same groups
    const matches = await pool.query(
      `
SELECT DISTINCT

u.id AS receiver_id,
u.name,

owned.id AS receiver_book_id,
owned.title AS receiver_book_title,
owned.author AS receiver_book_author,
owned.image_url AS receiver_book_image,

mine.id AS sender_book_id,
mine.title AS sender_book_title,
mine.author AS sender_book_author,
mine.image_url AS sender_book_image

FROM group_members gm

JOIN group_members gm2
ON gm.group_id = gm2.group_id

JOIN users u
ON u.id = gm2.user_id

JOIN books_owned owned
ON owned.user_id = u.id

JOIN wishlist otherWish
ON otherWish.user_id = u.id

JOIN books_owned mine
ON mine.user_id = gm.user_id

JOIN wishlist myWish
ON myWish.user_id = gm.user_id

WHERE gm.user_id = $1

AND gm2.user_id <> $1

AND owned.title = myWish.title

AND otherWish.title = mine.title
`,
      [userId]
    );

    res.json(matches.rows);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


export const sendRequest = async (req, res) => {
  try {
    const {
      firebase_uid,
      receiver_id,
      sender_book_id,
      receiver_book_id,
    } = req.body;

    const sender = await pool.query(
      `
      SELECT id
      FROM users
      WHERE firebase_uid=$1
      `,
      [firebase_uid]
    );

    if (sender.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const senderId = sender.rows[0].id;

    await pool.query(
      `
      INSERT INTO swap_requests
      (
      sender_id,
      receiver_id,
      sender_book_id,
      receiver_book_id,
      status
      )

      VALUES($1,$2,$3,$4,'PENDING')
      `,
      [
        senderId,
        receiver_id,
        sender_book_id,
        receiver_book_id,
      ]
    );

    res.json({
      message: "Swap request sent",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};