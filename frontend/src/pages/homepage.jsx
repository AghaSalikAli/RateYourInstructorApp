import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { FaStar, FaUserSecret, FaSearch } from "react-icons/fa"; // Importing icons

const Homepage = () => {
    return (
        <div className="homepage">
            {/* Hero Section */}
            <Container className="hero-section">
                <h1>RateYourInstructor</h1>
                <h3>For Students, By Students</h3>
                <p>Your trusted platform to rate and review instructors, helping you make informed decisions.</p>
                <div className="hero-buttons">
                    <Button variant="primary" as={Link} to="/signin">
                        Sign In
                    </Button>
                    <Button variant="secondary" as={Link} to="/signup">
                        Sign Up
                    </Button>
                </div>
            </Container>

            {/* Features Section */}
            <Container className="features-section">
                <h2>Our Features</h2>
                <Row>
                    <Col md={4} sm={12}>
                        <Card className="feature-card">
                            <div className="feature-icon">
                                <FaStar size={50} color="#28a745" />
                            </div>
                            <Card.Body>
                                <Card.Title>Comprehensive Reviews</Card.Title>
                                <Card.Text>
                                    Read detailed reviews and ratings from fellow students to choose the best instructors.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} sm={12}>
                        <Card className="feature-card">
                            <div className="feature-icon">
                                <FaUserSecret size={50} color="#17a2b8" />
                            </div>
                            <Card.Body>
                                <Card.Title>Anonymous Feedback</Card.Title>
                                <Card.Text>
                                    Provide honest and anonymous feedback to help instructors improve their teaching methods.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} sm={12}>
                        <Card className="feature-card">
                            <div className="feature-icon">
                                <FaSearch size={50} color="#ffc107" />
                            </div>
                            <Card.Body>
                                <Card.Title>Search & Filter</Card.Title>
                                <Card.Text>
                                    Easily search for instructors and filter reviews based on courses.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Homepage;