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
    <div>
      <h1>Enter quiz access code</h1>
      <input
        type="text"
        value={quizId}
        onChange={(e) => setQuizId(e.target.value)}
        placeholder="Enter the quiz ID"
      />
      <button onClick={() => goToQuizRoom(quizId)}>Join Quiz</button>
    </div>
  );
}

export default Join;