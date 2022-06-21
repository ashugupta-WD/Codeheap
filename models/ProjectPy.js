const mongoose = require('mongoose');
const pythonSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    videoPath: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    languages: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    pythonPath: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Python', pythonSchema);