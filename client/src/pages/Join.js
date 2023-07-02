import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
const Join = () => {
  const navigate = useNavigate();
  const [quizId, setQuizId] = useState('');



  const goToQuizRoom = (quizId) => {
    console.log("Go to lobby")

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