const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fs = require('fs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');
const Visitor = require('../models/Visitors');
const Query = require('../models/Contact');
const { isEmailExists } = require('../middleware/validations');
const fetchAuthUser = require('../middleware/fetchTokenData');
const { readCodeFile } = require('../middleware/codeToText');


function changePath(originalPath) {
    originalPath = originalPath.replace('uploads', '');
    return originalPath.replace(/\\/g, '/');
}

function getTimeDifference(date) {
    const projectDate = Date.parse(date);
    const todayDate = new Date().getTime();
    let diff = Math.floor((todayDate - projectDate) / 1000);
    if (diff > 0 && diff < 60) {
        return (diff + ' secs ago');
    } else if (diff < (60 * 60)) {
        return (Math.floor(diff / 60) + ' min ago');
    } else if (diff < (60 * 60 * 24)) {
        return (Math.floor(diff / (60 * 60)) + ' hr ago');
    } else {
        return (Math.floor(diff / (60 * 60 * 24)) + ' day ago');
    }
};

function getProjectInfo(obj, fullName) {
    const info = {
        author: fullName,
        projectId: obj._id,
        title: obj.title,
        language: obj.languages,
        image: obj.imagePath,
        time: getTimeDifference(obj.timeStamp)
    };
    return info;
}

router.get('/', (req, res) => {
    res.status(200).redirect('/home');
});


// @route for when access our homepage (depends on whether user is loggng in or not)
router.get('/home', fetchAuthUser, async (req, res) => {
    const length = (await Visitor.find({})).length;
    if (length === undefined || length === 0) {
        Visitor().save();
    }
    await Visitor.updateOne({}, { $inc: { home: 1 } });
    if (req.userData.length === 0) {
        res.status(200).sendFile(path.join(__dirname, '../views/landing.html'));
    }
    else {
        res.status(200).sendFile(path.join(__dirname, '../views/index.html'));
    }
});

// For rendering login page on client side
router.get('/login', fetchAuthUser, async (req, res) => {
    await Visitor.updateOne({}, { $inc: { login: 1 } });
    if (req.userData.length === 0) {
        res.status(200).sendFile(path.join(__dirname, '../views/login.html'));
    }
    else {
        // res.status(200).sendFile(path.join(__dirname, '../views/index.html'));
        res.status(200).redirect('/home');
    }
});


// For rendering the signup page on client side
router.get('/signup', fetchAuthUser, async (req, res) => {
    await Visitor.updateOne({}, { $inc: { signup: 1 } });
    if (req.userData.length === 0) {
        res.status(200).sendFile(path.join(__dirname, '../views/signup.html'));
    }
    else {
        res.status(200).redirect('/home');
        // res.status(200).sendFile(path.join(__dirname, '../views/index.html'));
    }
});

// For rendering contact page for users -> (NO LOGIN REQUIRED)
router.get('/contact', fetchAuthUser, async (req, res) => {
    await Visitor.updateOne({}, { $inc: { contact: 1 } });
    if (req.userData.length === 0) {
        res.status(200).sendFile(path.join(__dirname, '../views/contact.html'));
    }
    else {
        res.status(200).sendFile(path.join(__dirname, '../views/contact.html'));
    }
});


// @route 1. For collecting user queries and storing them on cloud database
router.post('/contact', async (req, res) => {
    try {
        const query = Query(req.body);
        query.save();
        res.status(200).sendFile(path.join(__dirname, '../views/thankyou.html'));
    } catch (error) {
        res.status(401).send({ msg: "Some Error Occurred! Please try again" });
    }
});

// @route 2. For when user is trying to login
router.post('/login', async (req, res) => {
    let { userEmail, userPassword } = req.body;
    try {
        let result = await isEmailExists(userEmail);
        if (result.length !== 0) {
            const passCompare = await bcrypt.compare(userPassword, result[0].userPassword);
            console.log(passCompare);
            if (!passCompare) {
                res.status(200).sendFile(path.join(__dirname, '../views/login.html'));
            }

            const authToken = jwt.sign({ user: result[0]._id }, process.env.SECRET_KEY);
            const expDate = 1000 * 60 * 60 * 24 * 14;
            res.cookie('AuthToken', authToken, { maxAge: expDate, path: '/', sameSite: 'lax' });
            res.set('Access-Control-Allow-Origin', req.headers.origin);
            res.set('Access-Control-Allow-Credentials', true);
            res.status(200).redirect('/home');
        }
        else {
            res.status(200).sendFile(path.join(__dirname, '../views/login.html'));

        }
    } catch (error) {
        res.status(401).send("Internal Server Error!");
    }
});


// Check whether the user already exist or not when the user is trying to create a new account.
router.post('/checkmail', async (req, res) => {
    try {
        let result = await isEmailExists(req.body.userEmail);
        let resmsg;
        if (result.length !== 0)
            resmsg = { statusCode: 200, msg: "WHO ARE YOU ?", result: true };
        else
            resmsg = { statusCode: 200, msg: "Welcome to codeheap!", result: false };
        res.status(200).send(resmsg);
    } catch (error) {
        res.status(401).send("Internal Server Error!");
    }
});


