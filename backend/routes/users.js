import express from "express";
import bcrypt from 'bcrypt';

const router = express.Router();

import {registerUser, loginUser} from '../dbqueries/usersdb.js';


//register a user
router.post('/register', async (req,res) => {
    const {email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = await registerUser(email, hashedPassword);
    res.json(newUser);
});

//login a user
router.post('/login', async (req,res) => {
    const {email, password} = req.body;
    const user = await loginUser(email);
    if (user.length === 0) {
        res.status(401).json({message: "Invalid email or password"});
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