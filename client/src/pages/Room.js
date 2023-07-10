import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { SocketContext } from '../App';

const Room = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [players, setPlayers] = useState([])
  const socket = useContext(SocketContext)


  // this hook is for fetching quiz information
  useEffect(() => {
    // todo: fetch quiz data from nodejs
    // GET (`quiz/${id}`)
    // setQuiz(data)
  }, [id])



  useEffect(() => {
    console.log("Join room called")
    socket.emit("join_room", { quizId: id, username: "someuser" })
    
    // disconnect player from the room when component is unmounted
    return () => {
      console.log("Leave room called")
      socket.emit('leave_room', { quizId: id })
    }
  }, []);


  useEffect(() => {
    if (socket) {
      console.log("socketID: ", socket.id)
      const handleDisplayPlayer = (data) => {
        console.log("display player:", data);
        setPlayers(data)
      };
      socket.on("display_new_player", handleDisplayPlayer);

      return () => {
        socket.off("display_new_player", handleDisplayPlayer);
        console.log("Called")
      };
    }
  }, [socket, id]);


  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-6 col-md-12">
          <h3>Quiz id: {id}</h3>
          <QRCode value={`http://localhost:3000/Room/${id}`} size={256*2} />
        </div>

        <div className="col-lg-6 col-md-12">
          <h3>Wait for player to join...</h3>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{"username: " + player.username + " - connect id: " + player.connect_id}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Room;