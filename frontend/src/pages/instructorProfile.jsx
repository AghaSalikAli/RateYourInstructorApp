import React, { useEffect, useState } from "react";
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

// Registering the chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

axios.defaults.withCredentials = true;

const InstructorProfile = () => {
    const { id } = useParams(); // Get the instructor ID from the URL
    const [instructor, setInstructor] = useState(null); // State for instructor details
    const [stats, setStats] = useState(null); // State for instructor stats (average rating, difficulty, etc.)
    const [distribution, setDistribution] = useState([]); // State for rating distribution
    const [error, setError] = useState(""); // State for error handling

    useEffect(() => {
        const fetchInstructorData = async () => {
            try {
                // Fetching the instructor's details
                const instructorResponse = await axios.get(`http://localhost:8000/api/instructor/${id}`);
                setInstructor(instructorResponse.data[0]);

                // Fetching the instructor's stats (rating, difficulty, distribution)
                const statsResponse = await axios.get(`http://localhost:8000/api/instructor/stats/${id}`);
                setStats(statsResponse.data.stats[0]);
                setDistribution(statsResponse.data.distribution);

            } catch (err) {
                setError(err.response?.data?.message || "The Instructor you are looking for does not exist.");
            }
        };

        fetchInstructorData();
    }, [id]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!instructor || !stats || !distribution) {
        return <div>Loading...</div>;
    }

    // Fill the missing ratings (1 to 5) with 0 counts
    const ratingCounts = [1, 2, 3, 4, 5].map(rating => {
        const ratingObj = distribution.find(d => d.rating === rating);
        return ratingObj ? ratingObj.count : 0;
    });

    // Preparing data for the bar chart
    const ratingDistribution = {
        labels: ["1", "2", "3", "4", "5"], // Labels for the rating
        datasets: [
            {
                label: "Number of Ratings",
                data: ratingCounts, // Data from the rating distribution
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="instructor-profile-container">
            <div className="instructor-details">
                <h1>{instructor.Instructor_Name}</h1>
                <p><strong>Faculty Type:</strong> {instructor.Faculty_Type}</p>
                <p><strong>Department:</strong> {instructor.Department_Name}</p>
            </div>

            <div className="instructor-stats-and-graph">
                <div className="instructor-stats">
                    <h2>Instructor Stats</h2>
                    <p><strong>Average Rating:</strong> {stats.avg_rating} / 5</p>
                    <p><strong>Average Difficulty Level:</strong> {stats.avg_difficulty_level} / 5</p>
                </div>

                <div className="rating-distribution">
                    <h2>Rating Distribution</h2>
                    <div className="chart-container">
                        <Bar
                            data={ratingDistribution}
                            options={{
                                responsive: true,
                                indexAxis: 'y', // This makes the bar chart horizontal
                                plugins: {
                                    title: {
                                        display: true,
                                        text: "Rating Distribution",
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (tooltipItem) => {
                                                return `Ratings: ${tooltipItem.raw}`;
                                            },
                                        },
                                    },
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: "Number of Reviews", // Label for x-axis (now the number of reviews)
                                        },
                                        beginAtZero: true,
                                        ticks: {
                                            stepSize: 1, // Ensures the X-axis has integer steps
                                            callback: function (value) {
                                                return Number.isInteger(value) ? value : ''; // Ensure only integers are displayed
                                            },
                                        },
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: "Rating", // Label for y-axis (now the ratings)
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorProfile;
