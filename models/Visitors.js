const mongoose = require('mongoose');
const visitorSchema = new mongoose.Schema({
    home: {
        type: Number,
        default: 0
    },
    login: {
        type: Number,
        default: 0
    },
    signup: {
        type: Number,
        default: 0
    },
    contact: {
        type: Number,
        default: 0
    },
    project: {
        type: Number,
        default: 0
    },
    about: {
        type: Number,
        default: 0
    },
    video: {
        type: Number,
        default: 0
    },
    notes: {
        type: Number,
        default: 0
    },
    upload: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Visitor', visitorSchema);