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
  let total = 0;
  let mc = [];
  let short = [];
  let tf = [];
  let mcDisp = [];
  let sDisp = [];
  let tfDisp = [];
  for (let i = 0; i < questions.length; i++) {
    if (i == 0) {
      mc = questions[0];
    }
    if (i == 1) {
      short = questions[1];
    }
    if (i == 2) {
      tf = questions[2];
    }
  }

  for (let i = 0; i < mc.length; i++) {
    mcDisp.push(mc[i]["question"]);
  }
  for (let i = 0; i < short.length; i++) {
    sDisp.push(short[i]["question"]);
  }
  for (let i = 0; i < tf.length; i++) {
    tfDisp.push(tf[i]["question"]);
  }
  total = mc.length + short.length + tf.length;

  console.log("size is " + total);
  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <>
      <h1>{params.name}</h1>
      <h2>Questions</h2>
      <div>
        <h3>MC Questions</h3>
        {mcDisp.map((q, index) => (
          <li key={index}>{q + " Question Order: " + mc[index]["qnum"]}</li>
        ))}
      </div>
      <div>
        <h3>Short Answer Questions</h3>
        {sDisp.map((q, index) => (
          <li key={index}>{q + " Question Order: " + short[index]["qnum"]}</li>
        ))}
      </div>
      <div>
        <h3>TF Questions</h3>
        {tfDisp.map((q, index) => (
          <li key={index}>{q + " Question Order: " + tf[index]["qnum"]}</li>
        ))}
      </div>
      <button>
        <NavLink
          activeclassname="active"
          className="nav-link"
          to={"/Create/" + params.id + "/" + total}
        >
          Add Question
        </NavLink>
      </button>
      <button className="btn btn-primary ">Finish Quiz</button>
    </>
  );
}

export default QuesitonList;
