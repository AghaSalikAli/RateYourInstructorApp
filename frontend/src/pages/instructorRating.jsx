import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "../styles/instructorRating.css";

axios.defaults.withCredentials = true;

const InstructorRating = () => {
    const { id } = useParams(); // Get instructor ID from URL params
    const navigate = useNavigate(); // Hook to navigate to instructor profile after success
    const [instructorDetails, setInstructorDetails] = useState(null); // Store instructor details
    const [error, setError] = useState(false); // Store error state for invalid instructor
    const [courseCode, setCourseCode] = useState("");
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
            !courseCode ||
            !rating ||
            !difficulty ||
            takeAgain === null || // Ensure "Take Again" is selected
            mandatoryAttendance === null || // Ensure "Mandatory Attendance" is selected
            !reviewText
        ) {
            setErrorMessage("Please fill out all required fields.");
            return;
        }

        // Convert 'Yes'/'No' to 1/0 for backend
        const takeAgainValue = takeAgain === "Yes" ? 1 : 0;
        const mandatoryAttendanceValue = mandatoryAttendance === "Yes" ? 1 : 0;

        // Submit the review to backend
        axios
            .post(`http://localhost:8000/api/instructor/add-rating/${id}`, {
                course_code: courseCode,
                grade: grade || null, // Send null if grade is not provided
                rating: rating,
                difficulty_level: difficulty,
                take_again: takeAgainValue,
                mandatory_attendance: mandatoryAttendanceValue,
                review_text: reviewText,
            })
            .then((response) => {
                setSuccessMessage("Review submitted successfully!");

                // Wait for 2 seconds before redirecting
                setTimeout(() => {
                    navigate(`/instructor/${id}`); // Redirect to the instructor's profile page
                }, 2000);
            })
            .catch((error) => {
                if (error.response && error.response.status === 400) {
                    // Check for duplicate review error from backend
                    setErrorMessage(error.response.data.error); // Display backend error message
                } else {
                    // General error
                    setErrorMessage("Failed to submit review. Please try again.");
                }
            });
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
                        <p className="instructor-name">
                            Rating: <b>{instructorDetails.Instructor_Name}</b>
                        </p>
                        <p className="faculty-type">{instructorDetails.Faculty_Type}</p>
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
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                        style={{ maxHeight: "150px", overflowY: "scroll" }} // Limit dropdown height
                    >
                        <option value="">Select a course</option>
                        {courses.map((course, index) => (
                            <option key={index} value={course.Course_Code}>
                                ({course.Course_Code}) {course.Course_Name}
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
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                    />
                    <div>Selected Rating: {rating}</div>
                </Form.Group>

                {/* Difficulty Level (1-5) */}
                <Form.Group className="mb-3" controlId="formDifficulty">
                    <Form.Label>
                        Difficulty Level (1-5) <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={difficulty}
                        onChange={(e) => setDifficulty(parseInt(e.target.value))}
                    />
                    <div>Selected Difficulty: {difficulty}</div>
                </Form.Group>

                {/* Take Again (Yes/No) */}
                <Form.Group className="mb-3" controlId="formTakeAgain">
                    <Form.Label>
                        Would you choose this instructor again? <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <div>
                        <Form.Check
                            type="radio"
                            label="Yes"
                            name="takeAgain"
                            value="Yes"
                            checked={takeAgain === "Yes"}
                            onChange={(e) => setTakeAgain(e.target.value)}
                            inline
                        />
                        <Form.Check
                            type="radio"
                            label="No"
                            name="takeAgain"
                            value="No"
                            checked={takeAgain === "No"}
                            onChange={(e) => setTakeAgain(e.target.value)}
                            inline
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
                            type="radio"
                            label="Yes"
                            name="mandatoryAttendance"
                            value="Yes"
                            checked={mandatoryAttendance === "Yes"}
                            onChange={(e) => setMandatoryAttendance(e.target.value)}
                            inline
                        />
                        <Form.Check
                            type="radio"
                            label="No"
                            name="mandatoryAttendance"
                            value="No"
                            checked={mandatoryAttendance === "No"}
                            onChange={(e) => setMandatoryAttendance(e.target.value)}
                            inline
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
                        Review <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={10}
                        value={reviewText}
                        onChange={(e) => {
                            if (e.target.value.length <= 350) {
                                setReviewText(e.target.value);
                            }
                        }}
                    />
                    <div className="character-count">
                        {reviewText.length}/350
                    </div>
                    <div className="guidelines">
                        <p>Please follow these guidelines for your review:</p>
                        <ul>
                            <li>Be respectful and avoid offensive language.</li>
                            <li>Focus on the instructor’s teaching and relevant experiences.</li>
                            <li>Keep the review concise and meaningful.</li>
                        </ul>
                    </div>
                </Form.Group>

                {/* Submit Button */}
                <Button variant="primary" type="submit" block>
                    Submit Review
                </Button>
            </Form>

            {/* Error and Success Messages */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
    );
};

export default InstructorRating;
