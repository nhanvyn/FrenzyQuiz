import React from "react";
import { Link, NavLink } from "react-router-dom";

var qList = [
  {
    qid: 1,
    type: "short",
    question: "What is nodeJS used for?",
    answer: "to create server-side web applications",
    time: 30,
    points: 100,
  },
  {
    qid: 2,
    type: "multiple",
    question: " 2+2",
    o1: "1",
    o2: "2",
    o3: "3",
    o4: "4",
    answer: "4",
    time: 30,
    points: 100,
  },
];

function QuesitonList() {
  let questions = [];
  for (let i = 0; i < qList.length; i++) {
    questions.push(qList[i].question);
  }
  console.log(qList);
  return (
    <>
      <h2>Quizzes</h2>
      <ul>
        {questions.map((temp, index) => (
          <li key={index} className="d-flex ">
            {temp}
          </li>
        ))}
      </ul>

      <button>
        <NavLink activeclassname="active" className="nav-link" to="/Create">
          Add Question
        </NavLink>
      </button>
      <button className="btn btn-primary ">Finish Quiz</button>

      <button className="btn btn-danger ">CANCEL</button>
    </>
  );
}

export default QuesitonList;
