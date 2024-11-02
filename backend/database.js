import mysql from 'mysql2';

import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

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

//get an instructor profile
export async function getInstructor(id) {
    const[rows] = await pool.query(`
        SELECT *
        FROM Instructors
        WHERE
        Instructor_ID = ?`, [id]);
        return rows;
}