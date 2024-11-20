import pool from "../database.js";

//register a new user
export async function registerUser(Email, Password_hash) {
    const [rows] = await pool.query(`
        CALL InsertUser(?, ?);
    `, [Email, Password_hash]);

    return rows;
}

//login a user
export async function loginUser(Email) {
    const [rows] = await pool.query(`
        CALL GetUserByEmail(?);
    `, [Email]);

    return rows[0];
}