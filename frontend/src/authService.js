import axios from 'axios';

axios.defaults.withCredentials = true;  // Ensures cookies are sent with requests

// Function to check if the user is authenticated
const isAuthenticated = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/user/authenticated');
    return response.data.authenticated;  // Return authentication status
  } catch (error) {
    if (error.response && error.response.status === 403) {
      // Token is invalid or missing, return false
      return false;
    }
    console.error("Error checking authentication:", error);
    return false;
  }
};

export default isAuthenticated;
