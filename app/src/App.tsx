import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./providers/theme-provider";
import Home from "./pages/home";
import { Navbar } from './components/layout/navbar';
import { Footer } from './components/layout/footer';
import { ApproveTimesheets } from "@/components/dashboard/approve-timesheets";
import Timesheet from "./pages/timesheet";
import Test from "./pages/test";
function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar />
  
        {/* Main Content */}
        <div className="flex-grow container h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
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
    </ThemeProvider>
  );
}

export default App;
