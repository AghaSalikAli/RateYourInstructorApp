import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import isAuthenticated from '../authService';  

const PrivateRoute = () => {
  const [authStatus, setAuthStatus] = useState(null);  

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setAuthStatus(authenticated);  
    };
    
    checkAuth();  // Check auth on page load
  }, []);

  if (authStatus === null) {
    return <div>Loading...</div>;
  }

  if (authStatus) {
    return <Outlet />;
  }
  
  return <Navigate to="/signin" replace />;
};

export default PrivateRoute;