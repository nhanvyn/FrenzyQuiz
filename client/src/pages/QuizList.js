import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext, UserContext } from '../App';


const QuizList = () => {
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const { user } = useContext(UserContext);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    // need to retrieve all quizzes here 
    const fetchQuizzes = async () => {
      try {
        const responsee = await fetch(`/getCreatedQuiz/${user.uid}`);
        const data = await responsee.json();
        console.log('Fetched quizzes:', data);
        setQuizzes(data);
      } catch  (err) { 
        console.error(err);
      }
    };

    if (socket && user) {
      fetchQuizzes();
    }
  }, [socket, user])

  const startQuiz = (quizId) => {
    // todo: 
    // create a quiz room on server

    navigate(`/Room/${quizId}`)
  };
  return (
    <div className='app'>
      <div className="container w-75">
        <h3 className='textcenter'>Created Quizzes:</h3>
        <div className="list-group">
          {
            quizzes.map((quiz, index) => (
              <div key={index} className="list-group-item list-group-item-action flex-column align-items-start">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{quiz.tname}</h5>
                  <div>
                    <button type="button" className="close" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                </div>
                <small>Created date: {new Date(quiz.created).toISOString().split('T')[0]}</small>
                <p className="mb-1">CMPT372 quiz</p>
                <button type="button" name="edit" className="btn btn-warning btn-sm mt-2" onClick={() => alert("Not impletented yet")}>Edit</button>
                <button type="button" name="start" className="btn btn-primary btn-sm mt-2 ml-2" onClick={() => startQuiz(quiz.quizid)}>Start</button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default QuizList;