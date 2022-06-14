const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    userPhone: {
        type: String,
        required: true
    },
    userPassword: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);