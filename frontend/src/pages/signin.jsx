import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    // Validate fields
    let valid = true;

    if (!email || !email.includes("@khi.iba.edu.pk")) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    if (!password) {
      setPasswordError(true);
      valid = false;
    } else {
      setPasswordError(false);
    }

    if (!valid) return;

    // Send POST request to your backend
    try {
      const response = await axios.post('http://localhost:8000/api/user/login', {
        email,
        password,
      });

      console.log(response.data);
      navigate('/search');
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.message : error.message);
      console.error(error.response || error);
    }
  };

  return (
    <div className="SignIn">
      <h1>Sign in Page</h1>
      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>IBA Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter IBA email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={emailError} // Bootstrap invalid style
            style={{ height: '38px' }} // Ensure consistent height
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid IBA email.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={passwordError} // Bootstrap invalid style
            style={{ height: '38px' }} // Ensure consistent height
          />
          <Form.Control.Feedback type="invalid">
            Please enter your password.
          </Form.Control.Feedback>
        </Form.Group>

        <div className="message" style={{ minHeight: '20px' }}>
          {errorMessage && <span className="error">{errorMessage}</span>}
        </div>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      {/* Link to Sign Up page */}
      <div className="mt-3">
          <p>Not registered? <Link to="/signup">Click here</Link> to sign up.</p>
        </div>
    </div>
  );
};

export default Signin;
