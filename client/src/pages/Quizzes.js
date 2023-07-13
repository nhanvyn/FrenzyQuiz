import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

function Quizzes() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  console.log(user);

  const handleSubmit = async (event) => {
    event.preventDefault();
    var target = event.target;
    var input = {
      name: target.name.value,
      tid: user.uid,
    };
    var data = JSON.stringify(input);
    try {
      await fetch("http://35.193.138.187:3500/createQuiz", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: data,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => navigate("/Quiz/" + data))
        .then(console.log("quiz made"));
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <h1>Make A Quiz</h1>
      <p>{ }</p>
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
