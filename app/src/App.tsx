import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Admin from "./pages/admin";
import Timesheet from "./pages/timesheet";


function App() {
  return (
    <Router>
      {/* Nav Bar component goes here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/timesheet" element={<Timesheet/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;