import express from "express";
import { verifyJWT } from '../JWT.js'; // Import the JWT verification middleware
const router = express.Router();

import { getInstructor, searchInstructor, getAllCourses } from '../dbqueries/instructorsdb.js';

// Search for instructors (protected route)
router.get('/search', verifyJWT, async (req, res) => {  // Apply JWT verification here
    const name = req.query.name; // query parameter

    const instructor = await searchInstructor(name);
    if (instructor.length === 0) {
        res.status(404).send({ msg: `No teacher with this name was found.` });
    } else {
        res.status(200).json(instructor);
    }
});

// Get all courses (protected route)
router.get('/courses', verifyJWT, async (req, res) => {  // Apply JWT verification here
    const courses = await getAllCourses();
    res.status(200).json(courses);
});

// Get Instructor Profile (protected route)
router.get('/:id', verifyJWT, async (req, res) => {  // Apply JWT verification here
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).send({ msg: `Invalid ID. ID must be a number.` });
        return;
    }
    const instructor = await getInstructor(id);

    if (instructor.length === 0) {
        res.status(404).send({ msg: `No teacher with this ID was found.` });
    } else {
        res.status(200).json(instructor);
    }
});

export default router;
