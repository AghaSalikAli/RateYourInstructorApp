import pool from "../database.js";

//register a new user
export async function registerUser(Email, Password_hash, Verification_token, token_timestamp) {
    const [rows] = await pool.query(`
        CALL InsertUser(?, ?, ?, ?);
    `, [Email, Password_hash, Verification_token, token_timestamp]);

    return rows;
}

//login a user
export async function loginUser(Email) {
    const [rows] = await pool.query(`
        CALL GetUserByEmail(?);
    `, [Email]);

    return rows[0];
}

// Get user by verification token
export async function getUserByToken(token) {
    const [rows] = await pool.query(`
      CALL GetUserByToken(?);
    `, [token]);
    
    return rows[0];
  }

// Verify user account
export async function verifyUser(User_ID) {
    const [rows] = await pool.query(`
        CALL VerifyUserEmail(?);
    `, [User_ID]);

    return rows;
}