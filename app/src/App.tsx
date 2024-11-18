import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Admin from "./pages/admin";
import { Navbar } from './components/layout/navbar'
import { Footer } from './components/layout/footer'

import Timesheet from "./pages/timesheet";
import Project from "./pages/project";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        {/* timesheet route */}
        <Route path="/timesheet" element={<Timesheet/>}></Route>
        {/* manager project route */}
        <Route path="/project/:id" element={<Project />} />
      </Routes>
       <Footer />
    </Router>
  );
}

export default App;
