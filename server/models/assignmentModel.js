const mongoose = require("mongoose");

const assignmentSchema = mongoose.Schema({
    title: String,
    subject: String,
    priority: String,
    date: Date,
    state: {
        type: String,
        enum: ['Pending', 'Doing', 'Done'],
        default: 'Pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Assignment', assignmentSchema);