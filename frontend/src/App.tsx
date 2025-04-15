import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./index.css";
import Create from "./pages/create/Create";
import Game from "./pages/game/Game";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import TestUpload from "./pages/testupload/TestUpload";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/signin" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<Create />} />
        <Route path="/test" element={<TestUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
