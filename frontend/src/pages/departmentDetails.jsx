import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../styles/departmentDetails.css';

const DepartmentDetails = () => {
    const { id } = useParams(); // Get department ID from the URL
    const [departmentName, setDepartmentName] = useState(""); // State for department name
    const [instructors, setInstructors] = useState([]); // State for instructors list
    const [error, setError] = useState(""); // State for error handling
    const [departmentNotFound, setDepartmentNotFound] = useState(false); // State to track if department is found

    useEffect(() => {
        const fetchDepartmentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/departments/${id}`);
                
                // Check if data exists and set the state
                if (response.data.length > 0) {
                    setDepartmentName(response.data[0].Department_Name); // Set department name
                    setInstructors(response.data.map((instructor) => ({
                        Instructor_Name: instructor.Instructor_Name,
                        Faculty_Type: instructor.Faculty_Type,
                    }))); // Map and set instructor details
                    setDepartmentNotFound(false); // Department found, reset flag
                } else {
                    setDepartmentNotFound(true); // No department found, set flag
                    setError("No instructors found for this department.");
                }
            } catch (err) {
                setDepartmentNotFound(true); // Error occurs, set flag for department not found
                setError("The department you are looking for does not exist.");
                console.error(err);
            }
        };

        fetchDepartmentDetails();
    }, [id]); // Dependency array ensures the call is made whenever `id` changes

    return (
        <div className="department-details">
            {departmentNotFound ? (
                <h1>No Such Department</h1> // Display "No Such Department" message
            ) : (
                <h1>{departmentName ? `Department of ${departmentName}` : "Loading..."}</h1>
            )}
            {error && <p className="error-message">{error}</p>}
            <ul className="instructors-list">
                {instructors.length > 0 ? (
                    instructors.map((instructor, index) => (
                        <li key={index} className="instructor-card">
                            <h2>{instructor.Instructor_Name}</h2>
                            <p>{instructor.Faculty_Type}</p>
                        </li>
                    ))
                ) : (
                    !departmentNotFound && <p>Loading instructors...</p> // Only show "Loading instructors..." when department exists
                )}
            </ul>
        </div>
    );
};

export default DepartmentDetails;
