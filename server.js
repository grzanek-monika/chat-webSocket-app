/* eslint-disable no-undef */
const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

const users = [];
const messages = [];

app.use(express.static(path.join(__dirname, '/client')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
    console.log("Server is running on port: 8000");
});

const io = socket(server);
io.on('connection', (socket) => {
    console.log("Hello, new client!")
    socket.on('join', (name) => {
        console.log(`Its ${name} with id: ${socket.id}`);
        users.push({name, id: socket.id });
        console.log('users: ', users);
        socket.broadcast.emit("message", {author: "Chat Bot", content: `${name} has joined the conversation!`});
    })
    socket.on('message', (message) => { 
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });
    socket.on('disconnect', () => { 
        console.log('Oh, socket ' + socket.id + ' has left');
        const userIndex = users.indexOf(socket.id);
        users.splice(userIndex, 1);
        console.log('users: ', users);
    });
    console.log('I\'ve added a listener on message event \n');
});

  