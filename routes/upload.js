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

// @route 1: RENDER JAVASCRIPT PROJECT UPLOAD PAGE. --> ( LOGIN REQUIRED )
router.get('/js', fetchAuthUser, async (req, res) => {
    await Visitor.updateOne({}, { $inc: { upload: 1 } });
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    } else {
        res.status(200).sendFile(path.join(__dirname, '../views/uploadJS.html'));
    }
});

// @route 2: RENDER PYTHON PROJECT UPLOAD PAGE. --> ( LOGIN REQUIRED )
router.get('/python', fetchAuthUser, async (req, res) => {
    await Visitor.updateOne({}, { $inc: { upload: 1 } });
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    } else {
        res.status(200).sendFile(path.join(__dirname, '../views/uploadPY.html'));
    }
});

// @route 3: RENDER JAVA PROJECT UPLOAD PAGE. --> ( LOGIN REQUIRED )
router.get('/java', fetchAuthUser, async (req, res) => {
    await Visitor.updateOne({}, { $inc: { upload: 1 } });
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    } else {
        res.status(200).sendFile(path.join(__dirname, '../views/uploadJava.html'));
    }
});

// @route 4: RENDER C++ PROJECT UPLOAD PAGE. --> ( LOGIN REQUIRED )
router.get('/cpp', fetchAuthUser, async (req, res) => {
    await Visitor.updateOne({}, { $inc: { upload: 1 } });
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    } else {
        res.status(200).sendFile(path.join(__dirname, '../views/uploadCPP.html'));
    }
});

// @route 5: RENDER C PROJECT UPLOAD PAGE. --> ( LOGIN REQUIRED )
router.get('/c', fetchAuthUser, async (req, res) => {
    await Visitor.updateOne({}, { $inc: { upload: 1 } });
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    } else {
        res.status(200).sendFile(path.join(__dirname, '../views/uploadC.html'));
    }
});


//  JAVSCRIPT PROJECT OBJECT TEMPLATE TO STORE INCOMING REQUEST DATA ( MEDIA FILES ) AND THEN STORE IT IN DATABASE
const jsTemplate = {
    videoPath: '',
    imagePath: '',
    htmlPath: '',
    cssPath: '',
    jsPath: ''
}

//  PROJECT TEXT DATA OBJECT TEMPLATE TO STORE INCOMING REQUEST DATA ( TEXT DATA ) AND THEN STORE IT IN DATABASE
const textTemplate = {
    user: null,
    title: '',
    description: '',
    languages: ''
}

//  PROJECT FILE DATA OBJECT TEMPLATE TO STORE INCOMING REQUEST DATA ( MEDIA DATA ) AND THEN STORE IT IN DATABASE
const projectTemplate = {
    videoPath: '',
    imagePath: '',
    codePath: ''
}

// FUNCTION TO COORECT THE PATH OF MEDIA FILES THAT WAS ASSIGNED BY MULTER BY DEFAULT SO THAT RENDERING OF MEDIA FILES COULD BE DONE PROPERLY
function changePath(originalPath) {
    originalPath = originalPath.replace('uploads', '');
    return originalPath.replace(/\\/g, '/');
}

// @route 6: STORE MEDIA FILES OF JAVASCRIPT PROJECT THAT ARE UPLOADED BY THE USER -> WE ARE USING SEPEARTE ROUTES TO STORE MEDIA FILES AND TEXT DATA BECAUSE MULTER WORKS ON ASYNCHRONOUS CONCEPT SUCH THAT IT STORES ALL MEDIA FILES AND FORGET ABOUT THE TEXT DATA AND RETURNS
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

// @route 7: STORE TEXT DATA OF SENT BY THE USER ALONG WITH MEDIA FILES
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

// @route 8: STORE MEDIA FILES OF PROJECT THAT ARE UPLOADED BY THE USER -> WE ARE USING SEPEARTE ROUTES TO STORE MEDIA FILES AND TEXT DATA BECAUSE MULTER WORKS ON ASYNCHRONOUS CONCEPT SUCH THAT IT STORES ALL MEDIA FILES AND FORGET ABOUT THE TEXT DATA AND RETURNS
router.post('/codefile', fetchAuthUser, upload.fields([{ name: 'imageFile', maxCount: 1 }, { name: 'videoFile', maxCount: 1 }, { name: 'codeFile', maxCount: 1 }]), async (req, res) => {
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    } else {
        try {
            projectTemplate.imagePath = changePath(req.files.imageFile[0].path);
            projectTemplate.videoPath = changePath(req.files.videoFile[0].path);
            projectTemplate.codePath = changePath(req.files.codeFile[0].path);
            const fullTemplate = {...textTemplate, ...projectTemplate};
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