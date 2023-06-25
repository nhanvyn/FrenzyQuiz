import Navbar from "./comps/Navbar";
import Home from './pages/Home';
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
            {/* <Route path="/Login" element={<Login />} /> */}
            {/* <Route path="/Register" element={<Register />} /> */}

          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
