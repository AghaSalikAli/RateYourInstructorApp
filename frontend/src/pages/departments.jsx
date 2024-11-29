import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/departments.css';

axios.defaults.withCredentials = true;

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        // Fetch departments from the backend
        const fetchDepartments = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/departments");
                setDepartments(response.data); // Response.data contains an array of departments
            } catch (err) {
                setError("Error fetching departments. Please try again later.");
                console.error(err);
            }
        };

        fetchDepartments();
    }, []);

    return (
        <div className="departments-list">
            <h1>All Departments</h1>
            {error && <p className="error-message">{error}</p>}
            <ul className="department-cards">
                {departments.map((department) => (
                    <li key={department.Department_ID} className="department-card">
                        <a href={`/department/${department.Department_ID}`}>
                            {department.Department_Name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Departments;