import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useParams } from "react-router";
import apiUrl from "../api-config";

function QuesitonList() {
  const [questions, setQuestion] = useState([]);

  const params = useParams();

  const fetchQuestions = async () => {
    try {
      const responsee = await fetch(`${apiUrl}/getQuestions/${params.id}`);
      const data = await responsee.json();
      console.log("Fetched questions:", data);
      setQuestion(data);
    } catch (err) {
      console.error(err);
    }
  };
  let mc = [];
  for (let i = 0; i < questions.length; i++) {
    mc.push(questions[i].question);
  }
  console.log(mc);
  useEffect(() => {
    fetchQuestions();
  }, []);
  //console.log(questions);

  return (
    <>
      <h1>NOT YET IMPLEMENTED</h1>
      <h2>Questions</h2>
      <div>
        <h3>MC Questions</h3>
        {mc.map((q, index) => (
          <li key={index}>{q}</li>
        ))}
      </div>
      <button>
        <NavLink
          activeclassname="active"
          className="nav-link"
          to={"/Create/" + params.id}
        >
          Add Question
        </NavLink>
      </button>
      <button className="btn btn-primary ">Finish Quiz</button>
    </>
  );
}

export default QuesitonList;
