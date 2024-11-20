import express from "express";

const router = express.Router();

import {getDepartment, getDepartments} from '../dbqueries/departmentsdb.js';


//Get all departments
router.get('/', async (req,res) => {
    const departments = await getDepartments();
    res.status(200).json(departments);
});

// Get all Instructors from one Department
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ msg: "Invalid department ID." });
    }

    try {
        const deptInstructors = await getDepartment(id);

        // For departments that do not exist
        if (deptInstructors.length === 0) {
            return res.status(404).json({ msg: `No instructors found for department ID ${id}.` });
        }

        // If instructors are found, send them in the response
        return res.status(200).json(deptInstructors);

    } catch (error) {
        console.error("Error fetching department instructors:", error);
        return res.status(500).send({ msg: "An error occurred while fetching department data." });
    }
});

export default router;