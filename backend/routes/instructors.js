import express from "express";
import { verifyJWT } from '../middleware.js'; 
import { Filter } from 'bad-words';
import { getInstructor, searchInstructor, getAllCourses, addRating,
     checkDuplicate, getInstructorCourses, getInstructorReviews, getInstructorStats} from '../dbqueries/instructorsdb.js';


const router = express.Router();
const filter = new Filter();

// Search for instructors 
router.get('/search', verifyJWT, async (req, res) => { 
    const name = req.query.name; // query parameter

    const instructor = await searchInstructor(name);
    if (instructor.length === 0) {
        res.status(404).send({ msg: `No instructor with this name was found.` });
    } else {
        res.status(200).json(instructor);
    }
});

// Get all courses
router.get('/courses', verifyJWT, async (req, res) => { 
    const courses = await getAllCourses();
    res.status(200).json(courses);
});

//add a review for an instructor 
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

    //validate review-text
    if (!validateReview(review_text)) {
        return res.status(400).json({ error: 'Review text is too long or contains inappropriate language.' });
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

// Get Instructor Courses 
router.get('/course-list/:id', verifyJWT, async (req, res) => { 
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).send({ msg: `Invalid ID. ID must be a number.` });
    }
    
    const courses = await getInstructorCourses(id);

    if (courses.length === 0) {
        // Returning an empty array instead of an error when no courses are found
        return res.status(200).json([]);
    } else {
        return res.status(200).json(courses);
    }
});

// Get Instructor Reviews
router.get('/reviews/:id', verifyJWT, async (req, res) => { 
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).send({ msg: `Invalid ID. ID must be a number.` });
        return;
    }

    const course_code = req.query.course_code || null; // course_code from query params or null if all reviews are requested
    try {
        const reviews = await getInstructorReviews(id, course_code);

        if (reviews.length === 0) {
            res.status(200).json([]);
        } else {
            res.status(200).json(reviews);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: `Error fetching reviews` });
    }
});

//get instructor stats
router.get('/stats/:id', verifyJWT, async (req, res) => { 
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).send({ msg: `Invalid ID. ID must be a number.` });
        return;
    }
    const stats = await getInstructorStats(id);

    if (stats.length === 0) {
        res.status(404).send({ msg: `No stats found.` });
    } else {
        res.status(200).json(stats);
    }
});

// Get Instructor Profile 
router.get('/:id', verifyJWT, async (req, res) => {  
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

// helper function to check if review text exceeds 350 characters and if it contains inappropriate language
function validateReview(review_text) {
    const forbiddenWords = ["KILL", "DIE", "HATE", "DUMB", "IDIOT"];

    if (review_text.length > 350) {
        return false;
    }
    if (filter.isProfane(review_text)) {
        return false;
    }
    if (forbiddenWords.some(word => review_text.toUpperCase().includes(word))) {
        return false;
    }

    return true;
}

export default router;