//@route 3. For Creating a new user --> NO LOGIN REQUIRED 
router.post('/signup', async (req, res) => {
    try {
        // Encrypt the password of the user in hash using ( bcrypt js )
        await bcrypt.genSalt(saltRounds).then(async (res) => {
            const hash = await bcrypt.hash(req.body.userPassword, res).then((hash) => {
                req.body.userPassword = hash;
                return hash;
            });
            return hash;
        });
        const user = User(req.body);
        user.save();
        const authToken = jwt.sign({ user: user.id }, process.env.SECRET_KEY);
        const expDate = 1000 * 60 * 60 * 24 * 14;
        res.cookie('AuthToken', authToken, { maxAge: expDate, path: '/', sameSite: 'lax' });
        res.set('Access-Control-Allow-Origin', req.headers.origin);
        res.set('Access-Control-Allow-Credentials', true);
        // res.status(200).sendFile(path.join(__dirname, '..', 'index.html'));
        res.status(200).redirect('/home');
    }
    catch (err) {
        console.log(err);
        res.status(401).send("Internal Server Error!");
    }
});


// @route 4 -> To sign out a user if he/she is logged in ( Login required )
router.get('/logout', fetchAuthUser, async (req, res) => {
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    }
    else {
        res.clearCookie('AuthToken');
        res.status(200).redirect('/login');
    }
});

// @route 5 -> To render notes list page for the signed in user ( Login required )
router.get('/notes', fetchAuthUser, async (req, res) => {
    await Visitor.updateOne({}, { $inc: { notes: 1 } });
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    }
    else {
        res.status(200).sendFile(path.join(__dirname, '../views/notesList.html'));
    }
});

// @route 6 -> To render videos list page for the signed in user ( Login required )
router.get('/videos', fetchAuthUser, async (req, res) => {
    await Visitor.updateOne({}, { $inc: { video: 1 } });
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    }
    else {
        res.status(200).sendFile(path.join(__dirname, '../views/videosList.html'));
    }
});

// @route 7 -> To render project list page using pug template and mongodb database
router.get('/projects', fetchAuthUser, async (req, res) => {
    await Visitor.updateOne({}, { $inc: { project: 1 } });
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    }
    else {
        try {
            const projects = await Project.find({}); // --> returns an array  //
            const authorList = [];
            const list = [];
            for (let index = 0; index < projects.length; index++) {
                let name = await User.find({ _id: projects[index].user }, { firstName: 1, lastName: 1, _id: 0 });
                list.push(getProjectInfo(projects[index], (name[0].firstName + ' ' + name[0].lastName)));
            }
            console.log(list);
            res.status(200).render('projectList', { list });
        }
        catch (error) {
            console.log(error);
            res.status(404).send({ msg: "Some Error Occurred!" });
        }
    }
});

// @route 8 -> Show the list of projects user has already uploaded using pug template ( LOGIN REQUIRED )
router.get('/myprojects', fetchAuthUser, async (req, res) => {
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    }
    else {
        try {
            const list = [];
            const projects = await Project.find({ user: req.userData[0]._id }); // --> returns an array  //
            await projects.forEach((element, index, array) => {
                list.push(getProjectInfo(element, req.userData[0].firstName));
            });
            res.status(200).render('userProjects', { list });
        } catch (error) {
            console.log(error);
            res.status(401).send({ msg: "Internal Server Error!" });
        }
    }
});

// @route 9 -> RENDER THE PAGE WHERE CODE IS AVAILABLE TO SEE AND COPY USING PUG TEMPLATE -> ( LOGIN REQUIRED )
router.get('/showproject', fetchAuthUser, async (req, res) => {
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    }
    else {
        try {
            const projects = await Project.find({ _id: req.query.projectId });
            if (JSON.stringify(projects[0].user) !== JSON.stringify(req.userData[0]._id)) {
                await Project.updateOne({ _id: req.query.projectId }, { $inc: { views: 1 } });
            }
            const htmlText = await readCodeFile('uploads'+projects[0].htmlPath);
            const cssText = await fs.promises.readFile('uploads'+projects[0].cssPath, 'utf-8');
            const jsText = await fs.promises.readFile('uploads'+projects[0].jsPath, 'utf-8');
            res.status(200).render('viewProject', { info: { video: projects[0].videoPath, title: projects[0].title, description: projects[0].description, html: htmlText, css: cssText, js: jsText, author: (req.userData[0].firstName + ' ' + req.userData[0].lastName), time: getTimeDifference(projects[0].timeStamp) } });
        } catch (error) {
            console.log(error);
            res.status(401).send({ msg: 'Internal Server Error!' });
        }
    }
});

// @route 10: -> RENDER THE ABOUT PAGE ( LOGIN REQUIRED )
router.get('/about', fetchAuthUser, async (req, res) => {
    await Visitor.updateOne({}, { $inc: { about: 1 } });
    if (req.userData.length === 0) {
        res.status(200).redirect('/home');
    }
    else {
        res.status(200).sendFile(path.join(__dirname, '../views/about.html'));
    }
})


module.exports = router;