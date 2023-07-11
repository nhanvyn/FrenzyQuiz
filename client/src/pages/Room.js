import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { SocketContext, UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

const Room = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [players, setPlayers] = useState([])
  const socket = useContext(SocketContext)
  const user = useContext(UserContext)

  // this hook is for fetching quiz information
  useEffect(() => {
    // todo: fetch quiz data from nodejs
    // GET (`quiz/${id}`)
    // setQuiz(data)
  }, [id])


  useEffect(() => {
    if (socket){
      const user_email = user? user.email : "Anonymous"

      socket.emit("join_room", { quizId: id, email: user_email })
      

    }
  
  }, [socket, id, user]);




  useEffect(() => {
    if (socket) {
      console.log("socketID: ", socket.id)
  
      const handleDisplayPlayer = (data) => {
        console.log("display player:", data);
        setPlayers(data)
      };

      const handleUpdateQuiz = (data) => {
        console.log("display quiz:", data)
        setQuiz(data)
      }

      const handleRoomDeleted = (data) => {
        console.log("this room is deleted")
        navigate(`/`)


      }

      socket.on("display_new_player", handleDisplayPlayer);

      socket.on("update_quiz", handleUpdateQuiz);

      socket.on("room_deleted", handleRoomDeleted);


      return () => {
        socket.off("display_new_player", handleDisplayPlayer);
        socket.off("update_quiz", handleUpdateQuiz);
        socket.off('room_deleted');
        console.log("Called")
      };
    }
  }, [socket, id]);


  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-6 col-md-12">
          <h3> {"Quiz id:" + quiz?.id + " - " + " question: " + quiz?.question}</h3>
          <QRCode value={`http://localhost:3000/Room/${id}`} size={256*2} />
        </div>

        <div className="col-lg-6 col-md-12">
          <h3>Wait for player to join...</h3>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{"user: " + player.email + " - socket id: " + player.connect_id}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Room;