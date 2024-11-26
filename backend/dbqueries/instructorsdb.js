import pool from "../database.js";


//get an instructor profile
export async function getInstructor(id) {
    const[rows] = await pool.query(`
        CALL GetInstructor(?);
    `, [id]);
        return rows[0];
}

//search for instructors
export async function searchInstructor(name) {
    const[rows] = await pool.query(`
        CALL SearchInstructor(?);
    `, [name]);
        return rows[0];
}