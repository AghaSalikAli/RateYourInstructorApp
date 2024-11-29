import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/instructorProfile.css";

axios.defaults.withCredentials = true;

const InstructorProfile = () => {
    const { id } = useParams(); // Get the instructor ID from the URL
    const [instructor, setInstructor] = useState(null); // State for instructor details
    const [error, setError] = useState(""); // State for error handling

    useEffect(() => {
        const fetchInstructor = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/instructor/${id}`);
                setInstructor(response.data[0]);
            } catch (err) {
                setError(err.response?.data?.message || "The Instructor you are looking for does not exist.");
            }
        };

        fetchInstructor();
    }, [id]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!instructor) {
        return <div>Loading...</div>;
    }

    return (
        <div className="instructor-profile">
            <h1>{instructor.Instructor_Name}</h1>
            <p><strong>Faculty Type:</strong> {instructor.Faculty_Type}</p>
            <p><strong>Department Name:</strong> {instructor.Department_Name}</p>
        </div>
    );
};

export default InstructorProfile;
