import React from 'react';
import '../styles/signin.css';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useState } from 'react';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send POST request to your backend with the email and password
    try {
      const response = await axios.post('http://localhost:8000/api/user/login', {
        email,
        password,
      });

      // If login is successful, handle the response (e.g., store user session or token)
      console.log('Login successful:', response.data);
      // Redirect user to homepage or dashboard
    } catch (error) {
      // If there's an error, show an error message
      setErrorMessage('Invalid email or password');
      console.error('Error during login:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="SignIn">
      <h1>Sign in Page</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>IBA Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter IBA email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Text className="text-muted">
            All reviews are anonymous.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Signin;