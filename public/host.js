var socket = io();

let hostForm = document.getElementById('hostForm');
let hostRoomName = document.getElementById('hostRoomName')
let hostUsername = document.getElementById('hostUsername');

// // When user hosts a room 
hostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit('host', hostRoomName.value, hostUsername.value)
});
// socket.on('updatePot', function(pot) {
// var potSpan = document.getElementById('pot');
// console.log(pot);
// potSpan.innerText = pot;
// })

// Switching to join page
function switchToJoin() {
    window.location.href = "/";
}