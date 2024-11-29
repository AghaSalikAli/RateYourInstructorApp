import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../styles/instructorRating.css';

axios.defaults.withCredentials = true;

const InstructorRating = () => {
    const { id } = useParams(); // Get instructor ID from URL params
    const [instructorDetails, setInstructorDetails] = useState(null); // Store instructor details
    const [error, setError] = useState(false); // Store error state for invalid instructor
    const [courseId, setCourseId] = useState("");
    const [courses, setCourses] = useState([]); // Store courses from backend
    const [rating, setRating] = useState(1);
    const [difficulty, setDifficulty] = useState(1);
    const [takeAgain, setTakeAgain] = useState(null); // Mandatory, starts as null
    const [mandatoryAttendance, setMandatoryAttendance] = useState(null); // Mandatory, starts as null
    const [grade, setGrade] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const grades = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "F"]; // Grade options

    // Fetch instructor details from backend
    useEffect(() => {
        const fetchInstructorDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/instructor/${id}`);
                if (response.data.length === 0) {
                    setError(true); // Set error if no instructor found
                } else {
                    setInstructorDetails(response.data[0]); // Store the first result
                }
            } catch (error) {
                console.error("Error fetching instructor details:", error);
                setError(true); // Set error on API failure
            }
        };
        fetchInstructorDetails();
    }, [id]);

    // Fetch courses from backend
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/instructor/courses");
                setCourses(response.data); // Store courses in state
            } catch (error) {
                console.error("Error fetching courses:", error);
                setErrorMessage("Failed to load courses. Please try again.");
            }
        };
        fetchCourses();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Clear error and success messages
        setErrorMessage("");
        setSuccessMessage("");

        // Validation for all required fields
        if (
            !courseId ||
            !rating ||
            !difficulty ||
            takeAgain === null || // Ensure "Take Again" is selected
            mandatoryAttendance === null || // Ensure "Mandatory Attendance" is selected
            !reviewText
        ) {
            setErrorMessage("Please fill out all required fields.");
            return;
        }

        // Show success for now (backend integration later)
        setSuccessMessage("Review submitted successfully!");
    };

    if (error) {
        // Display error message if the instructor is invalid or details couldn't be fetched
        return (
            <div className="InstructorRatingError">
                <h1>Error</h1>
                <p>The instructor you want to review does not exist.</p>
            </div>
        );
    }

    return (
        <div className="InstructorRating">
            {/* Instructor Header */}
            {instructorDetails ? (
                <div className="instructor-header">
                    <div className="instructor-details">
                        <p className="instructor-name">Rating: <b>{instructorDetails.Instructor_Name}</b></p>
                        <p className="faculty-type">{instructorDetails.Faculty_Type} Faculty</p>
                        <p className="department-name">Department of {instructorDetails.Department_Name}</p>
                    </div>
                </div>
            ) : (
                <p>Loading instructor details...</p>
            )}

            <Form onSubmit={handleSubmit} noValidate>
                {/* Course Dropdown */}
                <Form.Group className="mb-3" controlId="formCourse">
                    <Form.Label>
                        Course <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                        as="select"
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        style={{ maxHeight: "150px", overflowY: "scroll" }} // Limit dropdown height
                    >
                        <option value="">Select a course</option>
                        {courses.map((course, index) => (
                            <option key={index} value={course.course_code}>
                                ({course.course_code}) {course.course_name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                {/* Rating (1-5) */}
                <Form.Group className="mb-3" controlId="formRating">
                    <Form.Label>
                        Rating (1-5) <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                    />
                </Form.Group>

                {/* Difficulty Level (1-5) */}
                <Form.Group className="mb-3" controlId="formDifficulty">
                    <Form.Label>
                        Difficulty Level (1-5) <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                        type="number"
                        min="1"
                        max="5"
                        value={difficulty}
                        onChange={(e) => setDifficulty(parseInt(e.target.value))}
                    />
                </Form.Group>

                {/* Take Again (Yes/No) */}
                <Form.Group className="mb-3" controlId="formTakeAgain">
                    <Form.Label>
                        Would you take this instructor again? <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <div>
                        <Form.Check
                            inline
                            type="radio"
                            label="Yes"
                            name="takeAgain"
                            checked={takeAgain === true}
                            onChange={() => setTakeAgain(true)}
                        />
                        <Form.Check
                            inline
                            type="radio"
                            label="No"
                            name="takeAgain"
                            checked={takeAgain === false}
                            onChange={() => setTakeAgain(false)}
                        />
                    </div>
                </Form.Group>

                {/* Mandatory Attendance (Yes/No) */}
                <Form.Group className="mb-3" controlId="formMandatoryAttendance">
                    <Form.Label>
                        Was attendance mandatory? <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <div>
                        <Form.Check
                            inline
                            type="radio"
                            label="Yes"
                            name="mandatoryAttendance"
                            checked={mandatoryAttendance === true}
                            onChange={() => setMandatoryAttendance(true)}
                        />
                        <Form.Check
                            inline
                            type="radio"
                            label="No"
                            name="mandatoryAttendance"
                            checked={mandatoryAttendance === false}
                            onChange={() => setMandatoryAttendance(false)}
                        />
                    </div>
                </Form.Group>

                {/* Grade Dropdown */}
                <Form.Group className="mb-3" controlId="formGrade">
                    <Form.Label>
                        Grade <span style={{ color: "gray" }}>(optional)</span>
                    </Form.Label>
                    <Form.Control
                        as="select"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                    >
                        <option value="">Select a grade</option>
                        {grades.map((g, index) => (
                            <option key={index} value={g}>
                                {g}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                {/* Review Text */}
                <Form.Group className="mb-3" controlId="formReviewText">
                    <Form.Label>
                        Review (max 350 characters) <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        maxLength={350}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    />
                </Form.Group>

                {/* Error and Success Messages */}
                {errorMessage && <div className="error-message" style={{ color: "red" }}>{errorMessage}</div>}
                {successMessage && <div className="success-message" style={{ color: "green" }}>{successMessage}</div>}

                {/* Submit Button */}
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default InstructorRating;
