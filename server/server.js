const { Pool } = require("pg");
const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
dotenv.config();

// Define allowed origins for cors
const allowedOrigins = ["http://localhost:3000", "http://35.193.138.187"];
app.use(cors({ origin: allowedOrigins }));

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/protected", (req, res) => {
  res.send("Hello!");
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

app.post("/createQuiz", async (req, res) => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS quizzes(
      quizid SERIAL PRIMARY KEY,
      uid varchar(255),
      tname varchar(255),
      created TIMESTAMP,
      FOREIGN KEY (uid) REFERENCES users(uid)
  );`);
    const result = await pool.query(
      `INSERT INTO
    quizzes (tname,uid,created)
    VALUES ($1,$2,CURRENT_TIMESTAMP) RETURNING *`,
      [req.body.name, req.body.tid]
    );
    var input = result.rows;
    console.log("id is: " + input[0]["quizid"]);
  } catch (e) {
    console.error(e);
  }
  res.json(input);
});
//adding a question
app.post("/createQuestion", async (req, res) => {
  try {
    if (req.body.type == "multiple") {
      const mc = await pool.query(
        `INSERT INTO multiple
        (question,answer,option1,option2,option3,option4,sec,points)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [
          req.body.question,
          req.body.answer,
          req.body.o1,
          req.body.o2,
          req.body.o3,
          req.body.o4,
          req.body.time,
          req.body.points,
        ]
      );
      await pool.query(
        `INSERT INTO mclist
        (quizid,mid,qnum)
      VALUES ($1,$2,$3) RETURNING *`,
        [req.body.id, mc.rows[0]["id"], req.body.qnum]
      );

      console.log("multiple");
    } else if (req.body.type == "short") {
      const short = await pool.query(
        `INSERT INTO short
        (question,answer,sec,points)
      VALUES ($1,$2,$3,$4) RETURNING *`,
        [req.body.question, req.body.answer, req.body.time, req.body.points]
      );
      await pool.query(
        `INSERT INTO slist
        (quizid,sid,qnum)
      VALUES ($1,$2,$3) RETURNING *`,
        [req.body.id, short.rows[0]["id"], req.body.qnum]
      );
      console.log("short");
    } else if (req.body.type == "tf") {
      const tf = await pool.query(
        `INSERT INTO tf
        (question,answer,sec,points)
      VALUES ($1,$2,$3,$4) RETURNING *`,
        [req.body.question, req.body.answer, req.body.time, req.body.points]
      );
      await pool.query(
        `INSERT INTO tflist
        (quizid,tfid,qnum)
      VALUES ($1,$2,$3) RETURNING *`,
        [req.body.id, tf.rows[0]["id"], req.body.qnum]
      );
      console.log("tf");
    }
  } catch (e) {
    console.log(e);
  }
});

app.get("/getQuestions/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const getMc = `
    SELECT question, quizid , qnum 
    FROM multiple
    INNER JOIN mclist
    ON multiple.id = mclist.mid
    WHERE quizid = $1;
    `;
    const getShort = `
    SELECT question, quizid , qnum 
    FROM short
    INNER JOIN slist
    ON short.id = slist.sid
    WHERE quizid = $1;
    `;
    const getTF = `
    SELECT question, quizid , qnum 
    FROM tf
    INNER JOIN tflist
    ON tf.id = tflist.tfid
    WHERE quizid = $1;
    `;

    const mc = await pool.query(getMc, [id]);
    const short = await pool.query(getShort, [id]);
    const tf = await pool.query(getTF, [id]);
    const total = [mc.rows, short.rows, tf.rows];
    console.log(total);
    console.log(mc.rows[0]);
    res.json(total);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error getting the list of user's created quizzes. ",
    });
  }
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
    res.status(500).json({
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

server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on PORT ${port}`);
});
