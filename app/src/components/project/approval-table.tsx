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
import { Button } from "@/components/ui/button";
import { X, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Timesheet } from "@/components/project/manager-approval-layout";

function ApprovalTable({ timesheets }: { timesheets: Timesheet[] }) {
  return (
    <Table>
      <TableCaption>Weekly Timesheet</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Total Hours</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timesheets.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>{`${entry.first_name} ${entry.last_name}`}</TableCell>
            <TableCell>
              <p>test</p>
            </TableCell>
            <TableCell>{entry.approved ? "Approved" : "Open"}</TableCell>
            <TableCell>
              <Button variant="ghost">Approve</Button>
            </TableCell>
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

export { ApprovalTable };
