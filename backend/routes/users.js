import express from "express";
import bcrypt from 'bcrypt';

const router = express.Router();

import {registerUser, loginUser} from '../dbqueries/usersdb.js';

//register a user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  try {
      // Check if a user with the given email already exists
      const existingUser = await loginUser(email);
      
      if (existingUser.length > 0) {
          //Return an error
          return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 5);

      // Register the new user using the InsertUser stored procedure
      const newUser = await registerUser(email, hashedPassword);
      

      res.json({ message: 'User registered successfully', newUser });
  } catch (error) {
      // Handle database or other errors
      console.error(error);
      res.status(500).json({ message: 'Something went wrong, please try again' });
  }
});

//login a user
router.post('/login', async (req,res) => {
    const {email, password} = req.body;
    const user = await loginUser(email);
    console.log(user);
    if (user.length === 0) {
        res.status(401).json({message: "User does not exist"});
        return;
    }
    const userPassword = user[0].Password_hash;
    const passwordMatch = await bcrypt.compare(password, userPassword);
    if (!passwordMatch) {
        res.status(401).json({message: "Invalid password"});
        return;
    }
    res.json({message: "Login successful"});
});

export default router;