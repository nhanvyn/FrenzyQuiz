const { Pool } = require('pg');
const dotenv = require('dotenv');
const express = require('express');
const http = require("http");
const { Server } = require('socket.io');
const cors = require("cors");
const app = express();
dotenv.config();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

const port = process.env.PORT || 3500;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
})
// const pool = new Pool ({
//   user: "postgres",
//   host: "34.28.208.104",
//   port: "5432",
//   database: "postgres",
//   password: "frenzyquizdb@372"
// })

pool.connect(err => {
  if (err) {
    console.error('connection error', err.stack);
  } else {
    console.log('db connected');
  }
});




const quizzes = [
  {
    id: "123",
    name: "quiz1",
    question: "59",
    points: "10",
    date: "20-09-2023",
    author: "sup@gmail.com"

  },
  {
    id: "456",
    name: "quiz2",
    question: "10",
    points: "20",
    date: "20-09-2023",
    author: "sup@gmail.com"
  }
]

let rooms = {}

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`)

  socket.on("join_room", (data) => {
    console.log(`User: ${data.email} connect_id: ${socket.id} joined room ${data.quizId}`);
    // attach player's socket connection to this room 
    socket.join(data.quizId)

    // if this is the first time the room is created, init empty players array and attach quiz data to this room
    if (!rooms[data.quizId]) {
      const quiz = quizzes.find((quiz) => quiz.id == data.quizId) // this will be replace with endpoint to database later
      rooms[data.quizId] = {
        players: [],
        quiz: quiz
      }
    }
    // todo: handle the case where user join with different connection with same email and their previous connection has not shutdown => need to shutdown the previous connection and replace the connect_id with new connection. this happen when user close the browser but the connection still lives

    // check if user already exists in the room
    const existingPlayer = rooms[data.quizId].players.find(player => player.email === data.email)

    // If user doesn't exist in the room, add them
    if (!existingPlayer) {
      rooms[data.quizId].players.push({ email: data.email, connect_id: socket.id });
    }

    // send a list of updated players to all players 
    io.in(data.quizId).emit("display_new_player", rooms[data.quizId].players)

    //send quiz data to all players 
    io.in(data.quizId).emit("update_quiz", rooms[data.quizId].quiz)
  })


  socket.on('leave_room', (data) => {
    // remove player from the room
    if (rooms[data.quizId].players) {
      rooms[data.quizId].players = rooms[data.quizId].players.filter(player => player.email !== data.email)
    }

    // disconnect player from this room
    socket.leave(data.quizId)

    // update new player list
    io.in(data.quizId).emit("display_new_player", rooms[data.quizId].players)
  })

  socket.on('find_current_room', (data) => {
    let roomData = null;
    for (let quizId in rooms) {
      const room = rooms[quizId]
      const player = room.players.find(p => p.email === data.email)
      if (player) {
        roomData = room
        break;
      }
    }
    socket.emit('current_room_found', roomData)
  })


  socket.on('delete_room', (data) => {
    if (rooms[data.quizId].players) {
      // notify every one that this room is deleted 
      io.in(data.quizId).emit("room_deleted");
      // remove all players from this room
      rooms[data.quizId].players.forEach(player => {
        const playerSocket = io.sockets.sockets.get(player.connect_id);
        if (playerSocket) {
          playerSocket.leave(data.quizId)
        }
      })
    }
    delete rooms[data.quizId]


  })
})


app.get('/', (req, res) => {
  res.send('Hello World!')
});


app.get('/protected', (req, res) => {
  res.send('Hello!')
})



server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
  console.log(process.env.DB_USER)
});