import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const Homepage = () => {
    return (
        <div className="homepage">
            <h1> 
                RateYourInstructor
                <br />
                Homepage
            </h1>
            <div>
                <Button variant="primary" as={Link} to="/signin" style={{marginRight: '10px', marginTop: '10px'}}>
                    Sign In
                </Button>
                <Button variant="secondary" as={Link} to="/signup" style={{marginRight: '10px', marginTop: '10px'}}>
                    Sign Up
                </Button>
            </div>
        </div>
    );
};

export default Homepage;