import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { fetchNotificationData } from "@/components/dashboard/user-notification";

interface Timesheet {
  id: string;
  date: string;
  status: string;
  hours: number;
  projects: string[];
  employeeName: string;
  submission_date: string;
}

export function RecentTimesheets() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNotifications, setHasNotifications] = useState(false);
  const navigate = useNavigate();

  const API_URL = "https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com";
  const managerId = sessionStorage.getItem("userId");

  const fetchRecentTimesheets = async () => {
    console.log("Fetching recent timesheets...");
    console.log("Manager ID:", managerId);

    // const projectMapping: Record<string, string> = {
    //   "785aa885-1985-441e-8373-9cda9d617285": "Serverless Presentation",
    //   "5af6e2e7-c724-4f11-86be-a1b2b70dc52e": "COMP4968",
    // };

    // const employeeMapping: Record<string, string> = {
    //   "5131efb8-4579-492d-97fd-49602e6ed513": "John Doe",
    // };

    try {
      setLoading(true);
      const accessToken = sessionStorage.getItem("accessToken") || "";
      const response = await fetch(`${API_URL}/test/timesheet/manager/recent/${managerId}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("API Response Status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch timesheets: ${response.status}`);
      }

      const rawData = await response.json();
      console.log("Raw Timesheet Data:", rawData);

      // Parse the body and access the 'data' array
      const parsedBody = JSON.parse(rawData.body);
      const timesheetData = parsedBody.data;

      console.log("Parsed Timesheet Data:", timesheetData);

      // Transform data into the required format
      const transformedTimesheets = timesheetData.map((item: any) => ({
        id: item.id,
        date: `Week of ${new Date(item.start_date_of_the_week).toLocaleDateString()}`,
        status: item.status || "Pending",
        hours: item.hours || 40,
        projects: [item.project_name],
        employeeName: item.full_name || `Unknown Employee (${item.employee_id})`,
      }));

      console.log("Transformed Timesheets:", transformedTimesheets);
      setTimesheets(transformedTimesheets);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching timesheets:", err);
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentTimesheets();

    // Fetch notifications to determine if bell is shown
    async function fetchNotifications() {
      const notificationsData = await fetchNotificationData();
      setHasNotifications(notificationsData && notificationsData.length > 0);
    }
    fetchNotifications();
  }, []);

  const handleApproveClick = () => {
    navigate("/approve-timesheets");
  };

  const bellIconStyle = hasNotifications ? "text-red-500" : "text-gray-500";

  return (
    <Card className="bg-background dark:border-none dark:shadow-gray-950">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            Recent Timesheets
          </CardTitle>
          <Button
            onClick={handleApproveClick}
            className="flex items-center gap-2 bg-primary px-4 py-2 rounded-md hover:opacity-90"
          >
            <Bell className={`h-6 w-6 ${bellIconStyle}`} />
            <span>Approve Timesheets</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-sm text-gray-500">Loading timesheets...</p>}
        {error && <p className="text-sm text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <div className="space-y-4">
            {timesheets.map((timesheet) => (
              <div
                key={timesheet.id}
                className="flex flex-col p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-gray-300 shadow-sm dark:border-none"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium ">{timesheet.projects[0]}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      timesheet.status === "approved"
                        ? "bg-custom-green p-2 font-semibold"
                        : timesheet.status === "rejected"
                        ? "bg-custom-red p-2 font-semibold"
                        : timesheet.status === "pending"
                        ? "bg-custom-yellow p-2 font-semibold"
                        : ""
                    }`}
                  >
                    {timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {timesheet.projects.map((project) => (
                    <span
                      key={project}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-gray-800"
                    >
                      {timesheet.date}
                    </span>
                  ))}
                </div>
                <p className="text-sm dark:text-secondary mt-1">Employee: {timesheet.employeeName}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium dark:text-secondary">
                    {timesheet.hours} hours
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}