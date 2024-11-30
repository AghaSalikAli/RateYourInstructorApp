import express from "express";
import { verifyJWT } from '../JWT.js'; 
import { Filter } from 'bad-words';
import { getInstructor, searchInstructor, getAllCourses, addRating, checkDuplicate } from '../dbqueries/instructorsdb.js';


const router = express.Router();
const filter = new Filter();

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
router.get('/courses', verifyJWT, async (req, res) => {  // JWT verification here
    const courses = await getAllCourses();
    res.status(200).json(courses);
});

//add a review for an instructor (protected route)
router.post('/add-rating/:id', verifyJWT, async (req, res) => {
    //user_id from JWT payload
    const user_id = req.user.User_ID;
    const instructor_id = parseInt(req.params.id);
    const {course_code, grade, rating, difficulty_level, take_again, mandatory_attendance, review_text} = req.body;
    if (isNaN(instructor_id)) {
        res.status(400).send({ msg: `Invalid ID. ID must be a number.` });
        return;
    }
    //check for duplicate review
    const duplicate = await checkDuplicate(user_id, instructor_id, course_code);
    if (duplicate.length > 0) {
        return res.status(400).json({ error: 'You have already reviewed this instructor for this course.' });
    }

    //use bad-word-filter to check for inappropriate language
    if (filter.isProfane(review_text)) {
        return res.status(400).json({ error: 'Review contains inappropriate language.' });
    }

    try {
        const result = await addRating(user_id, instructor_id, course_code, grade, rating, difficulty_level, take_again, mandatory_attendance, review_text);
        res.status(200).send({ msg: `Review added successfully.` });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ msg: `Error adding review.` });
    }
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
