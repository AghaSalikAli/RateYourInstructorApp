import pool from "../database.js";

//get all departments
export async function getDepartments() { 
    const [rows] = await pool.query(`CALL GetAllDepartments()`);
    return rows[0];
}

//get instructors for a department
export async function getDepartment(id) {
    const [rows] = await pool.query(
        `CALL GetDepartmentInstructors(?)`, [id]);
    return rows[0];
}