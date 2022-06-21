const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const { upload } = require('../middleware/fileUpload')
const Project = require('../models/Project');
const Python = require('../models/ProjectPy');
const Visitor = require('../models/Visitors');
const fetchAuthUser = require('../middleware/fetchTokenData');
app.use(express.json());

// @route 1: FETCH ALL PROJECTS OF A USER. --> ( LOGIN REQUIRED )
router.get('/js', fetchAuthUser, async (req, res) => {
    await Visitor.updateOne({}, { $inc: { upload: 1 } });
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    } else {
        res.status(200).sendFile(path.join(__dirname, '../views/uploadJS.html'));
    }
});

router.get('/python', fetchAuthUser, async (req, res) => {
    await Visitor.updateOne({}, { $inc: { upload: 1 } });
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    } else {
        res.status(200).sendFile(path.join(__dirname, '../views/uploadPY.html'));
    }
});


//  JAVSCRIPT PROJECT OBJECT TEMPLATE TO STORE INCOMING REQUEST DATA AND THEN STORE IN DATABASE
const jsTemplate = {
    videoPath: '',
    imagePath: '',
    htmlPath: '',
    cssPath: '',
    jsPath: ''
}

const textTemplate = {
    user: null,
    title: '',
    description: '',
    languages: ''
}

const pythonTemplate = {
    videoPath: '',
    imagePath: '',
    pythonPath: ''
}


function changePath(originalPath) {
    originalPath = originalPath.replace('uploads', '');
    return originalPath.replace(/\\/g, '/');
}

// @route 2: STORE MEDIA FILES THAT ARE UPLOADED BY THE USER -> WE ARE USING SEPEARTE ROUTES TO STORE MEDIA FILES AND TEXT DATA BECAUSE MULTER WORKS ON ASYNCHRONOUS CONCEPT SUCH THAT IT STORES ALL MEDIA FILES AND FORGET ABOUT THE TEXT DATA AND RETURNS
router.post('/js', fetchAuthUser, upload.fields([{ name: 'imageFile', maxCount: 1 }, { name: 'videoFile', maxCount: 1 }, { name: 'htmlFile', maxCount: 1 }, { name: 'cssFile', maxCount: 1 }, { name: 'jsFile', maxCount: 1 }]), async (req, res) => {
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    } else {
        try {
            jsTemplate.imagePath = changePath(req.files.imageFile[0].path);
            jsTemplate.videoPath = changePath(req.files.videoFile[0].path);
            jsTemplate.htmlPath = changePath(req.files.htmlFile[0].path);
            jsTemplate.cssPath = changePath(req.files.cssFile[0].path);
            jsTemplate.jsPath = changePath(req.files.jsFile[0].path);
            const fullTemplate = {...textTemplate, ...jsTemplate};
            const newProject = new Project(fullTemplate);
            await newProject.save();
            res.send({ msg: "Files recieved!", nextURL: '/myprojects' });
        } catch (error) {
            console.log(error);
            res.status(404).send({ msg: "Internal Server Error!" });
        }
    }
});

// @route 3: STORE TEXT DATA OF SENT BY THE USER ALONG WITH MEDIA FILES
router.post('/uploadtext', fetchAuthUser, async (req, res) => {
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    }
    else {
        try {
            textTemplate.user = req.userData[0].id;
            textTemplate.title = req.body.projectTitle;
            textTemplate.description = req.body.description;
            textTemplate.languages = req.body.projectLanguages;
            res.status(200).send({ msg: "Text Data recieved!", result: true });
        } catch (error) {
            console.log(error);
            res.send({ msg: "Internal Server Error!", result: false });
        }
    }
});


router.post('/python', fetchAuthUser, upload.fields([{ name: 'imageFile', maxCount: 1 }, { name: 'videoFile', maxCount: 1 }, { name: 'pythonFile', maxCount: 1 }]), async (req, res) => {
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    } else {
        try {
            pythonTemplate.imagePath = changePath(req.files.imageFile[0].path);
            pythonTemplate.videoPath = changePath(req.files.videoFile[0].path);
            pythonTemplate.pythonPath = changePath(req.files.pythonFile[0].path);
            const fullTemplate = {...textTemplate, ...pythonTemplate};
            const newProject = new Python(fullTemplate);
            await newProject.save();
            res.send({ msg: "Files recieved!", nextURL: '/myprojects' });
        } catch (error) {
            console.log(error);
            res.status(404).send({ msg: "Internal Server Error!" });
        }
    }
});

module.exports = router;