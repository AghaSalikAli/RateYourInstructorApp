import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

axios.defaults.withCredentials = true;

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [signupMessage, setSignupMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [retypePasswordError, setRetypePasswordError] = useState(false);

    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSignupMessage("");

        // Clear error states
        setEmailError(false);
        setPasswordError(false);
        setRetypePasswordError(false);

        // Validate fields
        let valid = true;

        // Email validation
        if (!email || !email.includes("@khi.iba.edu.pk")) {
            setEmailError(true);
            valid = false;
        }

        // Password validation
        if (!password || password.length < 6 || !/\d/.test(password)) {
            setPasswordError(true);
            valid = false;
        }

        // Retype password validation
        if (!retypePassword || retypePassword !== password) {
            setRetypePasswordError(true);
            valid = false;
        }

        if (!valid) return; // Do not proceed if fields are invalid

        // Send POST request to your backend with the email and password
        try {
            const response = await axios.post("http://localhost:8000/api/user/register", {
                email,
                password,
            });

            // If signup is successful, handle the response
            console.log("Signup successful:", response.data);
            setSignupMessage(response.data.message);

            // Wait for 1 second before redirecting
            setTimeout(() => {
                navigate("/signin"); // Redirect to Signin page after successful signup
            }, 1000); // Wait for 1 second before redirecting
        } catch (error) {
            // If there's an error, show an error message
            console.error("Error during signup:", error.response ? error.response.data : error.message);
            setErrorMessage(error.response ? error.response.data.message : error.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h1>Sign Up</h1>
                <Form onSubmit={handleSubmit} noValidate>
                    {/* Email Input */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>IBA Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter IBA email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            isInvalid={emailError} // Bootstrap invalid style
                        />
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid IBA email.
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Password Input */}
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            isInvalid={passwordError} // Bootstrap invalid style
                        />
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid password.
                        </Form.Control.Feedback>
                        {/* Password guideline */}
                        <Form.Text className="text-muted">
                            <ul style={{ paddingLeft: "20px", marginBottom: "0" }}>
                                <li>At least 6 characters long</li>
                                <li>Contain at least one number</li>
                            </ul>
                        </Form.Text>
                    </Form.Group>

                    {/* Retype Password Input */}
                    <Form.Group className="mb-3" controlId="formRetypePassword">
                        <Form.Label>Retype Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Retype Password"
                            value={retypePassword}
                            onChange={(e) => setRetypePassword(e.target.value)}
                            isInvalid={retypePasswordError} // Bootstrap invalid style
                        />
                        <Form.Control.Feedback type="invalid">
                            {retypePasswordError ? "Passwords do not match." : "Please retype your password."}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Error Messages */}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    {signupMessage && <div className="signup-message">{signupMessage}</div>}

                    {/* Submit Button */}
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>

                {/* Link to Sign In page */}
                <div className="mt-3">
                    <p>
                        Already registered? <Link to="/signin">Click here</Link> to sign in.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
