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
import { X, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { EmployeeHoursTable } from "./employee-hours-table";
import { ApprovalTable } from "./approval-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const API_URL = "https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com";

const fetchTimesheetData = async (pid: string, currentWeekStart: Date) => {
  try {
    const response = await fetch(
      `${API_URL}/test/timesheet/manager/${pid}?start_date=${format(
        currentWeekStart,
        "yyyy-MM-dd"
      )}`
    );
    console.log(response);
    const data = await response.json();
    console.log(data);
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchTimeRecordData = async (timesheetsData: Timesheet[]) => {
  const promisesArray = await Promise.allSettled(
    timesheetsData.map(async (timesheetData: Timesheet) => {
      const response = await fetch(
        `${API_URL}/test/timesheet/timerecord?timesheet_id=${timesheetData.id}`
      );
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

type DayHours = {
  [key in "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"]: string;
};

interface TimeRecord {
  id: string;
  timesheet_id: string;
  day: keyof DayHours;
  date: string;
  start_time: string;
  end_time: string;
}

// TODO: need this below?
// hours: DayHours

// TODO: fix null types later
export type Timesheet = {
  id: string;
  project_id: string;
  employee_id: string;
  start_date_of_the_week: string;
  submission_date: string;
  approved: boolean;
  approved_by: string | null;
  approved_date: string | null;
  first_name: string;
  last_name: string;
  time_records: TimeRecord[];
};

// DATA FORMAT
// {
//   "id": "emp003-proj003-2024-11-11",
//   "project_id": "proj003",
//   "employee_id": "emp003",
//   "start_date_of_the_week": "2024-11-11",
//   "submission_date": "2024-11-15",
//   "approved": false,
//   "approved_by": null,
//   "approved_date": null,
//   "first_name": "Jess",
//   "last_name": "Brown",
//   "records": [
//       {
//           "id": "emp003-proj003-2024-11-11-Tuesday-1731683093058",
//           "timesheet_id": "emp003-proj003-2024-11-11",
//           "date": "2024-11-12T00:00:00.000Z",
//           "day": "Tuesday",
//           "start_time": "10:07",
//           "end_time": "22:07"
//       },
//       {
//           "id": "emp003-proj003-2024-11-11-Thursday-1731683118358",
//           "timesheet_id": "emp003-proj003-2024-11-11",
//           "date": "2024-11-14T00:00:00.000Z",
//           "day": "Thursday",
//           "start_time": "09:08",
//           "end_time": "10:08"
//       }
//   ]
// }

function ManagerApprovalLayout({ pid }: { pid: string }) {
  // Week selector state
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  // Fetched timesheet data state
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);

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
  useEffect(() => {
    const fetchData = async () => {
      const timesheetsData = await fetchTimesheetData(pid, currentWeekStart);
      const timesheetAndRecordsData = await fetchTimeRecordData(timesheetsData);
      setTimesheets(timesheetAndRecordsData);
    };
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
      <Tabs defaultValue="timesheets" className="w-1000px">
        <TabsList>
          <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
          <TabsTrigger value="approval">Approval</TabsTrigger>
        </TabsList>
        <TabsContent value="timesheets">
          {/* Employee hours table */}
          <EmployeeHoursTable timesheets={timesheets} />
        </TabsContent>
        <TabsContent value="approval">
          {/* Approval table */}
          <ApprovalTable timesheets={timesheets} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { ManagerApprovalLayout };
