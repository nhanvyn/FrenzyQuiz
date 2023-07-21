const { Pool } = require("pg");
const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const port = process.env.PORT || 3500;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

pool.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("db connected");
  }
});

let rooms = {};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    console.log(
      `User: ${data.email} connect_id: ${socket.id} joined room ${data.quizId}`
    );
    // attach player's socket connection to this room
    socket.join(data.quizId);

    // if this is the first time the room is created, init empty players array and attach quiz data to this room
    if (!rooms[data.quizId]) {
      // const quiz = quizzes.find((quiz) => quiz.id == data.quizId); // this will be replace with endpoint to database later
      rooms[data.quizId] = {
        players: [],
        quiz: data.quiz,
      };
    }

    // check if user already exists in the room
    const existingPlayerIndex = rooms[data.quizId].players.findIndex(
      (player) => player.email === data.email
    );

    // If user doesn't exist in the room, add them
    if (existingPlayerIndex === -1) {
      rooms[data.quizId].players.push({
        email: data.email,
        connect_id: socket.id,
      });
    } else {
      // this is where player reconnect with different socket.id -> modify their previous id with new socket id
      rooms[data.quizId].players[existingPlayerIndex] = {
        email: data.email,
        connect_id: socket.id,
      };
    }

    // send a list of updated players to all players
    io.in(data.quizId).emit("display_new_player", rooms[data.quizId].players);
  });

  socket.on("leave_room", (data) => {
    // remove player from the room
    if (rooms[data.quizId].players) {
      rooms[data.quizId].players = rooms[data.quizId].players.filter(
        (player) => player.email !== data.email
      );
    }

    // disconnect player from this room
    socket.leave(data.quizId);

    // update new player list
    io.in(data.quizId).emit("display_new_player", rooms[data.quizId].players);
  });

  // homepage use this to find previously joined room
  socket.on("find_current_room", (data) => {
    let roomData = null;
    for (let quizId in rooms) {
      const room = rooms[quizId];
      const player = room.players.find((p) => p.email === data.email);
      if (player) {
        roomData = room;
        break;
      }
    }
    socket.emit("current_room_found", roomData);
  });

  // when the host click on delete room button
  socket.on("delete_room", (data) => {
    if (rooms[data.quizId].players) {
      // notify every one that this room is deleted
      io.in(data.quizId).emit("room_deleted");
      // remove all players from this room
      rooms[data.quizId].players.forEach((player) => {
        const playerSocket = io.sockets.sockets.get(player.connect_id);
        if (playerSocket) {
          playerSocket.leave(data.quizId);
        }
      });
    }
    delete rooms[data.quizId];
  });

  // check if a room exist before joining player
  socket.on("check_room_exists", (data) => {
    if (rooms[data.quizId]) {
      socket.emit("room_exists", true);
    } else {
      socket.emit("room_exists", false);
    }
  });
});

app.post("/register", async (req, res) => {
  try {
    const uid = req.body.userid;
    const email = req.body.userEmail;
    const fname = req.body.userFname;
    const lname = req.body.userLname;
    const role = req.body.userRole;
    const info = [uid, role, fname, lname, email];

    const registerQuery =
      "INSERT INTO users (uid, role, fname, lname, email) VALUES ($1, $2, $3, $4, $5);";
    const result = await pool.query(registerQuery, info);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/users/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const getUserQuery = "SELECT * FROM users WHERE uid = $1;";
    const result = await pool.query(getUserQuery, [uid]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//login route
var idTok;
app.post("/login", async (req, res, next) => {
  try {
    const idToken = req.body.token.toString();
    idTok = idToken;
  } catch (err) {
    console.error(err.message);
  }
  next();
});

app.get("/logout", async (req, res, next) => {
  idTok = undefined;
  res.send("Logout Successful");
});

//verify middleware
async function verifyToken(req, res, next) {
  try {
    const decodeToken = await admin.auth().verifyIdToken(idTok);
    console.log(decodeToken);
    next();
  } catch (err) {
    res.status(401).send("You are not authorized");
  }
}

//protected  route
app.get("/protected", verifyToken, async (req, res) => {
  res.send("protected");
});

app.post("/createQuiz", async (req, res) => {
  try {
    const result = await pool.query(
      `INSERT INTO
    quizzes (tname,uid,created)
    VALUES ($1,$2,CURRENT_TIMESTAMP) RETURNING *`,
      [req.body.name, req.body.tid]
    );
    var input = [result.rows[0]["quizid"]];
    console.log("id is: " + input);
  } catch (e) {
    console.error(e);
  }
  res.json(input);
});

// Getting List of User's Created Quizzes
app.get("/getCreatedQuiz/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const getCreatedQuiz = `
      SELECT *
      FROM quizzes
      WHERE uid = $1;
    `;

    const result = await pool.query(getCreatedQuiz, [uid]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        error: "Server Error getting the list of user's created quizzes. ",
      });
  }
});

// find the quiz that match quiz id
app.get("/quizzes/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    const getQuizQuery = "SELECT * FROM quizzes WHERE quizid = $1;";
    const result = await pool.query(getQuizQuery, [quizId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Quiz not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//delete quiz by id
app.delete("/quizzes/:quizId", async (req, res) => {
  try {
    var qid = req.params.quizId;
    const deleteQuiz = await pool.query(
      "DELETE FROM quizzes WHERE quizid = $1;",
      [qid]
    );
    res.json("deleted");
    console.log(deleteQuiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cant Delete Quiz" });
  }
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(process.env.DB_USER);
});
