import express from "express";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { generateJWT, verifyJWT, verificationemail } from '../middleware.js';


const router = express.Router();

import {registerUser, loginUser, getUserByToken, verifyUser} from '../dbqueries/usersdb.js';


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

      // verifcation token for email
      const verificationToken = uuidv4();
      const tokenCreatedTimestamp = new Date();

      // Registering new user
      const newUser = await registerUser(email, hashedPassword, verificationToken, tokenCreatedTimestamp);

      // Send verification email
      verificationemail(email, verificationToken);
      

      res.json({ message: 'User registered successfully'});
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong, please try again' });
  }
});

// Verify user account
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;
  
  if (!token) {
    // Redirect to frontend with an error
    return res.redirect('http://localhost:3000/verify-result?status=error&message=No%20token%20provided');
  }

  try {
    const user = await getUserByToken(token);

    if (user.length === 0) {
      // Invalid or expired token
      return res.redirect('http://localhost:3000/verify-result?status=error&message=Invalid%20or%20expired%20token');
    }

    // Otherwise, verify user
    await verifyUser(user[0].User_ID);

    // Redirect with success
    return res.redirect('http://localhost:3000/verify-result?status=success&message=User%20verified%20successfully');
  } catch (error) {
    console.error('Error verifying user:', error);
    // Generic error
    return res.redirect('http://localhost:3000/verify-result?status=error&message=Something%20went%20wrong');
  }
});


// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await loginUser(email);
  
    if (user.length === 0) {
      return res.status(401).json({ message: "User does not exist" });
    }

    //add logic to check if user has verified their email
    if (user[0].IsVerified==0) {
      return res.status(401).json({ message: "Account is not verified. Check your email."});
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


  export default router;