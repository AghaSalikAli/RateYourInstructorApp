import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import Select from "react-select";
import "../styles/instructorProfile.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

axios.defaults.withCredentials = true;

const InstructorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState(null);
  const [stats, setStats] = useState(null);
  const [distribution, setDistribution] = useState([]);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("All");

  const fetchReviews = useCallback(
    async (courseCode = null) => {
      try {
        const queryParam =
          courseCode && courseCode !== "All" ? `?course_code=${courseCode}` : "";
        const response = await axios.get(
          `http://localhost:8000/api/instructor/reviews/${id}${queryParam}`
        );
        setReviews(response.data || []);
      } catch (err) {
        setReviews([]);
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
        // Prepend the "All" option then merge with sorted courses (sorted by course_name)
        const allOption = { course_code: "All", course_name: "All Courses" };
        const otherCourses = coursesResponse.data.slice().sort((a, b) =>
          a.course_name.localeCompare(b.course_name)
        );
        setCourseList([allOption, ...otherCourses]);

        fetchReviews();
      } catch (err) {
        setError(
          err.response?.data?.msg ||
            "The Instructor you are looking for does not exist."
        );
      }
    };

    fetchData();
  }, [id, fetchReviews]);

  // Map courseList to react-select options with desired format
  const courseOptions = courseList.map(course => {
    if (course.course_code === "All") {
      return {
        value: course.course_code,
        label: course.course_name,
      };
    }
    return {
      value: course.course_code,
      label: `(${course.course_code}) ${course.course_name}`,
    };
  });

  // Set react-select value based on selectedCourse
  const selectedOption =
    courseOptions.find(option => option.value === selectedCourse) ||
    courseOptions[0];

  const handleCourseSelectChange = (selectedOption) => {
    setSelectedCourse(selectedOption.value);
    if (selectedOption.value === "All") {
      fetchReviews();
    } else {
      fetchReviews(selectedOption.value);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!instructor || !stats || !distribution) {
    return <div>Loading...</div>;
  }

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
              Based on <strong>{stats.total_reviews} Total Reviews</strong>
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
              onClick={() => navigate(`/instructor/add-rating/${id}`)}
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
                      callback: function (value) {
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
        <div className="course-select-container">
          <Select
            className="react-select-container"
            classNamePrefix="react-select"
            options={courseOptions}
            value={selectedOption}
            onChange={handleCourseSelectChange}
            placeholder="Select a course"
            noOptionsMessage={() => "No courses available"}
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
          />
        </div>
        <div className="reviews-container">
          {reviews.length === 0 ? (
            <p>No reviews available for this instructor.</p>
          ) : (
            reviews.map((review, index) => (
              <div className="review-card" key={index}>
                <div className="report-button-container">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip id="report-tooltip">
                        Report this rating
                      </Tooltip>
                    }
                  >
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        navigate(`/instructor/flag-rating/${review.Review_id}`)
                      }
                    >
                      ⚐
                    </Button>
                  </OverlayTrigger>
                </div>
                <h3>{review.course_name}</h3>
                <p>
                  <strong>Date:</strong> {review.review_date}
                </p>
                <p>
                  <strong>Rating:</strong> {review.rating} / 5
                </p>
                <p>
                  <strong>Difficulty Level:</strong> {review.difficulty_level} / 5
                </p>
                <p>
                  <strong>Take Again:</strong> {review.take_again ? "Yes" : "No"}
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
