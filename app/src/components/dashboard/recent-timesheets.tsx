import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";


export function RecentTimesheets() {
  const [hasNotifications, setHasNotifications] = useState(true);
  const navigate = useNavigate();

  const handleApproveClick = () => {
    navigate("/approve-timesheets");
  };

  const bellIconStyle = hasNotifications
    ? "text-red-500"
    : "text-red-500";

  const timesheets = [
    {
      id: 1,
      date: "Nov 27 - Dec 3",
      status: "Approved",
      hours: 40,
      projects: ["Website Redesign", "Mobile App"],
    },
    {
      id: 2,
      date: "Nov 20 - Nov 26",
      status: "Approved",
      hours: 38.5,
      projects: ["Database Migration", "Website Redesign"],
    },
    {
      id: 3,
      date: "Nov 13 - Nov 19",
      status: "Approved",
      hours: 42,
      projects: ["Mobile App", "Database Migration"],
    },
  ]

  return (
    <Card className="bg-white/10 border-4">
      <CardHeader>
        <div className="flex justify-between items-center">
        <CardTitle className="text-xl font-semibold text-gradient">
          Recent Timesheets
        </CardTitle>
          <button
            onClick={handleApproveClick}
            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition"
          >
            <Bell className={`h-6 w-6 ${bellIconStyle}`} />
            <span>Approve Timesheets</span>
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timesheets.map((timesheet) => (
            <div
              key={timesheet.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div>
                <h3 className="font-medium text-gray-800">{timesheet.date}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {timesheet.projects.map((project) => (
                    <span
                      key={project}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {project}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600">
                  {timesheet.hours} hours
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    timesheet.status === "Approved"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {timesheet.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
    </Card>
  )
}