import pool from "../database.js";

//get a particular review
export async function getReviewDetails(review_id) {
    const[rows] = await pool.query(`
        CALL GetReviewById(?);
    `, [review_id]);
        return rows[0];
}

//flag a review
export async function flagReview(user_id, review_id, reason) {
    const[rows] = await pool.query(`
        CALL AddFlaggedReview(?,?,?);
    `, [user_id, review_id, reason]);
    return rows[0];
}