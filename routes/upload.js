const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const { upload } = require('../middleware/fileUpload')
const Project = require('../models/Project');
const ProjectPy = require('../models/ProjectPy');
const Visitor = require('../models/Visitors');
const fetchAuthUser = require('../middleware/fetchTokenData');
app.use(express.json());

// @route 1: FETCH ALL PROJECTS OF A USER. --> ( LOGIN REQUIRED )
router.get('/uploadjs', fetchAuthUser, async (req, res) => {
    await Visitor.updateOne({}, { $inc: { upload: 1 } });
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    } else {
        res.status(200).sendFile(path.join(__dirname, '../views/uploadJS.html'));
    }
});

router.get('/uploadpy', fetchAuthUser, async (req, res) => {
    await Visitor.updateOne({}, { $inc: { upload: 1 } });
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    } else {
        res.status(200).sendFile(path.join(__dirname, '../views/uploadPY.html'));
    }
});


//  JAVSCRIPT PROJECT OBJECT TEMPLATE TO STORE INCOMING REQUEST DATA AND THEN STORE IN DATABASE
const projectTemplate = {
    user: null,
    videoPath: '',
    imagePath: '',
    title: '',
    description: '',
    languages: '',
    htmlPath: '',
    cssPath: '',
    jsPath: ''
}

const pythonTemplate = {
    user: null,
    videoPath: '',
    imagePath: '',
    title: '',
    description: '',
    languages: '',
    pythonPath: ''
}


function changePath(originalPath) {
    originalPath = originalPath.replace('uploads', '');
    return originalPath.replace(/\\/g, '/');
}

// @route 2: STORE MEDIA FILES THAT ARE UPLOADED BY THE USER -> WE ARE USING SEPEARTE ROUTES TO STORE MEDIA FILES AND TEXT DATA BECAUSE MULTER WORKS ON ASYNCHRONOUS CONCEPT SUCH THAT IT STORES ALL MEDIA FILES AND FORGET ABOUT THE TEXT DATA AND RETURNS
router.post('/uploadjs', fetchAuthUser, upload.fields([{ name: 'imageFile', maxCount: 1 }, { name: 'videoFile', maxCount: 1 }, { name: 'htmlFile', maxCount: 1 }, { name: 'cssFile', maxCount: 1 }, { name: 'jsFile', maxCount: 1 }]), async (req, res) => {
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    } else {
        try {
            projectTemplate.imagePath = changePath(req.files.imageFile[0].path);
            projectTemplate.videoPath = changePath(req.files.videoFile[0].path);
            projectTemplate.htmlPath = changePath(req.files.htmlFile[0].path);
            projectTemplate.cssPath = changePath(req.files.cssFile[0].path);
            projectTemplate.jsPath = changePath(req.files.jsFile[0].path);
            const newProject = new Project(projectTemplate);
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
            projectTemplate.user = req.userData[0].id;
            projectTemplate.title = req.body.projectTitle;
            projectTemplate.description = req.body.description;
            projectTemplate.languages = req.body.projectLanguages;
            res.status(200).send({ msg: "Text Data recieved!", result: true });
        } catch (error) {
            console.log(error);
            res.send({ msg: "Internal Server Error!", result: false });
        }
    }
});


router.post('/uploadpy', fetchAuthUser, upload.fields([{ name: 'imageFile', maxCount: 1 }, { name: 'videoFile', maxCount: 1 }, { name: 'pythonFile', maxCount: 1 }]), async (req, res) => {
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    } else {
        try {
            pythonTemplate.imagePath = changePath(req.files.imageFile[0].path);
            pythonTemplate.videoPath = changePath(req.files.videoFile[0].path);
            pythonTemplate.pythonPath = changePath(req.files.pythonFile[0].path);
            const newProject = new ProjectPy(pythonTemplate);
            await newProject.save();
            res.send({ msg: "Files recieved!", nextURL: '/myprojects' });
        } catch (error) {
            console.log(error);
            res.status(404).send({ msg: "Internal Server Error!" });
        }
    }
});

// @route 3: STORE TEXT DATA OF SENT BY THE USER ALONG WITH MEDIA FILES
router.post('/uploadpytext', fetchAuthUser, async (req, res) => {
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    }
    else {
        try {
            pythonTemplate.user = req.userData[0].id;
            pythonTemplate.title = req.body.projectTitle;
            pythonTemplate.description = req.body.description;
            pythonTemplate.languages = req.body.projectLanguages;
            res.status(200).send({ msg: "Text Data recieved!", result: true });
        } catch (error) {
            console.log(error);
            res.send({ msg: "Internal Server Error!", result: false });
        }
    }
});

module.exports = router;