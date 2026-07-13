import pool from "../config/db.js";
import { getIO,getOnlineUsers } from "../socket.js";

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
      WHERE firebase_uid = $1
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
      VALUES ($1, $2, $3, $4, 'PENDING')
      `,
      [
        senderId,
        receiver_id,
        sender_book_id,
        receiver_book_id,
      ]
    );

    // Get receiver's Firebase UID
    const receiver = await pool.query(
      `
      SELECT firebase_uid
      FROM users
      WHERE id = $1
      `,
      [receiver_id]
    );

    // Get sender's name
    const senderInfo = await pool.query(
      `
      SELECT name
      FROM users
      WHERE id = $1
      `,
      [senderId]
    );

    const receiverFirebaseUid = receiver.rows[0].firebase_uid;

    const io = getIO();
    const onlineUsers = getOnlineUsers();

    const receiverSocketId = onlineUsers.get(receiverFirebaseUid);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new_swap_request", {
        sender: senderInfo.rows[0].name,
        message: "You received a new swap request!",
      });
    }

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

export const getRequests = async (req, res) => {
  try {
    const { firebase_uid } = req.params;

    const user = await pool.query(
      `
      SELECT id
      FROM users
      WHERE firebase_uid=$1
      `,
      [firebase_uid]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const receiverId = user.rows[0].id;

    const requests = await pool.query(
      `
      SELECT

      sr.id,
      sr.status,
      sr.created_at,

      u.name AS sender_name,

      b1.title AS sender_book_title,
      b1.author AS sender_book_author,
      b1.image_url AS sender_book_image,

      b2.title AS receiver_book_title,
      b2.author AS receiver_book_author,
      b2.image_url AS receiver_book_image

      FROM swap_requests sr

      JOIN users u
      ON sr.sender_id=u.id

      JOIN books_owned b1
      ON sr.sender_book_id=b1.id

      JOIN books_owned b2
      ON sr.receiver_book_id=b2.id

      WHERE sr.receiver_id=$1

      ORDER BY sr.created_at DESC
      `,
      [receiverId]
    );

    res.json(requests.rows);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const acceptRequest = async (req, res) => {

    const { id } = req.params;

    await pool.query(
        `
        UPDATE swap_requests
        SET status='ACCEPTED'
        WHERE id=$1
        `,
        [id]
    );

    res.json({
        message:"Request accepted"
    });

};

export const rejectRequest = async (req,res)=>{

    const {id}=req.params;

    await pool.query(
        `
        UPDATE swap_requests
        SET status='REJECTED'
        WHERE id=$1
        `,
        [id]
    );

    res.json({
        message:"Request rejected"
    });

};