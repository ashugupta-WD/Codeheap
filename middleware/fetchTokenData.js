const jwt = require('jsonwebtoken');
const User = require('../models/User');

const tokenData = async (req, res, next) => {
    const token = req.cookies['AuthToken'];
    if (!token) {
        req.userData = [];
        next();
    }
    else {
        try {
            const data = jwt.verify(token, process.env.SECRET_KEY);
            const userId = data.user;
            const userData = await User.findById(userId).select("-userPassword");
            req.userData = [userData]
            next();
        } catch (error) {
            console.log(error);
            req.userData = [];
            next();
        }
    }
}

module.exports = tokenData;