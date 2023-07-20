import { useEffect, useState, createContext } from "react";
import Navbar from "./comps/Navbar";
import Home from "./pages/Home";
import Join from "./pages/Join";
import QuizList from "./pages/QuizList";
import Room from "./pages/Room";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentQuizList from "./pages/StudentQuizList";
import StudentQuizDetail from "./pages/StudentQuizDetail";
import QuesitonList from "./pages/QuestionList";
import CreateQuestion from "./pages/CreateQuestion";
import Quiz from "./pages/Quiz";

import io from "socket.io-client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Quizzes from "./pages/Quizzes";
import apiUrl from "./api-config";

export const SocketContext = createContext();
export const UserContext = createContext({});

function App() {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [IsBeingRegistered, SetIsBeingRegistered] = useState(false)

  const fetchUserData = async (uid) => {
    try {
      const response = await fetch(`${apiUrl}/users/${uid}`);
      if (!response.ok) {
        console.log("User information is not yet saved in database, wait for register...")
      }
      else {
        const userData = await response.json();
        console.log("App.js: user is ", userData)
        setUser(userData);
      }
    } catch (error) {
      console.error('An error occurred while fetching the user data:', error);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
      }
    });

    if (!socket) {
      const newSocket = io.connect(apiUrl);
      setSocket(newSocket);
    }
  }, [socket]);
  return (
    <>
      <UserContext.Provider value={{ user, setUser, fetchUserData, IsBeingRegistered, SetIsBeingRegistered }}>
        <SocketContext.Provider value={socket}>
          <BrowserRouter>
            <div className="App">
              <Navbar />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Join" element={<Join />} />
                <Route path="/QuizList" element={<QuizList />} />
                <Route path="/Room/:id" element={<Room />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/StudentQuizList" element={<StudentQuizList />} />
                <Route path="/StudentQuizDetail/:id" element={<StudentQuizDetail />} />
                <Route path="/Quiz/:id/:name" element={<QuesitonList />} />
                <Route path="/Create/:id/:qnum" element={<CreateQuestion />} />
                <Route path="/Quizzes" element={<Quizzes />} />
                <Route path="/Quiz/:id/Question/:num" element={<Quiz />} />
              </Routes>
            </div>
          </BrowserRouter>
        </SocketContext.Provider>
      </UserContext.Provider>
    </>
  );
}

export default App;
