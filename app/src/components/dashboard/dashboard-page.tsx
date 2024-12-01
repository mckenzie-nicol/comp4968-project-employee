import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, PieChart, LogOut } from "lucide-react";
import { ProjectsList, type Project } from "./projects-list";
import { RecentTimesheets } from "./recent-timesheets";
import { TimesheetTable } from "../timesheet/timesheet-form";
import { BurnDownChart } from "./burn-down-chart";
import { ProjectReports } from "./project-reports";
import { EmployeeProjectHours } from "./employee-project-hours";
import { ProjectAllocation } from "./project-allocation";
import { UserNotification } from "@/components/dashboard/user-notification";
import CreateProject from "@/components/project/create-project";
import refreshTokens from "@/actions/refresh-token";
import moment from "moment";

interface DashboardPageProps {
  onSignOut?: () => void;
  userRole?: "worker" | "project_manager";
}

export interface TimeRecord {
  id: string;
  timesheet_id: string;
  date: string; // ISO string, e.g., "2024-11-25T00:00:00.000Z"
  day: string; // e.g., "Monday"
  start_time: string; // Time string, e.g., "08:00"
  end_time: string; // Time string, e.g., "17:00"
}

export interface Timesheet {
  timesheet_id: string;
  submission_date: string; // ISO string, e.g., "2024-11-30T00:00:00.000Z"
  status: string; // Example: 'approved'
  time_records: TimeRecord[];
}

export interface ProjectData {
  project_id: string;
  project_name: string;
  timesheets: Timesheet[];
}

export interface ApiResponse {
  projects: ProjectData[];
}

export interface HoursBreakdown {
  [day: string]: {
    [projectId: string]: number; // Hours worked
  };
}

export interface ProjectDetails {
  projectId: string;
  projectName: string;
  color: string;
}

export interface ExtractedData {
  totalHoursLast14Days: number;
  hoursDifference: number;
  activeProjectsCount: number;
  hoursBreakdown: HoursBreakdown;
  projects: ProjectDetails[];
}

