import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';
const Room = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  useEffect(() => {
    // todo: fetch quiz data from nodejs
    // GET (`quiz/${id}`)
    // setQuiz(data)
  }, [id])

  return (
    <div>
      <h3>Quiz id: {id}</h3>
      <QRCode value={`http://localhost:3000/Room/${id}`} />
      <h3>Wait for player to join...</h3>
    </div>
  );
}

export default Room;