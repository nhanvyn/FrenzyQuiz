const { Pool } = require("pg");
const dotenv = require("dotenv");
const express = require("express");
const axios = require("axios");
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
        status: "waiting",
        questions: [],
        currentQuestionIndex: 0,
        submissionCounts: {},
        leaderboard: {},
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

  // start the game
  async function fetchQuestions(quizId) {
    try {
      const response = await axios.get(
        `http://localhost:3500/questions/${quizId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching questions:", error.message);
      throw error;
    }
  }

  socket.on("start_quiz", async (data) => {
    console.log("start quiz receiverd");
    // init the room[data.quizid].questions with questions retrieve from db
    fetchQuestions(data.quizId)
      .then((questions) => {
        rooms[data.quizId].questions = questions.sortedQuestions;
        rooms[data.quizId].currentQuestionIndex = 0;
        // send the first question
        console.log(
          "send the first question:",
          rooms[data.quizId].questions[0]
        );
        console.log("check data.quizid:", data.quizId, typeof data.quizId);
        io.in(data.quizId).emit(
          "next_question",
          rooms[data.quizId].questions[0]
        );
      })
      .catch((error) => {
        console.log("fetch question failed, ", error);
      });
  });

  socket.on("submit", async (data) => {
    // check if all answers are submitted

    console.log("submission received: ", data);
    var index = rooms[data.quizid].currentQuestionIndex;
    var correct_answer = rooms[data.quizid].questions[index].answer;
    var correct = data.submitted === correct_answer;
    var points = correct ? rooms[data.quizid].questions[index].points : 0;
    console.log("show question detail", rooms[data.quizid].questions[index]);

    // update submission counts
    rooms[data.quizid].submissionCounts[index] =
      (rooms[data.quizid].submissionCounts[index] || 0) + 1;
    // update leaderboard

    if (!rooms[data.quizid].leaderboard[data.email]) {
      rooms[data.quizid].leaderboard[data.email] = {
        fname: data.fname,
        score: points,
      };
    } else {
      rooms[data.quizid].leaderboard[data.email].score += points;
    }

    console.log(
      "check submitCounts",
      rooms[data.quizid].submissionCounts[index],
      "check player counts",
      rooms[data.quizid].players.length - 1
    );
    if (
      rooms[data.quizid].submissionCounts[index] ===
      rooms[data.quizid].players.length - 1
    ) {
      console.log("all answers are submitted, sending leaderboard and answer");
      console.log("Show leader board", rooms[data.quizid].leaderboard);
      console.log(
        "Show score",
        rooms[data.quizid].leaderboard[data.email].score
      );
      // this is dumb stupid, you cannot get the score from email cuz the last person will override this
      io.in(data.quizid).emit("show_answer", correct_answer);
      // io.in(data.quizid).emit("crazy_test", "sup this is creazy test")
      io.in(data.quizid).emit(
        "show_leaderboard",
        rooms[data.quizid].leaderboard
      );
      // currentQuestionIndex++
    }
  });

  socket.on("next_question", (data) => {
    rooms[data.quizid].currentQuestionIndex += 1;
    var index = rooms[data.quizid].currentQuestionIndex;

    if (index < rooms[data.quizid].questions.length) {
      console.log(
        "Sending the ",
        index,
        " th question: ",
        rooms[data.quizid].questions[index]
      );
      io.in(data.quizid).emit(
        "next_question",
        rooms[data.quizid].questions[index]
      );
    } else {
      io.in(data.quizid).emit("end_quiz");
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
    // var input = [result.rows[0]["quizid"]];
    input = [result.rows[0]];

    console.log("id is: " + input);
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
        (question,answer,option1,option2,option3,option4,sec,points,type)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [
          req.body.question,
          req.body.answer,
          req.body.o1,
          req.body.o2,
          req.body.o3,
          req.body.o4,
          req.body.time,
          req.body.points,
          req.body.type,
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
        (question,answer,sec,points,type)
      VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [
          req.body.question,
          req.body.answer,
          req.body.time,
          req.body.points,
          req.body.type,
        ]
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
        (question,answer,sec,points,type)
      VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [
          req.body.question,
          req.body.answer,
          req.body.time,
          req.body.points,
          req.body.type,
        ]
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
app.post("/update", async (req, res) => {
  try {
    let update;

    if (req.body.type == "multiple") {
      const short = `UPDATE multiple SET
       question = $1, 
       answer = $2,
       option1 = $3,
       option2 = $4,
       option3 = $5,
       option4 = $6, 
       sec = $7, 
       points = $8 
       WHERE id = $9 `;
      update = await pool.query(short, [
        req.body.question,
        req.body.answer,
        req.body.o1,
        req.body.o2,
        req.body.o3,
        req.body.o4,
        req.body.time,
        req.body.points,
        req.body.quesid,
      ]);
    } else if (req.body.type == "short") {
      const short = `UPDATE short SET question = $1, answer =$2, sec = $3, points =$4 WHERE id = $5 `;
      update = await pool.query(short, [
        req.body.question,
        req.body.answer,
        req.body.time,
        req.body.points,
        req.body.quesid,
      ]);
    } else if (req.body.type == "tf") {
      console.log("update tf");
      const tf = `UPDATE tf SET question = $1, answer =$2, sec = $3, points =$4 WHERE id = $5 `;
      update = await pool.query(tf, [
        req.body.question,
        req.body.answer,
        req.body.time,
        req.body.points,
        req.body.quesid,
      ]);
    }
  } catch (e) {
    console.log(e);
  }
});

app.get("/getQuestion/:qid/:quesid/:type", async (req, res) => {
  try {
    console.log(req.params.qid);
    console.log(req.params.quesid);
    console.log(req.params.type);
    let getQ = "";
    if (req.params.type == "multiple") {
      getQ = `SELECT *
      FROM multiple
      INNER JOIN mclist
      ON multiple.id = mclist.mid
      WHERE quizid = $1 AND id = $2 ;`;
    } else if (req.params.type == "short") {
      getQ = `SELECT *
        FROM short
        INNER JOIN slist
        ON short.id = slist.sid
        WHERE quizid = $1 AND id = $2 ;`;
    } else if (req.params.type == "tf") {
      getQ = `SELECT *
        FROM tf
        INNER JOIN tflist
        ON tf.id = tflist.tfid
        WHERE quizid = $1 AND id = $2 ;`;
    }
    const qdata = await pool.query(getQ, [req.params.qid, req.params.quesid]);
    console.log(qdata.rows);
    res.json(qdata.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error getting the question ",
    });
  }
});
app.get("/getQuestions/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const getMc = `
    SELECT question, quizid , qnum, id, type
    FROM multiple
    INNER JOIN mclist
    ON multiple.id = mclist.mid
    WHERE quizid = $1;
    `;
    const getShort = `
    SELECT question, quizid , qnum, id, type
    FROM short
    INNER JOIN slist
    ON short.id = slist.sid
    WHERE quizid = $1;
    `;
    const getTF = `
    SELECT question, quizid , qnum, id, type
    FROM tf
    INNER JOIN tflist
    ON tf.id = tflist.tfid
    WHERE quizid = $1;
    `;

    const mc = await pool.query(getMc, [id]);
    const short = await pool.query(getShort, [id]);
    const tf = await pool.query(getTF, [id]);
    let total = [...mc.rows, ...short.rows, ...tf.rows];
    total.sort((a, b) => a.qnum - b.qnum);
    console.log(total);

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

//delete quiz by id
app.get("/quiz/:quidId/question/:questionNum", async (req, res) => {
  try {
    const params = req.params;
    const getMc = `
      SELECT mclist.quizid, qnum, multiple.*, quizzes.uid
      FROM multiple
      INNER JOIN mclist ON multiple.id = mclist.mid
      INNER JOIN quizzes ON mclist.quizid = quizzes.quizid 
      WHERE mclist.quizid = $1 AND qnum = $2;
    `;
    const getShort = `
      SELECT slist.quizid, qnum, short.*, quizzes.uid
      FROM short
      INNER JOIN slist ON short.id = slist.sid
      INNER JOIN quizzes ON slist.quizid = quizzes.quizid 
      WHERE slist.quizid = $1 AND qnum = $2;
    `;
    const getTF = `
      SELECT tflist.quizid, qnum, tf.*, quizzes.uid
      FROM tf
      INNER JOIN tflist ON tf.id = tflist.tfid
      INNER JOIN quizzes ON tflist.quizid = quizzes.quizid 
      WHERE tflist.quizid = $1 AND qnum = $2;
    `;

    const mcResult = await pool.query(getMc, [
      params.quidId,
      params.questionNum,
    ]);
    if (mcResult.rows.length > 0) {
      res.json(mcResult.rows[0]);
    } else {
      const shortResult = await pool.query(getShort, [
        params.quidId,
        params.questionNum,
      ]);
      if (shortResult.rows.length > 0) {
        res.json(shortResult.rows[0]);
      } else {
        const tfResult = await pool.query(getTF, [
          params.quidId,
          params.questionNum,
        ]);
        if (tfResult.rows.length > 0) {
          res.json(tfResult.rows[0]);
        }
      }
    }
    console.log(params.quidId, params.questionNum);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/quiz/:qid/question/:questionId/submitAnswer", async (req, res) => {
  try {
    var quizId = req.params.qid;
    var questionId = req.params.questionId;
    var body = req.body;

    const insertSubmittedAnswerQuery = `
      INSERT INTO submitted (questionid, qtype, correct, submitted, quizid, uid, score, points) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
    `;
    await pool.query(insertSubmittedAnswerQuery, [questionId, body.type, body.correct, body.submitted, quizId, body.uid, body.score, body.points]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error submitting answer" });
  }
});

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

// app.get("/questions/:quizid", async (req, res) => {
//   res.send("what eawad up");
// });

app.get("/questions/:quizid", async (req, res) => {
  try {
    const quizFetchQuery = `
    WITH multiple_choice AS (
      SELECT 
          mclist.quizid, 
          jsonb_agg(jsonb_build_object(
              'quizid', mclist.quizid,
              'uid', q.uid,
              'tname', q.tname,
              'created', TO_CHAR(q.created, 'YYYY-MM-DD HH24:MI:SS'),
              'type', 'multiple',
              'id', id,
              'question', question,
              'options', jsonb_build_array(option1, option2, option3, option4),
              'answer', answer,
              'sec', sec,
              'points', points,
              'qnum', mclist.qnum
          )) AS multiple
      FROM mclist JOIN multiple ON mclist.mid = multiple.id
      JOIN quizzes q ON q.quizid = mclist.quizid
      WHERE mclist.quizid = $1
      GROUP BY mclist.quizid, q.uid, q.tname, q.created
  ),
  short_answers AS (
      SELECT 
          slist.quizid, 
          jsonb_agg(jsonb_build_object(
              'quizid', slist.quizid,
              'uid', q.uid,
              'tname', q.tname,
              'created', TO_CHAR(q.created, 'YYYY-MM-DD HH24:MI:SS'),
              'type', 'short',
              'id', id,
              'question', question,
              'answer', answer,
              'sec', sec,
              'points', points,
              'qnum', slist.qnum
          )) AS short
      FROM slist JOIN short ON slist.sid = short.id
      JOIN quizzes q ON q.quizid = slist.quizid
      WHERE slist.quizid = $1
      GROUP BY slist.quizid, q.uid, q.tname, q.created
  ),
  true_false AS (
      SELECT 
          tflist.quizid, 
          jsonb_agg(jsonb_build_object(
              'quizid', tflist.quizid,
              'uid', q.uid,
              'tname', q.tname,
              'created', TO_CHAR(q.created, 'YYYY-MM-DD HH24:MI:SS'),
              'type', 'tf',
              'id', id,
              'question', question,
              'answer', answer,
              'sec', sec,
              'points', points,
              'qnum', tflist.qnum
          )) AS tf
      FROM tflist JOIN tf ON tflist.tfid = tf.id
      JOIN quizzes q ON q.quizid = tflist.quizid
      WHERE tflist.quizid = $1
      GROUP BY tflist.quizid, q.uid, q.tname, q.created
  )
  SELECT 
      q.quizid,
      q.uid,
      q.tname,
      TO_CHAR(q.created, 'YYYY-MM-DD HH24:MI:SS') AS created,
      COALESCE(m.multiple, '[]'::jsonb) AS multiple,
      COALESCE(s.short, '[]'::jsonb) AS short,
      COALESCE(t.tf, '[]'::jsonb) AS tf
  FROM quizzes q
  LEFT JOIN multiple_choice m ON m.quizid = q.quizid
  LEFT JOIN short_answers s ON s.quizid = q.quizid
  LEFT JOIN true_false t ON t.quizid = q.quizid
  WHERE q.quizid = $1;`;

    const quizResult = await pool.query(quizFetchQuery, [req.params.quizid]);
    console.log("quiz result is ", quizResult.rows[0]);
    const quizData = quizResult.rows[0];
    // Merge all question types into one array
    const allQuestions = [
      ...quizData.multiple,
      ...quizData.short,
      ...quizData.tf,
    ];
    // Sort the array by the 'qnum' field
    allQuestions.sort((a, b) => a.qnum - b.qnum);
    quizData.sortedQuestions = allQuestions;
    // res.status(200).json(quizResult.rows[0]);
    res.status(200).json(quizData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(process.env.DB_USER);
});
