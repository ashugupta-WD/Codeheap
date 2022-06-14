const mongoose = require('mongoose');
// const mongoURI = "mongodb://localhost:27017/Ashwani";
async function main() {
    await mongoose.connect(process.env.mongoURI);
}

const connectToMongo = ()=>{
    main().then(()=>{console.log("Connected to mongo successfully")}).catch(err=>{console.log(err)});
}

module.exports = connectToMongo;