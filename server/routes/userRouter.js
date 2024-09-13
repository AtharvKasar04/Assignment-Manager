const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/verify-user-auth", isLoggedIn, (req, res) => {
    return res.status(200).json({ status: true, message: "authorized", userId: req.user._id })
});

module.exports = router;