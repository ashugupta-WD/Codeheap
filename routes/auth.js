const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isEmailExists } = require('../middleware/validations');
const fetchAuthUser = require('../middleware/fetchTokenData');

// @route for when access our homepage (depends on whether user is loggng in or not)
router.get('/', fetchAuthUser, (req, res) => {
    if (req.userData.length === 0) {
        res.status(200).sendFile(path.join(__dirname, '../views/landing.html'));
    }
    else {
        res.status(200).send({msg: 'You are already logged in!'});
    }
});

// For rendering login page on client side
router.get('/login', fetchAuthUser, (req, res) => {
    if (req.userData.length === 0) {
        res.status(200).sendFile(path.join(__dirname, '../views/login.html'));
    }
    else {
        res.status(200).send({msg: 'You are already logged in!'});
    }
});


// For rendering the signup page on client side
router.get('/signup', fetchAuthUser, (req, res) => {
    if (req.userData.length === 0) {
        res.status(200).sendFile(path.join(__dirname, '../views/signup.html'));
    }
    else {
        res.status(200).send({msg: 'You are already logged in!'});
    }
});

// For rendering contact page for users -> (NO LOGIN REQUIRED)
router.get('/contact', fetchAuthUser, (req, res) => {
    if (req.userData.length === 0) {
        res.status(200).sendFile(path.join(__dirname, '../views/contact.html'));
    }
    else {
        res.status(200).send({msg: 'You are already logged in!'});
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
                res.status(200).sendFile(path.join(__dirname, '..', 'login.html'));
            }

            const authToken = jwt.sign({ user: result[0]._id }, process.env.SECRET_KEY);
            const expDate = 1000 * 60 * 60 * 24;
            res.cookie('AuthToken', authToken, { maxAge: expDate, path: '/', sameSite: 'lax' });
            res.set('Access-Control-Allow-Origin', req.headers.origin);
            res.set('Access-Control-Allow-Credentials', true);
            res.status(200).sendFile(path.join(__dirname, '..', 'index.html'));
        }
        else {
            res.status(200).sendFile(path.join(__dirname, '..', 'login.html'));

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


//@route 1. For Creating a new user --> NO LOGIN REQUIRED 
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
        const expDate = 1000 * 60 * 60 * 24;
        res.cookie('AuthToken', authToken, { maxAge: expDate, path: '/', sameSite: 'lax' });
        res.set('Access-Control-Allow-Origin', req.headers.origin);
        res.set('Access-Control-Allow-Credentials', true);
        res.status(200).sendFile(path.join(__dirname, '..', 'index.html'));
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;