const getAllTimesheetsByWorkerId = async () => {
  const tokenExpiry = parseInt(sessionStorage.getItem("tokenExpiry") || "0");
  if (Date.now() > tokenExpiry) {
    await refreshTokens();
  }
  const workerId = sessionStorage.getItem("userId");
  const accessToken = sessionStorage.getItem("accessToken") || "";
  const response = await fetch(
    `https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/dashboard/worker?worker_id=${workerId}`,
    {
      method: "GET",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data;
};

export function DashboardPage({
  onSignOut,
  userRole = "project_manager",
}: DashboardPageProps) {
  const [showTimesheetForm, setShowTimesheetForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeView, setActiveView] = useState<
    "overview" | "allocation" | "reports"
  >("overview");
  const [activeProjects, setActiveProjects] = useState<number>(0);
  const [hoursBreakdown, setHoursBreakdown] = useState<HoursBreakdown>({});
  const [projectDetails, setProjectDetails] = useState<ProjectDetails[]>([]);
  const [hoursLast14Days, setHoursLast14Days] = useState<number>(0);
  const [hoursDifference, setHoursDifference] = useState<number>(0);
  const notificationDate = useRef<Date | null>(null)

  const userId =
    sessionStorage.getItem("userId") ?? "5131efb8-4579-492d-97fd-49602e6ed513";

  const extractData = (apiResponse: ApiResponse): ExtractedData => {
    const projects = apiResponse.projects;

    // Use the actual current date
    const currentDate = moment.utc().endOf("day");

    const last14DaysStart = currentDate
      .clone()
      .subtract(13, "days")
      .startOf("day");
    const last14DaysEnd = currentDate;

    const previous14DaysStart = last14DaysStart
      .clone()
      .subtract(14, "days")
      .startOf("day");
    const previous14DaysEnd = last14DaysStart
      .clone()
      .subtract(1, "days")
      .endOf("day");

    let totalHoursLast14Days = 0;
    let totalHoursPrevious14Days = 0;
    const hoursBreakdown: HoursBreakdown = {}; // { day: { projectId: hours } }
    const activeProjectsSet = new Set<string>();
    const projectDetailsMap: { [projectId: string]: ProjectDetails } = {};

    // Predefined colors for projects
    const colorPalette = [
      "#FF5733",
      "#33FF57",
      "#3357FF",
      "#F333FF",
      "#FF33A1",
    ];
    let colorIndex = 0;

    projects.forEach((project) => {
      activeProjectsSet.add(project.project_id);

      // Add project details
      if (!projectDetailsMap[project.project_id]) {
        projectDetailsMap[project.project_id] = {
          projectId: project.project_id,
          projectName: project.project_name,
          color: colorPalette[colorIndex % colorPalette.length],
        };
        colorIndex++;
      }

      project.timesheets.forEach((timesheet) => {
        timesheet.time_records.forEach((record) => {
          // Use UTC to parse dates and times
          const date = moment.utc(record.date).format("YYYY-MM-DD");
          const startTime = moment.utc(
            `${date} ${record.start_time}`,
            "YYYY-MM-DD HH:mm"
          );
          const endTime = moment.utc(
            `${date} ${record.end_time}`,
            "YYYY-MM-DD HH:mm"
          );
          const duration = moment.duration(endTime.diff(startTime)).asHours();

          if (
            startTime.isBetween(last14DaysStart, last14DaysEnd, "seconds", "[]")
          ) {
            totalHoursLast14Days += duration;

            // Breakdown by day and project
            const day = startTime.format("YYYY-MM-DD");
            if (!hoursBreakdown[day]) {
              hoursBreakdown[day] = {};
            }
            if (!hoursBreakdown[day][project.project_id]) {
              hoursBreakdown[day][project.project_id] = 0;
            }
            hoursBreakdown[day][project.project_id] += duration;
          } else if (
            startTime.isBetween(
              previous14DaysStart,
              previous14DaysEnd,
              "seconds",
              "[]"
            )
          ) {
            totalHoursPrevious14Days += duration;
          }
        });
      });
    });

    const hoursDifference = totalHoursLast14Days - totalHoursPrevious14Days;

    return {
      totalHoursLast14Days,
      hoursDifference,
      activeProjectsCount: activeProjectsSet.size,
      hoursBreakdown: hoursBreakdown,
      projects: Object.values(projectDetailsMap),
    };
  };

  const processData = async () => {
    const timesheets = await getAllTimesheetsByWorkerId();
    const extractedData = extractData(timesheets);

    setActiveProjects(extractedData.activeProjectsCount);
    setHoursBreakdown(extractedData.hoursBreakdown);
    setProjectDetails(extractedData.projects);
    setHoursLast14Days(extractedData.totalHoursLast14Days);
    setHoursDifference(extractedData.hoursDifference);
  };

  useEffect(() => {
    if (userRole === "worker") {
      processData();
    }
  }, [showTimesheetForm]);

  const navigateToTimesheets = (start_date_of_the_week: Date) => {
    notificationDate.current = start_date_of_the_week
    setShowTimesheetForm(true)
  }

  if (showTimesheetForm) {
    return (
      <div className="pt-6 mb-80">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="secondary"
            onClick={() => setShowTimesheetForm(false)}
            className="hover:bg-accent"
          >
            Back to Dashboard
          </Button>
          {/* <h1 className="text-3xl font-bold text-foreground">New Timesheet</h1> */}
        </div>
        <TimesheetTable employee_id={userId} notificationDate={notificationDate} />
      </div>
    );
  }

  return (
    <div className="pt-6 space-y-6">
      <UserNotification navigateToTimesheets={navigateToTimesheets}/>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          {userRole === "worker" && (
            <Button
              className="bg-gradient-to-r from-grey-800 via-gray-800 to-black"
              onClick={() => setShowTimesheetForm(true)}
            >
              New Timesheet
            </Button>
          )}
          {userRole === 'project_manager' && (
            <div className="flex gap-2">
              <Button
                variant={activeView === 'overview' ? 'default' : 'outline'}
                onClick={() => setActiveView('overview')}
                className={activeView === 'overview' ? 'bg-black' : 'bg-white/50'}
              >
                Overview
              </Button>
              <Button
                variant={activeView === 'reports' ? 'default' : 'outline'}
                onClick={() => setActiveView('reports')}
                className={activeView === 'reports' ? 'bg-black' : 'bg-white/50'}
              >
                Reports
              </Button>
              
              <Button
                variant={activeView === 'allocation' ? 'default' : 'outline'}
                onClick={() => setActiveView('allocation')}
                className={activeView === 'allocation' ? 'bg-black' : 'bg-white/50'}
              >
                Project Allocation
              </Button>
              <CreateProject />
              <Button
                onClick={() => window.location.href = "/approve-timesheets"}
                className="flex items-center gap-2 bg-black px-4 py-2 rounded-md hover:bg-gray-200 transition"
              >
                Approve Timesheets
              </Button>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          onClick={onSignOut}
          className="bg-white/50 hover:bg-white/80"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>

      {userRole === "worker" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ... Cards ... */}
            <Card className="bg-white/10 border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Hours Last 14 Days
                </CardTitle>
                <Clock className="h-4 w-4 text-black" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hoursLast14Days}</div>
                <p className="text-xs text-gray-500">
                  {hoursDifference > 0 ? "+" : ""}
                  {hoursDifference} from previous 14 days
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Active Projects
                </CardTitle>
                <PieChart className="h-4 w-4 text-black" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeProjects}</div>
                <p className="text-xs text-gray-500">Currently assigned</p>
              </CardContent>
            </Card>
          </div>

          <EmployeeProjectHours
            hoursBreakdown={hoursBreakdown}
            projects={projectDetails}
            />
        </div>
      ) : (
        <>
          {activeView === "overview" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProjectsList
                  onProjectSelect={setSelectedProject}
                  selectedProjectId={selectedProject?.id ?? null}
                />
                <BurnDownChart project={selectedProject} />
              </div>
              <RecentTimesheets />
            </>
          )}

          {activeView === "reports" && <ProjectReports />}

          {activeView === "allocation" && <ProjectAllocation />}
        </>
      )}
    </div>
  );
}
