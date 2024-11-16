import pool from "../database.js";

//get all departments
export async function getDepartments() { 
    const [rows] = await pool.query(`
        SELECT *
        FROM Departments`);
    return rows;
}

//get instructors of particular department
export async function getDepartment(id) {
    const[rows] = await pool.query(`
        SELECT *
        FROM Instructors
        WHERE
        department_ID = ?`,[id]);
        return rows;
}