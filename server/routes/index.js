const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const assignmentModel = require("../models/assignmentModel");

router.get("/user-assignments", isLoggedIn, async (req, res) => {
    res.json({ message: "This is a protected route" });
})

module.exports = router;