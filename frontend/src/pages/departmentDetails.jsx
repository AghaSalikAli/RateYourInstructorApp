import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import '../styles/departmentDetails.css';

axios.defaults.withCredentials = true;

const DepartmentDetails = () => {
    const { id } = useParams(); 
    const [departmentName, setDepartmentName] = useState(""); 
    const [instructors, setInstructors] = useState([]); 
    const [error, setError] = useState(""); 
    const [departmentNotFound, setDepartmentNotFound] = useState(false); 

    useEffect(() => {
        const fetchDepartmentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/departments/${id}`);
                
                // Check if data exists and set the state
                if (response.data.length > 0) {
                    setDepartmentName(response.data[0].Department_Name); // Set department name
                    setInstructors(response.data.map((instructor) => ({
                        Instructor_ID: instructor.Instructor_ID, 
                        Instructor_Name: instructor.Instructor_Name,
                        Faculty_Type: instructor.Faculty_Type,
                    }))); // Map and set instructor details
                    setDepartmentNotFound(false); // Department found, reset flag
                } else {
                    setDepartmentNotFound(true); // No department found, set flag
                    setError("No instructors found for this department.");
                }
            } catch (err) {
                setDepartmentNotFound(true); 
                setError("The department you are looking for does not exist.");
                console.error(err);
            }
        };

        fetchDepartmentDetails();
    }, [id]); 

    return (
        <div className="department-details">
            {departmentNotFound ? (
                <h1>No Such Department</h1> 
            ) : (
                <h1>{departmentName ? `Department of ${departmentName}` : "Loading..."}</h1>
            )}
            {error && <p className="error-message">{error}</p>}
            <ul className="instructors-list">
                {instructors.length > 0 ? (
                    instructors.map((instructor) => (
                        <li key={instructor.Instructor_ID} className="instructor-card">
                            <Link to={`/instructor/${instructor.Instructor_ID}`}>
                                <h2>{instructor.Instructor_Name}</h2>
                                <p>{instructor.Faculty_Type}</p>
                            </Link>
                        </li>
                    ))
                ) : (
                    !departmentNotFound && <p>Loading instructors...</p> 
                )}
            </ul>
        </div>
    );
};

export default DepartmentDetails;