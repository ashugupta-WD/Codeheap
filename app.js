const dotenv = require('dotenv');
dotenv.config();
const connectToMongo = require('./db');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
connectToMongo();
const app = express();
app.use(cookieParser());
const port = process.env.PORT;
app.set('views', './views')
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads'));
app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(express.json());
app.use('/', require('./routes/auth'));
app.use('/upload', require('./routes/upload'));

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
})
