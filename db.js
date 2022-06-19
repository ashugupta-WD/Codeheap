const mongoose = require('mongoose');
async function main() {
    await mongoose.connect(process.env.mongoURI);
    // await mongoose.connect(process.env.cloudMongoURI);
}

const connectToMongo = () => {
    main().then(() => { console.log("Connected to mongo successfully") }).catch(err => { console.log(err) });
}

module.exports = connectToMongo;