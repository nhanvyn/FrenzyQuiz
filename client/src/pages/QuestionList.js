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

  total = questions.length;

  console.log("size is " + total);
  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <>
      <div className="app">
        <div className="container w-75">
          <h3 className="textcenter">{params.name}</h3>
          <div className="list-group">
            {questions.map((questions, index) => (
              <div
                key={index}
                className="list-group-item list-group-item-action flex-column align-items-start"
              >
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{questions.question}</h5>
                  <div>
                    <button
                      type="button"
                      className="close"
                      aria-label="Close"
                      onClick={() => alert("not implemented")}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  name="edit"
                  className="btn btn-warning btn-sm mt-2"
                  onClick={() => alert("not implemented")}
                >
                  Edit
                </button>
              </div>
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
        </div>
      </div>
    </>
  );
}

export default QuesitonList;
