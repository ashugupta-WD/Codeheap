const dotenv = require('dotenv');
dotenv.config();
const connectToMongo = require('./db');
const express = require('express');
const cookieParser = require('cookie-parser');
connectToMongo();
const app = express();
app.use(cookieParser());
const port = process.env.PORT;
const Chat = require('./models/Chatroom');
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
    socket.on('new-user-joined', data => {
        users[socket.id] = {name: data.name, userID: data.user, active: data.active};
        if(!(users[socket.id].active)){
            socket.broadcast.emit('user-joined', (data.name));
        }
    });

    socket.on('send', message => {
        socket.broadcast.emit('recieve', { message: message.msg, name: (users[socket.id].name), time: message.time });
    });

    socket.on('disconnect', async (message) => {
        try {
            const userId = users[socket.id].userID;
            await Chat.deleteOne({user: userId});
            setTimeout(async () => {
                if((await Chat.find({user: userId})).length === 0){
                    socket.broadcast.emit('left', (users[socket.id].name));
                    delete users[socket.id];
                }
            }, 10000);
        } catch (error) {
            return;
        }
    });
});