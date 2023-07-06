
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


pool.connect(err => {
  if (err) {
    console.error('connection error', err.stack);
  } else {
    console.log('db connected');
  }
});



let rooms = {}

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`)

  socket.on("join_room", (data) => {
    console.log(`User: ${data.username} connect_id: ${socket.id} joined room ${data.quizId}`);
    // attach player's socket connection to this room 
    socket.join(data.quizId)

    // push the new player to the room where they joined
    if (!rooms[data.quizId]) {
      rooms[data.quizId] = []
    }
    rooms[data.quizId].push({ username: data.username, connect_id: socket.id });

    // send a list of updated players to all players 
    io.in(data.quizId).emit("display_new_player", rooms[data.quizId])
  })


  socket.on('leave_room', (data) => {
    // remove player from the room
    if (rooms[data.quizId]) {
      rooms[data.quizId] = rooms[data.quizId].filter(player => player.connect_id !== socket.id)
    }
    
    // disconnect player from this room
    socket.leave(data.quizId) 

    // update new player list
    io.in(data.quizId).emit("display_new_player", rooms[data.quizId])
  })


})


app.get('/', (req, res) => {
  res.send('Hello World!')
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
});