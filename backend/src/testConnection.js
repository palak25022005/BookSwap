import pool from "./config/db.js";



async function connectDB() {
    try {

        const res = await pool.query("SELECT NOW()");

        console.log("Connected Successfully");

        console.log(res.rows);

    }
    catch(err){

        console.log(err);

    }

    process.exit();
}

connectDB();