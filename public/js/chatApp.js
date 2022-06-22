const socket = io();

const messageContainer = document.getElementsByClassName('messageContainer')[0];
const alertBox = document.getElementsByClassName('alert')[0];
alertBox.innerHTML = '<strong>Warning! Refreshing the page will delete all you messages.</strong>';
setTimeout(() => {
    alertBox.style.display = 'none';
}, 5000);

function appendUsername(name, msg) {
    const html = `<div class="bg-info text-dark rounded py-2 px-3 mr-3">${name} ${msg} the chat</div>`;
    const element = document.createElement('div');
    element.innerHTML = html;
    element.classList.add('chat-message-middle');
    element.classList.add('pb4');
    messageContainer.append(element);
}

function appendUserMessage(msg, time) {
    const html = `<div>
        <img src="images/user.png" class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">
        <div class="text-muted small text-nowrap mt-2">${time}</div></div>
        <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3"><div class="font-weight-bold mb-1">You</div>${msg}</div>`;
    const element = document.createElement('div');
    element.innerHTML = html;
    element.classList.add('chat-message-right');
    element.classList.add('pb4');
    messageContainer.append(element);
}

function appendRecieverMessage(msg, name, time) {
    const html = `<div>
        <img src="images/user.png" class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">
        <div class="text-muted small text-nowrap mt-2">${time}</div></div>
        <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3"><div class="font-weight-bold mb-1">${name}</div>${msg}</div>`;
    const element = document.createElement('div');
    element.innerHTML = html;
    element.classList.add('chat-message-left');
    element.classList.add('pb4');
    messageContainer.append(element);
}


function timeStamp() {
    const now  = new Date();
    let hrs = now.getHours();
    let mts = now.getMinutes();
    let mdn = 'AM';
    if(hrs>=12){mdn = "PM";}
    if(hrs === 24){hrs = 12}
    if(hrs > 12){hrs = hrs%12}
    return (`${hrs}:`+`${mts} `+ mdn);
}

async function getName() {
    const name = await fetch('/getchatname').then(res=>res.json()).then(json=> data = json.name); 
    socket.emit('new-user-joined', name);
    return;
}

getName();

socket.on('user-joined', name => {
    appendUsername(name, "joined");
})

socket.on('recieve', data => {
    appendRecieverMessage(data.message, data.name, data.time);
})

socket.on('left', name => {
    appendUsername(name, "left");
})


function sendMessage() {
    const message = {msg: document.getElementById('message').value, time: timeStamp()};
    appendUserMessage(message.msg, message.time);
    socket.emit('send', message);
    document.getElementById('message').value = '';
}
