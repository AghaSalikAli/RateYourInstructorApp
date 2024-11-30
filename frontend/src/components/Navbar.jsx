import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import isAuthenticated from '../authService'; // Import the authentication utility function

const Navbar = () => {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      const authenticated = await isAuthenticated();
      setIsAuthenticatedState(authenticated); // Update the state based on response
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      // Send logout request to the backend to clear the session or JWT cookie
      await axios.post('http://localhost:8000/api/user/logout', {}, { withCredentials: true });
      setIsAuthenticatedState(false); // Update state to logged out
      window.location.reload(); // Reload the page after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">RateYourInstructor</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Common Links */}
            <li className="nav-item">
              <Link className="nav-link" to="/search">Search</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/departments">Departments</Link>
            </li>

            {/* Conditional Links based on authentication status */}
            {!isAuthenticatedState ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signin">Signin</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">Signup</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
