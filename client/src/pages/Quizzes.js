import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Quizzes() {
  const navigate = useNavigate();
  const [quizid, setQuizId] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    var target = event.target;
    var input = {
      name: target.name.value,
    };
    var data = JSON.stringify(input);
    try {
      await fetch("/createQuiz", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: data,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => navigate("/Quiz/" + data));
    } catch (err) {
      console.error(err.message);
    }
  };

  const handle = async (e) => {
    navigate("/Quiz/1");
  };
  return (
    <>
      <h1>Quizzes</h1>
      <form method="POST" onSubmit={handleSubmit}>
        <label>Enter Name</label>
        <input type="text" id="name" name="name"></input>
        <button type="submit">Enter</button>
      </form>
      <button onClick={handle}>New Quiz</button>
    </>
  );
}

export default Quizzes;
