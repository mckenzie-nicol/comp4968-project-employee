import React, { useState, useEffect } from "react";
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

const API_URL = "https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com";

const days: (keyof DayHours)[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const fetchTimesheetData = async (pid: string, currentWeekStart: Date) => {
  try {
    const response = await fetch(
      `${API_URL}/test/timesheet/manager/${pid}?start_date=${format(
        currentWeekStart,
        "yyyy-MM-dd"
      )}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log(response);
    const data = await response.json();
    console.log(data);
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchTimeRecordData = async (
  timesheetsData: Record<string, unknown>[]
) => {
  const promisesArray = await Promise.allSettled(
    timesheetsData.map(async (timesheetData: Record<string, unknown>) => {
      const response = await fetch(
        `${API_URL}/test/timesheet/timerecord?timesheet_id=${timesheetData.id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log(response);
      const data = await response.json();
      console.log(data);
      return {
        ...timesheetData,
        time_records: Array.isArray(data) ? data : [],
      };
    })
  );
  console.log(promisesArray);
  const timesheetAndRecordsData = promisesArray
    .filter((promise) => promise.status === "fulfilled")
    .map((promise) => promise.value);
  console.log(timesheetAndRecordsData);
  return timesheetAndRecordsData;
};

const fetchHoursData = async (
  timesheetAndRecordsData: Record<string, unknown>[]
) => {
  const promisesArray = await Promise.allSettled(
    timesheetAndRecordsData.map(
      async (timesheetAndRecord: Record<string, unknown>) => {
        const response = await fetch(
          `${API_URL}/test/timesheet/timerecord/manager/${timesheetAndRecord.employee_id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log(response);
        const data = await response.json();
        console.log(data);
        const hoursWorked = data.data
          .map((timeRecord: { start_time: "string"; end_time: "string" }) => {
            const start = new Date(`2024-01-01T${timeRecord.start_time}:00`);
            const end = new Date(`2024-01-01T${timeRecord.end_time}:00`);
            return differenceInMinutes(end, start) / 60;
          })
          .reduce((acc: number, curr: number) => acc + curr, 0);
        return hoursWorked;
      }
    )
  );
  console.log(promisesArray);
  const hoursData = promisesArray
    .filter((promise) => promise.status === "fulfilled")
    .map((promise) => promise.value);
  console.log(hoursData);
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
    ...data,
    approved_by: data.approved_by ?? "",
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

export interface TimeRecord {
  id: string;
  timesheet_id: string;
  day: keyof DayHours;
  date: string;
  start_time: string;
  end_time: string;
}

export type Timesheet = {
  id: string;
  project_id: string;
  employee_id: string;
  start_date_of_the_week: string;
  submission_date: string;
  hours: DayHours;
  approved: boolean;
  approved_by: string;
  approved_date: string;
  first_name: string;
  last_name: string;
  time_records: TimeRecord[];
};

function ManagerApprovalLayout({ pid }: { pid: string }) {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [trackedHours, setTrackedHours] = useState<number[]>([]);

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

  // Fetch timesheet and records data of all employees for the current week
  const fetchData = async () => {
    const timesheetsData = await fetchTimesheetData(pid, currentWeekStart);
    const timesheetAndRecordsData = await fetchTimeRecordData(timesheetsData);
    const hoursData = await fetchHoursData(timesheetAndRecordsData);
    setTrackedHours(hoursData);
    setTimesheets(timesheetAndRecordsData.map(transformTimesheet));
  };

  // Fetch timesheet and records data of all employees for the current week
  useEffect(() => {
    fetchData();
  }, [currentWeekStart]);

  console.log(timesheets);

  return (
    <div className="space-y-4">
      {/* Week selector */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousWeek}
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
            disabled={!isCurrentWeek}
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="timesheets" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="timesheets" className="w-1/2">
            Timesheets
          </TabsTrigger>
          <TabsTrigger value="approval" className="w-1/2">
            Approval
          </TabsTrigger>
        </TabsList>
        <TabsContent value="timesheets">
          {/* Employee hours table */}
          <EmployeeHoursTable timesheets={timesheets} fetchData={fetchData} />
        </TabsContent>
        <TabsContent value="approval">
          {/* Approval table */}
          <ApprovalTable trackedHours={trackedHours} timesheets={timesheets} fetchData={fetchData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { ManagerApprovalLayout };
