// src/components/dashboard/dashboard-page.tsx
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
import moment from "moment";

// ---- Import your local mock data
import { mockProjects } from "@/mockData/projects";
import { mockTimeRecords } from "@/mockData/time_record";
import { mockTimesheets } from "@/mockData/timesheets";

// ----------------------------------
// Types
// ----------------------------------
export interface TimeRecord {
  id: string;
  timesheet_id: string;
  date: string;
  day: string;
  start_time: string;
  end_time: string;
}

export interface Timesheet {
  timesheet_id: string;
  submission_date: string;
  status: string;
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
    [projectId: string]: number;
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

// ----------------------------------
// Local-Only Data Builder
// ----------------------------------
/**
 * Build an ApiResponse object from local mock data.
 * If `workerId` is provided, we only include timesheets
 * where timesheet.employee_id === workerId.
 */
const buildLocalApiResponse = (workerId?: string): ApiResponse => {
  // Convert our local mock data into the shape: { projects: ProjectData[] }
  const localProjects: ProjectData[] = mockProjects.map((proj) => {
    // Gather timesheets for this project
    const theseTimesheets = mockTimesheets
      .filter((ts: { project_id: string; employee_id: string; }) => {
        // Must match the project ID
        const belongsToProject = ts.project_id === proj.id;
        // If workerId is given, also ensure timesheet's employee_id matches
        const belongsToWorker = workerId ? ts.employee_id === workerId : true;
        return belongsToProject && belongsToWorker;
      })
      .map((ts: { id: string; submission_date: any; status: any; }) => ({
        timesheet_id: ts.id,
        submission_date: ts.submission_date,
        status: ts.status ?? "pending",
        // Now gather all time records for this timesheet
        time_records: mockTimeRecords
          .filter((tr) => tr.timesheet_id === ts.id)
          .map((tr) => ({
            id: tr.id,
            timesheet_id: tr.timesheet_id,
            date: tr.date,
            day: tr.day,
            start_time: tr.start_time ?? "",
            end_time: tr.end_time ?? "",
          })),
      }));

    return {
      project_id: proj.id,
      project_name: proj.name,
      timesheets: theseTimesheets,
    };
  });

  return { projects: localProjects };
};

// Instead of fetching from an API, let's just return local data
// filtered by the current user (worker) if needed.
const getAllTimesheetsByWorkerId = async (
  workerId?: string
): Promise<ApiResponse> => {
  return buildLocalApiResponse(workerId);
};

// ----------------------------------
// Props & Component
// ----------------------------------
interface DashboardPageProps {
  onSignOut?: () => void;
  userRole?: "worker" | "project_manager";
}

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

  // We'll keep a ref for the selected date in a notification
  const notificationDate = useRef<Date | null>(null);

  // For demonstration, let's say this "charlie@company.com" is the worker
  // to show timesheets. If user is PM, we won't filter by worker.
  const workerId = userRole === "worker" ? "charlie@company.com" : undefined;

  // -- Data extraction (like your old code)
  const extractData = (apiResponse: ApiResponse): ExtractedData => {
    const { projects } = apiResponse;
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
    const hoursMap: HoursBreakdown = {};
    const activeProjectsSet = new Set<string>();
    const projectMap: Record<string, ProjectDetails> = {};

    // Colors for charts
    const colorPalette = [
      "var(--custom-red)",
      "var(--custom-blue)",
      "var(--custom-yellow)",
      "var(--custom-green)",
      "var(--custom-purple)",
    ];
    let colorIndex = 0;

    projects.forEach((proj) => {
      activeProjectsSet.add(proj.project_id);

      if (!projectMap[proj.project_id]) {
        projectMap[proj.project_id] = {
          projectId: proj.project_id,
          projectName: proj.project_name,
          color: colorPalette[colorIndex % colorPalette.length],
        };
        colorIndex++;
      }

      proj.timesheets.forEach((ts) => {
        ts.time_records.forEach((record) => {
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
            if (!hoursMap[date]) {
              hoursMap[date] = {};
            }
            if (!hoursMap[date][proj.project_id]) {
              hoursMap[date][proj.project_id] = 0;
            }
            hoursMap[date][proj.project_id] += duration;
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

    const hoursDiff = totalHoursLast14Days - totalHoursPrevious14Days;

    return {
      totalHoursLast14Days,
      hoursDifference: hoursDiff,
      activeProjectsCount: activeProjectsSet.size,
      hoursBreakdown: hoursMap,
      projects: Object.values(projectMap),
    };
  };

  // -- Worker-only data load
  const processData = async () => {
    const data = await getAllTimesheetsByWorkerId(workerId);
    const extractedData = extractData(data);

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
  }, [showTimesheetForm, userRole]);

  // -- Notification navigation
  const navigateToTimesheets = (startDate: Date) => {
    notificationDate.current = startDate;
    setShowTimesheetForm(true);
  };

  // -- Timesheet creation form toggle
  if (showTimesheetForm) {
    return (
      <div className="pt-6 mb-80">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="secondary"
            onClick={() => setShowTimesheetForm(false)}
          >
            Back to Dashboard
          </Button>
        </div>
        {/* 
          TimesheetTable is your local form. 
          Pass in worker's "email" if needed, plus the date ref 
        */}
        <TimesheetTable
          employee_id={workerId || ""}
          notificationDate={notificationDate}
        />
      </div>
    );
  }

  // -- Main Render
  return (
    <div className="pt-6 space-y-6">
      {/* If your UserNotification tries to fetch from an API, adapt it similarly to local data. */}
      <UserNotification navigateToTimesheets={navigateToTimesheets} />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          {userRole === "worker" && (
            <Button
              className="bg-primary"
              onClick={() => setShowTimesheetForm(true)}
            >
              New Timesheet
            </Button>
          )}

          {userRole === "project_manager" && (
            <div className="flex gap-2">
              <Button
                variant={activeView === "overview" ? "default" : "outline"}
                onClick={() => setActiveView("overview")}
              >
                Overview
              </Button>
              <Button
                variant={activeView === "reports" ? "default" : "outline"}
                onClick={() => setActiveView("reports")}
              >
                Reports
              </Button>
              <Button
                variant={activeView === "allocation" ? "default" : "outline"}
                onClick={() => setActiveView("allocation")}
              >
                Project Allocation
              </Button>
              <CreateProject />
              <Button
                onClick={() => (window.location.href = "/approve-timesheets")}
                className="bg-custom-green"
              >
                Approve Timesheets
              </Button>
            </div>
          )}
        </div>

        <Button variant="outline" onClick={onSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>

      {userRole === "worker" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Hours Last 14 Days
                </CardTitle>
                <Clock className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hoursLast14Days}</div>
                <p className="text-xs text-gray-500">
                  {hoursDifference > 0 ? "+" : ""}
                  {hoursDifference} from previous 14 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Projects
                </CardTitle>
                <PieChart className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeProjects}</div>
                <p className="text-xs text-gray-500">Currently assigned</p>
              </CardContent>
            </Card>
          </div>

          {/* If you have a chart for the worker’s project hours over 14 days */}
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
                {/* Project listing + selection */}
                <ProjectsList
                  onProjectSelect={setSelectedProject}
                  selectedProjectId={selectedProject?.id ?? null}
                />

                {/* Chart for selected project */}
                <BurnDownChart project={selectedProject} />
              </div>
              {/* Possibly a “RecentTimesheets” for PM? */}
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
