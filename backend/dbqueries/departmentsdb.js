import pool from "../database.js";

//get all departments
export async function getDepartments() { 
    const [rows] = await pool.query(`
        SELECT *
        FROM Departments`);
    return rows;
}

//get instructors for a department
export async function getDepartment(id) {
    const [rows] = await pool.query(`
        SELECT 
            d.Department_Name,
            i.Instructor_Name,
            i.Faculty_Type
        FROM 
            Departments d
        JOIN 
            Instructors i
        ON 
            d.Department_ID = i.Department_ID
        WHERE 
            d.Department_ID = ?
        ORDER BY i.Instructor_Name`, [id]);
    return rows;
}