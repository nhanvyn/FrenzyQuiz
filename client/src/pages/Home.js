import React, { useEffect, useState, useContext } from 'react';
import { SocketContext, UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

  const [currentRoom, setCurrentRoom] = useState(null)
  const socket = useContext(SocketContext)
  const user = useContext(UserContext)
  const navigate = useNavigate();

  useEffect(() => {
    if (socket && user) {
      socket.emit('find_current_room', { email: user.email });
      socket.on('current_room_found', (roomData) => {
        console.log("current room data:", roomData)
        setCurrentRoom(roomData)
      })
      return () => {
        socket.off('current_room_found')
      }
    }
  }, [socket, user])

  const Rejoin = () => {
    navigate(`/Room/${currentRoom.quiz.id}`)
  }

  const deleteRoom = () => {
    socket.emit('delete_room', { email: user.email, quizId: currentRoom.quiz.id })
    setCurrentRoom(null)
  }

  const leaveRoom = () => {
    socket.emit('leave_room', { email: user.email, quizId: currentRoom.quiz.id })
    setCurrentRoom(null)
  }

  return (
    <div className="container w-75 d-flex flex-column align-items-center justify-content-center mt-4">

      {currentRoom ? (
        <>
          <h3>Current quizz</h3>
          <div className="card" style={{ width: "18rem" }}>
            <div className="card-body">
              <h5 className="card-title">{currentRoom.quiz.name}</h5>
              <small className="mb-1">id: {currentRoom.quiz.id} </small> <br></br>
              <small>Date: {currentRoom.quiz.date}</small>
              <div className='d-flex'>
                <button type="button" name="edit" className="btn btn-success btn-sm mt-2" onClick={() => Rejoin()}>Rejoin</button>
                {currentRoom.quiz.author === user.email ? (
                  <button type="button" name="start" className="btn btn-danger btn-sm mt-2 ml-2" onClick={() => deleteRoom()}>Delete room</button>
                ): (
                    <button type = "button" name = "start" className = "btn btn-danger btn-sm mt-2 ml-2" onClick={() => leaveRoom()}>Leave</button>

                  )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <h3>Current room will display here if you join a quiz</h3>
      )}



    </div>

  );
}

export default HomePage;