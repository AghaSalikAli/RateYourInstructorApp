import express from "express";
import bcrypt from 'bcrypt';

const router = express.Router();

import {registerUser, loginUser} from '../dbqueries/usersdb.js';

//register a user
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const hashedPassword = await bcrypt.hash(password, 5);
      const newUser = await registerUser(email, hashedPassword);
      res.json(newUser);
    } catch (error) {
      // Handle database error (e.g., duplicate email)
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'User already exists' });
      }
      // If it's some other error, log it and send a generic error message
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