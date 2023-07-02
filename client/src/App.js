import Navbar from "./comps/Navbar";
import Home from './pages/Home';
import Join from "./pages/Join";
import QuizList from "./pages/QuizList";
import Room from "./pages/Room";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>

        <div className="App">
          <Navbar />

          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/Join" element={<Join />} />
            <Route path="/QuizList" element={<QuizList/>} />
            <Route path="/Room/:id" element={<Room />} />


            {/* <Route path="/Login" element={<Login />} /> */}
            {/* <Route path="/Register" element={<Register />} /> */}

          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
