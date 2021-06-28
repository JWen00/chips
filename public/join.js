var socket = io();

let joinForm = document.getElementById('joinForm');
let joinRoomID = document.getElementById('joinRoomID');
let joinUsername = document.getElementById('joinUsername');
let roomError = document.getElementById('roomError');

// When user joins a room
// on success: redirect to room/roomID
// on failure: error message to input "Room doesn't exist"
joinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit('join', joinRoomID.value, joinUsername.value)
});

socket.on('join-error', () => {
    roomError.innerText = "Invalid Lobby ID";
    joinRoomID.style.border = "1px solid red";
    setTimeout(() => {
        roomError.innerText = "";
        joinRoomID.style.border = "1px solid black";
    }, 3000)
});