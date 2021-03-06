const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
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
    htmlPath: {
        type: String,
        required: true
    },
    cssPath: {
        type: String,
        required: true
    },
    jsPath: {
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

module.exports = mongoose.model('Project', projectSchema);