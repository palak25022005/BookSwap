import pool from "../config/db.js";
import { fetchBookImage } from "../utils/fetchBookImage.js";

export const addWishlistBook = async (req, res) => {
    try {
        const {
            user_id,
            title,
            author,
            genre
        } = req.body;

        // Convert Firebase UID to PostgreSQL id
        const userResult = await pool.query(
            `SELECT id FROM users WHERE firebase_uid = $1`,
            [user_id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const dbUserId = userResult.rows[0].id;

        const image = await fetchBookImage(title);

        const result = await pool.query(
            `
            INSERT INTO wishlist
            (user_id,title,author,genre,image_url)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *;
            `,
            [dbUserId,title,author,genre,image]
        );

        res.status(201).json(result.rows[0]);

    } catch(err){
        console.error(err);
        res.status(500).json({message:"Server Error"});
    }
};

export const getWishlist = async (req,res)=>{
    try{

        const {user_id}=req.params;

        const userResult = await pool.query(
            `SELECT id FROM users WHERE firebase_uid=$1`,
            [user_id]
        );

        if(userResult.rows.length===0){
            return res.status(404).json({message:"User not found"});
        }

        const dbUserId=userResult.rows[0].id;

        const result=await pool.query(
            `
            SELECT *
            FROM wishlist
            WHERE user_id=$1
            ORDER BY created_at DESC
            `,
            [dbUserId]
        );

        res.json(result.rows);

    }catch(err){
        console.error(err);
        res.status(500).json({message:"Server Error"});
    }
};