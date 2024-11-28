import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { addDays, format, parseISO } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Timesheet,
  DayHours,
  TimeRecord,
} from "@/components/project/manager-approval-layout";

const API_URL = "https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com";

const days: (keyof DayHours)[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const addOrUpdateTimeRecord = async (timeRecord: TimeRecord): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/test/timesheet/timerecord`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(timeRecord),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Message:", responseData);
  } catch (error) {
    console.error("Error adding/updating time record:", error);
  }
};

const validateTime = (startTime: string, endTime: string): boolean => {
  const start = new Date(`2024-01-01T${startTime}:00`);
  const end = new Date(`2024-01-01T${endTime}:00`);
  return start < end;
};

function EmployeeHoursTable({
  timesheets,
  refetchData,
}: {
  timesheets: Timesheet[];
  refetchData: () => void;
}) {
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedTimesheetId, setSelectedTimesheetId] = useState<string>("");
  const [selectedTimeRecord, setSelectedTimeRecord] =
    useState<TimeRecord | null>(null);
  const [selectedTimeRecordDay, setSelectedTimeRecordDay] =
    useState<keyof DayHours>("Monday");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSaveTime = async () => {
    setIsSaving(true);
    if (
      startTime &&
      endTime &&
      selectedTimesheetId &&
      validateTime(startTime, endTime)
    ) {
      const entry = timesheets.find((e) => e.id === selectedTimesheetId);

      const updatedTimeRecord = selectedTimeRecord
        ? {
            ...selectedTimeRecord,
            start_time: startTime,
            end_time: endTime,
          }
        : {
            // id: `${selectedTimesheetId}-${selectedTimeRecordDay}-${Date.now()}`,
            timesheet_id: selectedTimesheetId,
            day: selectedTimeRecordDay,
            date: format(
              addDays(
                parseISO(entry!.start_date_of_the_week),
                days.indexOf(selectedTimeRecordDay)
              ),
              "yyyy-MM-dd"
            ),
            start_time: startTime,
            end_time: endTime,
          };

      await addOrUpdateTimeRecord(updatedTimeRecord);
      refetchData();
    }
    setIsSaving(false);
    setIsDialogOpen(false);
  };

  const handleCellClick = (entryId: string, day: keyof DayHours) => {
    setIsDialogOpen(true);
    const entry = timesheets.find((e) => e.id === entryId);
    setSelectedTimesheetId(entry?.id || "");
    const timeRecord = entry?.time_records.find((r) => r.day === day);
    setSelectedTimeRecordDay(day);
    setSelectedTimeRecord(timeRecord || null);
    setStartTime(timeRecord?.start_time || "");
    setEndTime(timeRecord?.end_time || "");
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {days.map((day) => (
              <TableHead key={day} className="text-center">
                {day}
              </TableHead>
            ))}
            <TableHead className="text-center">Total Hours</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timesheets.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{`${entry.first_name} ${entry.last_name}`}</TableCell>
              {days.map((day) => (
                <TableCell key={day}>
                  <Button
                    variant="outline"
                    className="w-full h-full"
                    onClick={() => handleCellClick(entry.id, day)}
                    disabled={entry.status === "approved"}
                  >
                    {entry.hours[day] || "0.00"}
                  </Button>
                </TableCell>
              ))}
              <TableCell className="text-center">
                {Object.values(entry.hours)
                  .reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0)
                  .toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total Hours</TableCell>
            {days.map((day) => (
              <TableCell key={day} className="text-center">
                {timesheets
                  .map((entry) => parseFloat(entry.hours[day]) || 0)
                  .reduce((acc, curr) => acc + curr, 0)
                  .toFixed(2)}
              </TableCell>
            ))}
            <TableCell className="text-center">
              {timesheets
                .map((entry) =>
                  Object.values(entry.hours).reduce(
                    (acc, curr) => acc + (parseFloat(curr) || 0),
                    0
                  )
                )
                .reduce((acc, curr) => acc + curr, 0)
                .toFixed(2)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Time Details</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start-time" className="text-right">
                Start Time
              </Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setStartTime(e.target.value)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end-time" className="text-right">
                End Time
              </Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEndTime(e.target.value)
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveTime} disabled={isSaving}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { EmployeeHoursTable };
