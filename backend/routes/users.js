import express from "express";
import bcrypt from 'bcrypt';
import { generateJWT, verifyJWT } from '../JWT.js';

const router = express.Router();

import {registerUser, loginUser, registerAdmin} from '../dbqueries/usersdb.js';


//register a user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  try {
      // Check if a user with the given email already exists
      const existingUser = await loginUser(email);
      
      if (existingUser.length > 0) {
          return res.status(400).json({ message: 'User already exists' });
      }

      //check if email ends with @khi.iba.edu.pk
      if (!email.endsWith('@khi.iba.edu.pk')) {
        return res.status(400).json({ message: 'Invalid email. Must be an IBA email.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 5);

      // Registering new user
      const newUser = await registerUser(email, hashedPassword);
      

      res.json({ message: 'User registered successfully'});
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong, please try again' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await loginUser(email);
  
    if (user.length === 0) {
      return res.status(401).json({ message: "User does not exist" });
    }
  
    const userPassword = user[0].Password_hash;
    const passwordMatch = await bcrypt.compare(password, userPassword);
  
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
  
    // Generate JWT token
    const token = generateJWT(user[0]);
  
    // Store JWT in a cookie
    res.cookie('token', token, {
      httpOnly: true, // Can't be accessed via JavaScript at front end
       secure: true,
       sameSite: 'None',
    });
  
    res.json({ message: "Login successful" });
  });
  
  // Logout a user
  router.post('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the JWT token cookie
    res.json({ message: 'Logged out successfully' });
  });

//check if valid cookie
router.get('/authenticated', verifyJWT, (req, res) => {
    // Check if user is signed in
    if (req.user) {
      res.json({ authenticated: true });
    } else {
      res.json({ authenticated: false });
    }
  });
  
//check if user is an admin
router.get('/admin-check', verifyJWT, (req, res) => {
    // Check if the user is an admin
    if (req.user && req.user.IsAdmin===1) {
      res.json({ admin: true });
    } else {
      res.json({ admin: false });
    }
  });

//register an admin
router.post('/register-admin', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Check if an admin with the given email already exists
        const existingUser = await loginUser(email);
        
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Admin already exists' });
        }
  
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 5);
  
        // Registering admin
        const newUser = await registerAdmin(email, hashedPassword);
        
  
        res.json({ message: 'Admin registered successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong, please try again' });
    }
  });

  export default router;