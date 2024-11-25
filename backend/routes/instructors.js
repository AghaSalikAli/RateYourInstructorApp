import express from "express";

const router = express.Router();

import {getInstructor} from '../dbqueries/instructorsdb.js';


//Get one Instructor (using req.params)
router.get('/:id', async (req,res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).send({msg: `Invalid ID. ID must be a number.`});
        return;
    }
    const instructor = await getInstructor(id);

    if (instructor.length===0) {
        res.status(404).send({msg: `No teacher with this ID was found.`});
    }
    else {
        res.status(200).json(instructor);
    }
});

export default router;