import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Analyze from "./pages/Analyze";
import History from "./pages/History";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/analyze" element={<Analyze />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
}

export default App;0