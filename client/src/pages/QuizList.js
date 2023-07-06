import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../App';


const QuizList = () => {
  const navigate = useNavigate();
  const socket = useContext(SocketContext)
  const quizzes = [
    {
      id: "123",
      name: "quiz1"
    },
    {
      id: "456",
      name: "quiz2"
    }
  ]

  const goToQuizRoom = (quizId) => {
    // todo: check if quizId exist

    navigate(`/Room/${quizId}`)
  };
  return (
    <div className='app'>
      <div className="container w-75">
        <div className="list-group">
          {
            quizzes.map((quiz, index) => (
              <div key={index} className="list-group-item list-group-item-action flex-column align-items-start">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{quiz.name}</h5>
                  <div>
                    <button type="button" className="close" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                </div>
                <small>Created date: 06-08-2023</small>
                <p className="mb-1">CMPT372 quiz</p>
                <button type="button" name="edit" className="btn btn-warning btn-sm mt-2">Edit</button>
                <button type="button" name="start" className="btn btn-primary btn-sm mt-2 ml-2" onClick={() => goToQuizRoom(quiz.id)}>Start</button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default QuizList;