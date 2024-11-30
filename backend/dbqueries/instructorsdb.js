import pool from "../database.js";


//get an instructor profile
export async function getInstructor(id) {
    const[rows] = await pool.query(`
        CALL GetInstructor(?);
    `, [id]);
        return rows[0];
}

//get all courses
export async function getAllCourses() {
    const[rows] = await pool.query(`
        CALL GetAllCourses();
    `);
        return rows[0];
}

//search for instructors
export async function searchInstructor(name) {
    const[rows] = await pool.query(`
        CALL SearchInstructor(?);
    `, [name]);
        return rows[0];
}

//add a rating for an instructor
export async function addRating(user_id, instructor_id, course_code, grade, rating, difficulty_level, take_again, mandatory_attendance, review_text) {
    const[rows] = await pool.query(`
        CALL AddReview(?,?,?,?,?,?,?,?,?);
    `, [user_id, instructor_id, course_code, grade, rating, difficulty_level, take_again, mandatory_attendance, review_text]);
        return rows[0];
}

//check for duplicate review
export async function checkDuplicate(user_id, instructor_id, course_code) {
    const[rows] = await pool.query(`
        CALL DuplicateReviewCheck(?,?,?);
    `, [user_id, instructor_id, course_code]);
        return rows[0];
}