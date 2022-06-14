const User = require('../models/User');

const isEmailExists = async function(email) {
   let result = await User.find({userEmail: email}).then(res=>{
        if(res.length === 0) {return [];}
        return res;
    }).catch(err=>{console.log(err)});
    return result;
}

module.exports = {isEmailExists};