import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import "../styles/instructorProfile.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

axios.defaults.withCredentials = true;

const InstructorProfile = () => {
    const { id } = useParams(); // Get the instructor ID from the URL
    const [instructor, setInstructor] = useState(null); // State for instructor details
    const [stats, setStats] = useState(null); // State for instructor stats
    const [distribution, setDistribution] = useState([]); // State for rating distribution
    const [error, setError] = useState(""); // State for error handling

    const [reviews, setReviews] = useState([]); // State for reviews
    const [courseList, setCourseList] = useState([]); // State for dropdown options
    const [selectedCourse, setSelectedCourse] = useState("All"); // State for selected dropdown value

    const fetchReviews = useCallback(
        async (courseCode = null) => {
            try {
                const queryParam = courseCode ? `?course_code=${courseCode}` : "";
                const response = await axios.get(
                    `http://localhost:8000/api/instructor/reviews/${id}${queryParam}`
                );
                if (response.data.length === 0) {
                    setReviews([]); // Set empty reviews array if no reviews are found
                } else {
                    setReviews(response.data); // Set the reviews if found
                }
            } catch (err) {
                setReviews([]); // Set empty reviews array in case of error
                setError(err.response?.data?.msg || "Failed to load reviews.");
            }
        },
        [id]
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const instructorResponse = await axios.get(
                    `http://localhost:8000/api/instructor/${id}`
                );
                setInstructor(instructorResponse.data[0]);

                const statsResponse = await axios.get(
                    `http://localhost:8000/api/instructor/stats/${id}`
                );
                setStats(statsResponse.data.stats[0]);
                setDistribution(statsResponse.data.distribution);

                const coursesResponse = await axios.get(
                    `http://localhost:8000/api/instructor/course-list/${id}`
                );
                setCourseList([
                    { course_code: "All", course_name: "All Courses" },
                    ...coursesResponse.data,
                ]);

                fetchReviews(); // Fetch all reviews initially
            } catch (err) {
                setError(
                    err.response?.data?.msg ||
                        "The Instructor you are looking for does not exist."
                );
            }
        };

        fetchData();
    }, [id, fetchReviews]);

    const handleCourseChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedCourse(selectedValue);
        if (selectedValue === "All") {
            fetchReviews();
        } else {
            fetchReviews(selectedValue);
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!instructor || !stats || !distribution) {
        return <div>Loading...</div>;
    }

    // Fill missing ratings
    const ratingCounts = [1, 2, 3, 4, 5].map((rating) => {
        const ratingObj = distribution.find((d) => d.rating === rating);
        return ratingObj ? ratingObj.count : 0;
    });

    const ratingDistribution = {
        labels: ["1", "2", "3", "4", "5"],
        datasets: [
            {
                label: "Number of Ratings",
                data: ratingCounts,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="instructor-profile-container">
            <div className="top-section">
                <div className="instructor-details">
                    <h1>{instructor.Instructor_Name}</h1>
                    <p>
                        <strong>Faculty Type:</strong> {instructor.Faculty_Type}
                    </p>
                    <p>
                        <strong>Department:</strong> {instructor.Department_Name}
                    </p>
                    <div className="instructor-stats">
                        <h2>Instructor Stats</h2>
                        <p>
                            Based on <strong> {stats.total_reviews} Total Reviews</strong>
                        </p>
                        <p>
                            <strong>Average Rating:</strong> {stats.avg_rating} / 5
                        </p>
                        <p>
                            <strong>Average Difficulty Level:</strong>{" "}
                            {stats.avg_difficulty_level} / 5
                        </p>
                    </div>
                    <div className="rate-button-container">
                        <button
                            className="rate-button"
                            onClick={() =>
                                (window.location.href = `/instructor/add-rating/${id}`)
                            }
                        >
                            Rate ➔
                        </button>
                    </div>
                </div>
                <div className="rating-distribution">
                    <h2>Rating Distribution</h2>
                    <div className="chart-container">
                        <Bar
                            data={ratingDistribution}
                            options={{
                                responsive: true,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: "Rating Distribution",
                                        font: {
                                            size: 18,
                                        },
                                    },
                                    legend: {
                                        display: false,
                                    },
                                },
                                scales: {
                                    x: {
                                        beginAtZero: true,
                                    },
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            stepSize: 1,
                                            precision: 0,
                                            // Optionally, you can add a callback to ensure only integers are displayed
                                            callback: function(value) {
                                                if (Number.isInteger(value)) {
                                                    return value;
                                                }
                                                return null;
                                            },
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="reviews-section">
                <h2>Reviews</h2>
                <select
                    className="course-dropdown"
                    value={selectedCourse}
                    onChange={handleCourseChange}
                >
                    {courseList.map((course) => (
                        <option
                            key={course.course_code}
                            value={course.course_code}
                        >
                            {course.course_name}
                        </option>
                    ))}
                </select>
                <div className="reviews-container">
                    {reviews.length === 0 ? (
                        <p>No reviews available for this instructor.</p>
                    ) : (
                        reviews.map((review, index) => (
                            <div className="review-card" key={index}>
                                <h3>{review.course_name}</h3>
                                <p>
                                    <strong>Rating:</strong> {review.rating} / 5
                                </p>
                                <p>
                                    <strong>Difficulty Level:</strong>{" "}
                                    {review.difficulty_level} / 5
                                </p>
                                <p>
                                    <strong>Take Again:</strong>{" "}
                                    {review.take_again ? "Yes" : "No"}
                                </p>
                                <p>
                                    <strong>Mandatory Attendance:</strong>{" "}
                                    {review.mandatory_attendance ? "Yes" : "No"}
                                </p>
                                {review.grade && (
                                    <p>
                                        <strong>Grade:</strong> {review.grade}
                                    </p>
                                )}
                                <p>
                                    <strong>Review:</strong> {review.review_text}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorProfile;
