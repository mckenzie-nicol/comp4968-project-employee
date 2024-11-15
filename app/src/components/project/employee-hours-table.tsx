import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const API_URL = "https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com";

// Fetch timesheet hours data for the project page that manager is on
const fetchTimesheetData = async (pid, currentWeekStart) => {
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

type Project = {
  id: number;
  name: string;
  progress: number;
  hours: number;
  status: string;
};

function EmployeeHoursTable({ pid, currentWeekStart }) {
  const [timesheets, setTimesheets] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTimesheetData(pid, currentWeekStart);
      const timesheetsData = data.map((project: Project) => ({
        id: project.id,
        name: project.name,
        // TODO: Replace the mock data
        progress: 89,
        hours: 42.0,
        status: "In Progress",
      }));
      setTimesheets(timesheetsData);
    };
    fetchData();
  }, [currentWeekStart]);

  return (
    <Table>
      <TableCaption>Weekly Timesheet</TableCaption>
      <TableHeader>
        {/* <TableRow>
          <TableHead>Project</TableHead>
          {days.map((day) => (
            <TableHead key={day} className="text-center">
              {day}
            </TableHead>
          ))}
          <TableHead>Total Hours</TableHead>
          <TableHead className="w-[50px]">Actions</TableHead>
        </TableRow> */}
      </TableHeader>
      <TableBody>
        {/* {timesheet.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>{entry.project_name}</TableCell>
            {days.map((day) => (
              <TableCell key={day}>
                <Button
                  variant="outline"
                  className="w-full h-full"
                  onClick={() => handleCellClick(entry.id, day)}
                >
                  {entry.hours[day] || "0.00"}
                </Button>
              </TableCell>
            ))}
            <TableCell>{calculateTotalHours(entry.hours).toFixed(2)}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteRow(entry.id)}
                aria-label={`Delete ${entry.project_name}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))} */}
      </TableBody>
      <TableFooter>
        <TableRow>
          {/* <TableCell>Daily Total</TableCell>
          {days.map((day) => (
            <TableCell key={day} className="text-center">
              {calculateDayTotal(day).toFixed(2)}
            </TableCell>
          ))}
          <TableCell>
            {timesheet
              .reduce((sum, entry) => sum + calculateTotalHours(entry.hours), 0)
              .toFixed(2)}
          </TableCell>
          <TableCell /> */}
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export { EmployeeHoursTable };
