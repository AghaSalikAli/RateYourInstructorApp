import pool from "../database.js";

//register a new user
export async function registerUser(Email, Password_hash) {
    const [rows] = await pool.query(`
        INSERT INTO Users (Email, Password_Hash)
        VALUES (?, ?)`, [Email, Password_hash]);
    return rows;
}

//login a user
export async function loginUser(Email) {
    const [rows] = await pool.query(`
        SELECT *
        FROM Users
        WHERE
        Email = ?`, [Email]);
    return rows;
}