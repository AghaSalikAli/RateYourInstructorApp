import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

axios.defaults.withCredentials = true; // Ensure cookies are sent with requests

const isAuthenticated = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/user/authenticated');
    return response.data.authenticated;  // Return authentication status
  } catch (error) {
    if (error.response && error.response.status === 403) {
      // Token is invalid or missing, return false
      return false;
    }
    console.error(error.response.data);
    return false;
  }
};

const PrivateRoute = () => {
  const [authStatus, setAuthStatus] = useState(null);  // Track auth status

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setAuthStatus(authenticated);  // Update the auth status
    };
    
    checkAuth();  // Check auth on page load
  }, []);

  if (authStatus === null) {
    // Optionally, you can show a loading spinner while checking the auth status
    return <div>Loading...</div>;
  }

  // If the user is authenticated, show the protected route
  if (authStatus) {
    return <Outlet />;
  }

  // Otherwise, redirect to the login page
  return <Navigate to="/signin" replace />;
};

export default PrivateRoute;
