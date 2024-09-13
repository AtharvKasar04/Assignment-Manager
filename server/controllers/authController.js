const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.send("All fields are required! Please try again");
    }

    let foundUser = await userModel.findOne({ email: email });

    if (foundUser) return res.status(401).json({ message: "User already registered, Please Log in." });

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            if (err) return res.send(err.message);
            else {
                let createdUser = await userModel.create({
                    username,
                    email,
                    password: hash,
                });

                // let token = generateToken(createdUser);
                // res.cookie("token", token, {
                //     httpOnly: true
                // });

                res.status(201).send("User created successfully!");
            }
        })
    })
}

module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    let foundUser = await userModel.findOne({ email });
    if(!foundUser) return res.status(404).json({ message: "Email or password is found to be invalid!" });

    bcrypt.compare(password, foundUser.password, function(err,result){
        if(result){
            let token = generateToken(foundUser);
            res.cookie("token", token, {
                httpOnly: true
            });
            res.status(200).json({ message: "You can Login" });
        }
        else{
            return res.status(401).json({ message: "Email or Password invalid, Please try again." });
        }
    })
}

module.exports.logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
        sameSite: 'strict'
    });
    res.status(200).json({ message: "Logged out successfully!" });
}
