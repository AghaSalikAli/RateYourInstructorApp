import pool from "../database.js";


//get an instructor profile
export async function getInstructor(id) {
    const[rows] = await pool.query(`
        SELECT *
        FROM Instructors
        WHERE
        Instructor_ID = ?`, [id]);
        return rows;
}