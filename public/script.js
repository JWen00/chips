var socket = io();
socket.on('redirect', (path) => {
    console.log('path: ', path);
    window.location.href = path;
})