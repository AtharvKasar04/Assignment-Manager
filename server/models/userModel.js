const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    assignments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        default: []
    }]
});

module.exports = mongoose.model("User", userSchema);