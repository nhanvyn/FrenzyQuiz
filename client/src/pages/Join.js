import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../App';
const Join = () => {
  const navigate = useNavigate();
  const [quizId, setQuizId] = useState('');
  const socket = useContext(SocketContext)



  const goToQuizRoom = (quizId) => {

    // todo: check if the id exist
    navigate(`/Room/${quizId}`)
  };
  return (
    <div className="container w-75 d-flex align-items-center justify-content-center">
      <div className="d-flex flex-column align-items-center">
        <h1>Enter quiz access code</h1>
        <div>
          <input
            type="text"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
            placeholder="Enter the quiz ID"
          />
          <button onClick={() => goToQuizRoom(quizId)}>Join Quiz</button>
        </div>
      </div>
    </div>
  );
}

export default Join;