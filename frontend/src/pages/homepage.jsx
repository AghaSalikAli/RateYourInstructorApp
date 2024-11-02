import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
    return (
        <div>
        <h1>Homepage of RateYourInstructor</h1>
        <div>
            <button> 
                <Link to="/signin">Sign In</Link>
            </button>
            <button>
                <Link to="/signup">Sign Up</Link>
            </button>

        </div>
        </div>
    );
    };

export default Homepage;