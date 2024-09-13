const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

module.exports = async function (req, res, next) {
    if (!req.cookies.token) {
        return res.status(401).json({ message: "Log in first!" });
    }

    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        let user = await userModel
            .findOne({ email: decoded.email })
            .select("-password");
        req.user = user;
        next();
    } catch (err) {
        return res.status(401);
    }
}