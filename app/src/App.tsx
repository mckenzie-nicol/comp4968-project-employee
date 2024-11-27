import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import { Navbar } from './components/layout/navbar'
import { Footer } from './components/layout/footer'
import { ApproveTimesheets } from "@/components/dashboard/approve-timesheets";

import Timesheet from "./pages/timesheet";
import Test from "./pages/test";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* timesheet route */}
        <Route path="/timesheet" element={<Timesheet/>}></Route>
        <Route path="/approve-timesheets" element={<ApproveTimesheets />} />
        <Route path="/test" element={<Test />} />
      </Routes>
       <Footer />
    </Router>
  );
}

export default App;
