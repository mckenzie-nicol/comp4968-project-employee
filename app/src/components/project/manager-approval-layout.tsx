import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  addDays,
  format,
  isBefore,
  parseISO,
  differenceInMinutes,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EmployeeHoursTable } from "./employee-hours-table";
import { ApprovalTable } from "./approval-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import refreshTokens from "@/actions/refresh-token";

const API_URL = "https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com";

const days: (keyof DayHours)[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-[500px]">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
    </div>
  );
};

const fetchProjectDetails = async (pid: string) => {
  const tokenExpiry = parseInt(sessionStorage.getItem("tokenExpiry") || "0");
  if (Date.now() > tokenExpiry) {
    await refreshTokens();
  }
  const accessToken = sessionStorage.getItem("accessToken") || "";
  try {
    const response = await fetch(`${API_URL}/test/project/manager/${pid}`, {
      method: "GET",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

const fetchTimesheetData = async (pid: string, currentWeekStart: Date) => {
  const tokenExpiry = parseInt(sessionStorage.getItem("tokenExpiry") || "0");
  if (Date.now() > tokenExpiry) {
    await refreshTokens();
  }
  const accessToken = sessionStorage.getItem("accessToken") || "";
  try {
    const response = await fetch(
      `${API_URL}/test/timesheet/manager/${pid}?start_date=${format(
        currentWeekStart,
        "yyyy-MM-dd"
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// TODO: change lambda to throw error
const fetchTimeRecordData = async (
  timesheetsData: Record<string, unknown>[]
) => {
  const tokenExpiry = parseInt(sessionStorage.getItem("tokenExpiry") || "0");
  if (Date.now() > tokenExpiry) {
    await refreshTokens();
  }
  const accessToken = sessionStorage.getItem("accessToken") || "";
  const promisesArray = await Promise.allSettled(
    timesheetsData.map(async (timesheetData: Record<string, unknown>) => {
      const response = await fetch(
        `${API_URL}/test/timesheet/timerecord?timesheet_id=${timesheetData.id}`,
        {
          method: "GET",
          headers: {
            Authorization: accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return {
        ...timesheetData,
        time_records: Array.isArray(data) ? data : [],
      };
    })
  );
  const timesheetAndRecordsData = promisesArray
    .filter((promise) => promise.status === "fulfilled")
    .map((promise) => promise.value);
  return timesheetAndRecordsData;
};

const fetchTrackedHoursData = async (
  timesheetAndRecordsData: Record<string, unknown>[]
) => {
  const tokenExpiry = parseInt(sessionStorage.getItem("tokenExpiry") || "0");
  if (Date.now() > tokenExpiry) {
    await refreshTokens();
  }
  const accessToken = sessionStorage.getItem("accessToken") || "";
  const promisesArray = await Promise.allSettled(
    timesheetAndRecordsData.map(
      async (timesheetAndRecord: Record<string, unknown>) => {
        const response = await fetch(
          `${API_URL}/test/timesheet/timerecord/manager/${timesheetAndRecord.employee_id}?pid=${timesheetAndRecord.project_id}`,
          {
            method: "GET",
            headers: {
              Authorization: accessToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
      }
    )
  );
  const hoursData = promisesArray.map((promise) => {
    if (promise.status === "fulfilled") {
      return promise.value;
    } else {
      return null;
    }
  });
  return hoursData;
};

const transformTimesheet = (data: Record<string, any>): Timesheet => {
  const startDate = parseISO(data.start_date_of_the_week);

  // Calculate hours based on time records
  data.hours = data.time_records.reduce(
    (acc: DayHours, record: TimeRecord) => {
      const start = new Date(`2024-01-01T${record.start_time}:00`);
      const end = new Date(`2024-01-01T${record.end_time}:00`);
      const diffHours = differenceInMinutes(end, start) / 60;
      acc[record.day] = diffHours.toFixed(2);
      return acc;
    },
    { Monday: "", Tuesday: "", Wednesday: "", Thursday: "", Friday: "" }
  );

  return {
    id: data.id,
    project_name: data.project_name,
    project_id: data.project_id,
    employee_id: data.employee_id,
    start_date_of_the_week: data.start_date_of_the_week,
    submission_date: data.submission_date,
    first_name: data.first_name,
    last_name: data.last_name,
    status: data.status,
    // approved: data.approved,
    // approved_by: data.approved_by ?? "",
    approved_date: data.approved_date ?? "",
    hours: data.hours
      ? data.hours
      : { Monday: "", Tuesday: "", Wednesday: "", Thursday: "", Friday: "" },
    time_records: data.time_records
      ? data.time_records.map((record: any) => ({
          ...record,
          date:
            record.date ||
            format(addDays(startDate, days.indexOf(record.day)), "yyyy-MM-dd"),
        }))
      : [],
  };
};

export type DayHours = {
  [key in "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"]: string;
};

export type HoursRecord = {
  start_time: string;
  end_time: string;
};

export interface TimeRecord {
  id?: string;
  timesheet_id: string;
  day: keyof DayHours;
  date: string;
  start_time: string;
  end_time: string;
}

export type ApprovedStatus = "approved" | "rejected" | "pending" | null;

export type Timesheet = {
  id: string;
  project_id: string;
  project_name: string;
  employee_id: string;
  start_date_of_the_week: string;
  submission_date: string;
  hours: DayHours;
  status: ApprovedStatus;
  // approved: boolean;
  // approved_by: string;
  approved_date: string;
  first_name: string;
  last_name: string;
  time_records: TimeRecord[];
};

type Project = {
  id: string;
  name: string;
  project_manager_id: string;
  start_date: string | null;
  estimated_hours: number;
  end_date: string | null;
};

type ManagerApprovalLayoutProps = {
  pid: string;
  notificationDate: Date | null;
};

function ManagerApprovalLayout({
  pid,
  notificationDate,
}: ManagerApprovalLayoutProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [projectDetails, setProjectDetails] = useState<Project | null>(null);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [trackedHours, setTrackedHours] = useState<(HoursRecord[] | null)[]>(
    []
  );
  const [refetch, setRefetch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const notificationDateRef = useRef<Date | null>(notificationDate);

  /* Week selector functions and constants */
  const today = new Date();
  const currentWeek = startOfWeek(today, { weekStartsOn: 1 });

  const handlePreviousWeek = () => {
    setCurrentWeekStart((prevWeekStart) => addWeeks(prevWeekStart, -1));
  };

  const handleNextWeek = () => {
    const nextWeek = addWeeks(currentWeekStart, 1);
    if (isBefore(nextWeek, addWeeks(currentWeek, 1))) {
      setCurrentWeekStart(nextWeek);
    }
  };

  const formatDateRange = (start: Date): string => {
    const end = endOfWeek(start, { weekStartsOn: 1 });
    return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  };

  const isCurrentWeek = isBefore(currentWeekStart, addWeeks(currentWeek, 1));

  // Refetch data when approval status or timesheet records are updated
  const refetchData = () => {
    setRefetch((prev) => !prev);
  };

  useEffect(() => {
    if (notificationDateRef.current) {
      setCurrentWeekStart(notificationDateRef.current);
    }
  }, []);

  // Fetch timesheet and records data of all employees for the current week
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const timesheetsData = await fetchTimesheetData(
        pid,
        notificationDateRef.current ?? currentWeekStart
      );
      const timesheetAndRecordsData = await fetchTimeRecordData(timesheetsData);
      const hoursData = await fetchTrackedHoursData(timesheetAndRecordsData);
      setTrackedHours(hoursData);
      setTimesheets(timesheetAndRecordsData.map(transformTimesheet));
      setIsLoading(false);

      if (notificationDateRef.current === currentWeekStart) {
        notificationDateRef.current = null;
        window.history.replaceState(null, "", "/approve-timesheets");
      }
    };

    fetchData();
  }, [currentWeekStart, pid, refetch]);

  // Fetch project details
  useEffect(() => {
    const fetchProjectDetailsData = async () => {
      const details = await fetchProjectDetails(pid);
      setProjectDetails(details);
    };

    fetchProjectDetailsData();
  }, [pid]);

  console.log(timesheets);

  return (
    <div className="space-y-4 rounded-lg shadow-md p-6 bg-background">
      <div className="flex justify-between mb-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{projectDetails?.name ?? ""}</h1>
          {projectDetails && (
            <p className="text-md">{`Start Date: ${
              projectDetails.start_date ?? "N/A"
            }, End Date: ${
              projectDetails.end_date ?? "N/A"
            }, Estimated Hours: ${projectDetails.estimated_hours} Hours`}</p>
          )}
        </div>

        {/* Week selector */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousWeek}
            disabled={isLoading}
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {formatDateRange(currentWeekStart)}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextWeek}
            disabled={!isCurrentWeek || isLoading}
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="timesheets" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="timesheets" className="hover:bg-accent w-1/2">
            Timesheets
          </TabsTrigger>
          <TabsTrigger value="approval" className="hover:bg-accent w-1/2">
            Approval
          </TabsTrigger>
        </TabsList>
        <TabsContent value="timesheets">
          {isLoading && <Loading />}
          {/* Employee timesheet hours table */}
          {!isLoading && (
            <EmployeeHoursTable
              timesheets={timesheets}
              refetchData={refetchData}
            />
          )}
        </TabsContent>
        <TabsContent value="approval">
          {isLoading && <Loading />}
          {/* Approval table */}
          {!isLoading && (
            <ApprovalTable
              trackedHours={trackedHours}
              timesheets={timesheets}
              refetchData={refetchData}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { ManagerApprovalLayout };
