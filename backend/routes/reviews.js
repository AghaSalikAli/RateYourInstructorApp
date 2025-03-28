import express from "express";
import { verifyJWT } from '../middleware.js'; 
const router = express.Router();

import { getReviewDetails, flagReview} from '../dbqueries/reviewsdb.js';

// Flag a review
router.post('/flag', verifyJWT, async (req, res) => {
    const { review_id, reason } = req.body;
    const user_id = req.user.User_ID;

    // Check if review_id is a number
    if (isNaN(review_id)) {
        return res.status(400).json({ msg: "Invalid review ID." });
    }

    // Check if reason is a string
    if (typeof reason !== 'string') {
        return res.status(400).json({ msg: "Invalid reason." });
    }

    try {
        // Call the function to flag the review
        await flagReview(user_id, review_id, reason);
        return res.status(200).json({ msg: "Review has been flagged." });
    } catch (error) {
        console.error("Error flagging review:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            // Duplicate entry error caught, user already flagged this review
            return res.status(400).json({ msg: "You have already flagged this review." });
        }
        return res.status(500).send({ msg: "An error occurred while flagging the review." });
    }
});


// Get a particular review
router.get('/:id', verifyJWT, async (req, res) => {  
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ msg: "Invalid review ID." });
    }

    try {
        const review = await getReviewDetails(id);

        // For reviews that do not exist
        if (review.length === 0) {
            return res.status(404).json({ msg: `No review found with this ID.` });
        }

        // If review is found, send it in the response
        return res.status(200).json(review);

    } catch (error) {
        console.error("Error fetching review:", error);
        return res.status(500).send({ msg: "An error occurred while fetching review data." });
    }
});

export default router;