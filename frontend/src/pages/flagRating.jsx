import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import '../styles/flagRating.css';

axios.defaults.withCredentials = true;

const FlagRating = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [flagReason, setFlagReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8000/api/review/${reviewId}`)
      .then(response => {
        // The API returns an array with one review object
        if (response.data && response.data.length > 0) {
          setReview(response.data[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching review details", err);
        setErrorMessage("Error loading review details.");
        setLoading(false);
      });
  }, [reviewId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (flagReason.trim() === '') {
      setErrorMessage("Please provide a reason for flagging.");
      return;
    }

    axios.post('http://localhost:8000/api/review/flag', {
      review_id: Number(reviewId),
      reason: flagReason
    })
    .then(response => {
      setSuccessMessage(response.data.msg || "Review flagged successfully!");
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    })
    .catch(error => {
      console.error("Error flagging review:", error);
      setErrorMessage("Failed to flag review. " + error.response.data.msg);
    });
  };

  return (
    <div className="flag-rating-container">
      <h1>Flag Review</h1>
      {loading ? (
        <p>Loading review details...</p>
      ) : review ? (
        <div className="review-details">
          <h3>Review Details</h3>
          <p><strong>Instructor:</strong> {review.instructor_name}</p>
          <p><strong>Course Code:</strong> {review.course_code}</p>
          <p><strong>Course Name:</strong> {review.course_name}</p>
          <p><strong>Rating:</strong> {review.rating}</p>
          <p><strong>Review:</strong> {review.review_text}</p>
        </div>
      ) : (
        <p>Review details not available.</p>
      )}
      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group className="mb-3" controlId="flagReason">
          <Form.Label>Why are you flagging this review? <span style={{color: "red"}}>*</span></Form.Label>
          <Form.Control
            as="textarea"
            maxLength={350}
            rows={5}
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
          />
          <Form.Text muted>
            Maximum 350 characters.
          </Form.Text>
        </Form.Group>
        <Button variant="danger" type="submit" block>
          Submit Report
        </Button>
      </Form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <Button variant="secondary" className="mt-3" onClick={() => navigate(-1)}>
        Back
      </Button>
    </div>
  );
};

export default FlagRating;
