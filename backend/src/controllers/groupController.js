import pool from "../config/db.js";
import { generateInviteCode } from "../utils/generateInviteCode.js";

export const createGroup = async (req,res)=>{

    try{

        const {firebase_uid,name}=req.body;

        const user=await pool.query(
            `
            SELECT id
            FROM users
            WHERE firebase_uid=$1
            `,
            [firebase_uid]
        );

        if(user.rows.length===0){
            return res.status(404).json({
                message:"User not found"
            });
        }

        const userId=user.rows[0].id;

        let inviteCode;

        while(true){

            inviteCode=generateInviteCode();

            const exists=await pool.query(
                `
                SELECT *
                FROM groups
                WHERE invite_code=$1
                `,
                [inviteCode]
            );

            if(exists.rows.length===0)
                break;
        }

        const group=await pool.query(
            `
            INSERT INTO groups
            (name,invite_code,created_by)

            VALUES($1,$2,$3)

            RETURNING *
            `,
            [name,inviteCode,userId]
        );

        await pool.query(
            `
            INSERT INTO group_members
            (group_id,user_id)

            VALUES($1,$2)
            `,
            [group.rows[0].id,userId]
        );

        res.json(group.rows[0]);

    }

    catch(err){
        console.log(err);
        res.status(500).json({
            message:"Server Error"
        });
    }

}

export const joinGroup=async(req,res)=>{

    try{

        const {firebase_uid,invite_code}=req.body;

        const user=await pool.query(
            `
            SELECT id
            FROM users
            WHERE firebase_uid=$1
            `,
            [firebase_uid]
        );

        if(user.rows.length===0)
            return res.status(404).json({
                message:"User not found"
            });

        const userId=user.rows[0].id;

        const group=await pool.query(
            `
            SELECT *
            FROM groups
            WHERE invite_code=$1
            `,
            [invite_code]
        );

        if(group.rows.length===0){

            return res.status(404).json({
                message:"Invalid invite code"
            });

        }

        await pool.query(
            `
            INSERT INTO group_members(group_id,user_id)

            VALUES($1,$2)

            ON CONFLICT(group_id,user_id)

            DO NOTHING
            `,
            [group.rows[0].id,userId]
        );

        res.json({
            message:"Joined Successfully"
        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({
            message:"Server Error"
        });

    }

}

export const getUserGroups = async (req, res) => {
  try {
    const { firebase_uid } = req.params;

    const result = await pool.query(
      `
      SELECT
      groups.id,
      groups.name,
      groups.invite_code,
      COUNT(group_members.user_id) AS members

      FROM groups

      JOIN group_members
      ON groups.id = group_members.group_id

      WHERE groups.id IN (

        SELECT group_id
        FROM group_members
        WHERE user_id = (
          SELECT id
          FROM users
          WHERE firebase_uid = $1
        )

      )

      GROUP BY groups.id

      ORDER BY groups.name;
      `,
      [firebase_uid]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getGroupDetails = async (req, res) => {

    try {

        const { id } = req.params;

        const group = await pool.query(
            `
            SELECT *
            FROM groups
            WHERE id=$1
            `,
            [id]
        );

        const members = await pool.query(
            `
            SELECT
            users.id,
            users.name,
            users.email

            FROM group_members

            JOIN users
            ON users.id=group_members.user_id

            WHERE group_members.group_id=$1
            `,
            [id]
        );

        res.json({
            ...group.rows[0],
            members: members.rows
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};