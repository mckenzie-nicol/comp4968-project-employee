import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Admin from "./pages/admin";
import Timesheet from "./pages/timesheet";
import Project from "./pages/project";

function App() {
  return (
    <Router>
      {/* Nav Bar component goes here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/timesheet" element={<Timesheet />}></Route>
        <Route path="/project/:id/:name" element={<Project />} />
      </Routes>
    </Router>
  );
}

export default App;
