const dotenv = require('dotenv');
dotenv.config();
const connectToMongo = require('./db');
const express = require('express');
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

const httpServer = app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
})


const { Server } = require("socket.io");
const io = new Server(httpServer, { /* options */ });


const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('recieve', { message: message.msg, name: users[socket.id], time: message.time });
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});