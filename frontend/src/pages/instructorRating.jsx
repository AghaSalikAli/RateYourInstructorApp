import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/instructorRating.css";

axios.defaults.withCredentials = true;

const InstructorRating = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [instructorDetails, setInstructorDetails] = useState(null);
  const [error, setError] = useState(false);

  // Use react-select for both course level and course selection
  const courseLevelOptions = [
    { value: "Bachelors", label: "Bachelors" },
    { value: "Masters", label: "Masters" },
  ];
  const [selectedCourseLevel, setSelectedCourseLevel] = useState(null);

  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [rating, setRating] = useState(1);
  const [difficulty, setDifficulty] = useState(1);
  const [takeAgain, setTakeAgain] = useState(null);
  const [mandatoryAttendance, setMandatoryAttendance] = useState(null);
  const [grade, setGrade] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const grades = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "F"];

  useEffect(() => {
    const fetchInstructorDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/instructor/${id}`);
        if (response.data.length === 0) {
          setError(true);
        } else {
          setInstructorDetails(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching instructor details:", error);
        setError(true);
      }
    };
    fetchInstructorDetails();
  }, [id]);

  // Fetch courses whenever the course level changes
  useEffect(() => {
    const fetchCourses = async () => {
      if (!selectedCourseLevel) {
        setCourseOptions([]);
        setSelectedCourse(null);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:8000/api/instructor/courses?level=${selectedCourseLevel.value}`
        );
        const options = response.data.map((course) => ({
          value: course.Course_Code,
          label: `(${course.Course_Code}) ${course.Course_Name}`,
        }));
        setCourseOptions(options);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setErrorMessage("Failed to load courses. Please try again.");
      }
    };
    fetchCourses();
  }, [selectedCourseLevel]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !selectedCourseLevel ||
      !selectedCourse ||
      !rating ||
      !difficulty ||
      takeAgain === null ||
      mandatoryAttendance === null ||
      !reviewText
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    // Convert 'Yes'/'No' to 1/0 for backend
    const takeAgainValue = takeAgain === "Yes" ? 1 : 0;
    const mandatoryAttendanceValue = mandatoryAttendance === "Yes" ? 1 : 0;

    axios
      .post(`http://localhost:8000/api/instructor/add-rating/${id}`, {
        course_code: selectedCourse.value,
        grade: grade || null,
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
          navigate(`/instructor/${id}`);
        }, 2000);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage("Failed to submit review. Please try again.");
        }
      });
  };

  if (error) {
    return (
      <div className="InstructorRatingError">
        <h1>Error</h1>
        <p>The instructor you want to review does not exist.</p>
      </div>
    );
  }

  return (
    <div className="InstructorRating">
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
        {/* Course Level Dropdown using react-select (non-searchable) */}
        <Form.Group className="mb-3" controlId="formCourseLevel">
          <Form.Label>
            Course Level <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Select
            className="react-select-container"
            classNamePrefix="react-select"
            options={courseLevelOptions}
            value={selectedCourseLevel}
            onChange={(option) => {
                setSelectedCourseLevel(option);
                setSelectedCourse(null);
              }}
            placeholder="Select course level"
            isSearchable={false}
          />
        </Form.Group>

        {/* Course Dropdown using react-select */}
        <Form.Group className="mb-3" controlId="formCourse">
          <Form.Label>
            Course Name <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Select
            className="react-select-container"
            classNamePrefix="react-select"
            options={courseOptions}
            value={selectedCourse}
            onChange={setSelectedCourse}
            placeholder="Select a course"
            noOptionsMessage={() => "No courses available"}
          />
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
          <div className="character-count">{reviewText.length}/350</div>
          <div className="guidelines">
            <p>Please follow these guidelines for your review:</p>
            <ul>
              <li>Be honest but do not use offensive language.</li>
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

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default InstructorRating;
