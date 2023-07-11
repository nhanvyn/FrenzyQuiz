import { useEffect, useState, createContext } from "react";
import Navbar from "./comps/Navbar";
import Home from './pages/Home';
import Join from "./pages/Join";
import QuizList from "./pages/QuizList";
import Room from "./pages/Room";
import Login from "./pages/Login"
import Register from "./pages/Register"
import StudentQuizList from "./pages/StudentQuizList";
import StudentQuizDetail from "./pages/StudentQuizDetail";
import io from "socket.io-client"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase-config'
import CreateQ from "./pages/CreateQ";

import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";


export const SocketContext = createContext();
export const UserContext = createContext({});


function App() {

  const [socket, setSocket] = useState(null)
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser)
    console.log("currentuser = ", user)
  })
 
  useEffect(() => {
    if (!socket){
      const newSocket = io.connect("http://localhost:3500")
      setSocket(newSocket)
    }
  }, [])

  return (
    <>
      <UserContext.Provider value={user}>
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
              <Route path="/Create" element={<CreateQ />} />

            </Routes>
          </div>
        </BrowserRouter>
      </SocketContext.Provider>
      </UserContext.Provider>
    </>
  );
}

export default App;
