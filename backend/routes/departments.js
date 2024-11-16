import express from "express";

const router = express.Router();

import {getDepartment, getDepartments} from '../dbqueries/departmentsdb.js';


//Get all departments
router.get('/', async (req,res) => {
    const departments = await getDepartments();
    res.status(200).json(departments);
});

//Get all Instructors from one Department (using req.params)
router.get('/:id', async (req,res) => {
    const id = parseInt(req.params.id);
    const deptInstructors = await getDepartment(id);

    if (deptInstructors.length===0) {
        res.status(404).send({msg: `No teachers in this Department were found.`});
    }
    else {
        res.status(200).json(deptInstructors);
    }
});

export default router;