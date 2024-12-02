import axios from 'axios';

axios.defaults.withCredentials = true; 

// Function to check if the user is authenticated
const isAuthenticated = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/user/authenticated');
    return response.data.authenticated;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      return false;
    }
    console.error("Error checking authentication:", error);
    return false;
  }
};

export default isAuthenticated;
