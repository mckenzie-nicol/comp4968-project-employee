import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import { Navbar } from './components/layout/navbar';
import { Footer } from './components/layout/footer';
import { ApproveTimesheets } from "@/components/dashboard/approve-timesheets";
import Timesheet from "./pages/timesheet";
import Test from "./pages/test";
function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* timesheet route */}
            <Route path="/timesheet" element={<Timesheet />} />
            <Route path="/approve-timesheets" element={<ApproveTimesheets />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
