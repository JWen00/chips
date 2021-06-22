const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var pot = Number(0);
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    io.emit('updatePot', pot);
    
    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });


    socket.on('addToPot', (chips) => {
        console.log(`Adding ${chips} to pot`);
        pot += Number(chips);
        io.emit('updatePot', pot);
    })
});

server.listen(3000, () => {
  console.log('listening on localhost:3000');
});