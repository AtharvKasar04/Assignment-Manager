const assignmentModel = require("../models/assignmentModel");
const userModel = require("../models/userModel");
const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");

router.post("/create-assignment", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email})
    if (!user) {
        return res.status(404).send("User not found");
    }

    if (!user.assignments) {
        user.assignments = [];
    }

    const { title, subject, date, priority } = req.body;

    let createdAssignment = await assignmentModel.create({
        title,
        subject,
        date,
        priority,
        user: user._id
    });

    user.assignments.push(createdAssignment._id);
    await user.save();

    return res.status(201).json(createdAssignment);
});

router.put("/update-state/:id", isLoggedIn, async (req, res) => {
    try {
        const { state } = req.body;
        const assignmentId = req.params.id;

        if (!['pending', 'doing', 'done'].includes(state)) {
            return res.status(400).json({ message: "Invalid state" });
        }

        const updatedAssignment = await assignmentModel.findByIdAndUpdate(
            assignmentId,
            { state: state },
            { new: true }
        );

        if (!updatedAssignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        res.status(200).json(updatedAssignment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:userId", isLoggedIn, async (req, res) => {
    try {
        const userId = req.params.userId;

        const assignmentsFromDB = await assignmentModel.find({ user: userId });

        if (!assignmentsFromDB.length) {
            return res.status(404).json({ message: "No assignments found for this user" });
        }

        res.status(200).json(assignmentsFromDB);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.delete("/:assignmentId", isLoggedIn, async (req, res) => {
    try {
        const { assignmentId } = req.params;

        const result = await assignmentModel.findByIdAndDelete(assignmentId);

        if (!result) {
            return res.status(404).json({ message: "Assignment Not Found!" });
        }

        res.status(200).json({ message: "Assignment deleted Successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;