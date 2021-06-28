const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const url = "http://localhost:3000";


app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

class Room {
    constructor(name) {
        this.roomName = name;

        // Sourced from: https://gist.github.com/gordonbrander/2230317
        this.id = Math.random().toString(36).substr(2, 9);
        this.pot = 0;
        this.users = new Map();
    }

    join(userID, username, startingHand) {
        this.users.set(userID, new Player(userID, username, startingHand));
    }

    disconnect(userID) {
        if (this.users.has(userID)) {
            this.users.delete(userID)
        } else { 
            throw Error('User not in room')
        }
    }
}

class Player {
    constructor(playerID, name, chips) {
        this.id = playerID;
        this.name = name;
        this.chips = chips;
    }

    win(chips) { 
        Number(this.chips) += Number(chips);
    }

    lose(chips) {
        Number(this.chips) -= Number(chips);
    }

    getChips() {
        return this.chips;
    }
}

// GLOBAL ROOMS
let rooms = new Map();

// Main 
app.get('/', (req, res) => {
    res.render('join');
});

app.get('/host', (req, res) => {
    res.render('host')
})


// For a user who is joining via a link
// Error Case: user who somehow enters a valid room but didn't join 

app.get('/join/:roomID', (req, res) => {
    if (!rooms.has(req.params.roomID)) { 
        res.status(404).send('Sorry, this room ID does not exist!')
    } else { 
        res.send('The id you specified is ' + req.params.roomID);
    }
 });


 // For a user who has already joined
 app.get('/play/:roomID/:roomName', (req, res) => {
    res.render('play', { roomName: req.params.roomName, roomID: req.params.roomID});

    // if (!rooms.has(req.params.roomID)) { 
    //     res.status(404).send('Sorry, this room ID does not exist!')
    // } else { 
    //     res.render('play', { roomName: res.params.roomName, roomID: res.params.roomID});
    // }
 });



 // 404 Page
 app.get('*', (req, res) => {
    res.status(404).send('Uh oh! We can\'t find what you\'re looking for');
  });

io.on('connection', (socket) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    console.log(`Incoming user. ${socket.id}`)
    socket.on('disconnect', () => {
        console.log(`a user disconnected. ${socket.id}`);
    });

    socket.on('host', (roomName, username) => {
        const room = new Room(roomName);
        room.join(socket.id, username, 0);
        rooms.set(room.id, room);     
        socket.join(room.id);

        // Redirect user
        io.emit('redirect', `${url}/play/${room.id}`);
        io.to(room.id).emit('new-player', username);
    })

    socket.on('join', (roomID, username) => {
        if (rooms.has(roomID)) {
            rooms.get(roomID).join(socket.id, username, 0);
            socket.join(roomID);

            io.emit('redirect', `${url}/play/${roomID}`);
            io.to(roomID).emit('new-player', username);
        } else {
            io.emit('join-error');
        }   
    })
});



server.listen(3000, () => {
  console.log('listening on localhost:3000');
});