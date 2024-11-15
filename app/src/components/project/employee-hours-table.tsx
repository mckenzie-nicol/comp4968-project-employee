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
import { Timesheet } from "@/components/project/manager-approval-layout";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function EmployeeHoursTable({ timesheets }: { timesheets: Timesheet[] }) {
  return (
    <Table>
      <TableCaption>Weekly Timesheet</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          {days.map((day) => (
            <TableHead key={day} className="text-center">
              {day}
            </TableHead>
          ))}
          <TableHead>Total Hours</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timesheets.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>{`${entry.first_name} ${entry.last_name}`}</TableCell>
            {days.map((day) => (
              <TableCell key={day}>
                {/* <Button
                  variant="outline"
                  className="w-full h-full"
                  onClick={() => handleCellClick(entry.id, day)}
                >
                  {entry.hours[day] || "0.00"}
                </Button> */}
                test
              </TableCell>
            ))}
            <TableCell>test</TableCell>
            {/* <TableCell>{calculateTotalHours(entry.hours).toFixed(2)}</TableCell> */}
            {/* <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteRow(entry.id)}
                aria-label={`Delete ${entry.project_name}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell>Daily Total</TableCell>
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
          <TableCell />
        </TableRow>
      </TableFooter> */}
    </Table>
  );
}

export { EmployeeHoursTable };
