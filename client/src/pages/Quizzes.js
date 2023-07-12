import { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../App";

function Quizzes() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  console.log(user);
  const [quizid, setQuizId] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    var target = event.target;
    var input = {
      name: target.name.value,
      tid: user.uid,
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

  return (
    <>
      <h1>Make A Quiz</h1>
      <p>{}</p>
      {user === null && <button>Please sign in or create an account</button>}
      {user !== null && (
        <form method="POST" onSubmit={handleSubmit}>
          <label>Enter Name</label>
          <input type="text" id="name" name="name" required></input>
          <button type="submit">Enter</button>
        </form>
      )}
    </>
  );
}

export default Quizzes;
