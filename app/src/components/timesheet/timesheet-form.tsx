// timesheet-form.tsx
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
import { X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import refreshTokens from "@/actions/refresh-token";

type TimesheetProps = {
  employee_id: string;
  notificationDate: React.MutableRefObject<Date | null>;
};

type DayHours = {
  [key in "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"]: string;
};

interface TimeRecord {
  id?: string;
  timesheet_id: string;
  day: keyof DayHours;
  date: string;
  start_time: string;
  end_time: string;
}

interface TimesheetEntry {
  id?: string;
  project_id: string;
  project_name: string;
  employee_id: string;
  start_date_of_the_week: string;
  hours: DayHours;
  status?: string;
  submission_date?: Date;
  approved_date?: Date;
  time_records: TimeRecord[];
}

interface Project {
  id: string;
  name: string;
}

const days: (keyof DayHours)[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const transformTSToJSON = (data: TimesheetEntry): Record<string, any> => {
  const dataToStore = {
    project_id: data.project_id,
    employee_id: data.employee_id,
    start_date_of_the_week: data.start_date_of_the_week,
  };
  return dataToStore;
};

const transformToTimesheetEntry = (
  data: Record<string, any>
): TimesheetEntry => {
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
    project_id: data.project_id,
    project_name: data.project_name,
    employee_id: data.employee_id,
    start_date_of_the_week: data.start_date_of_the_week,
    hours: data.hours
      ? data.hours
      : { Monday: "", Tuesday: "", Wednesday: "", Thursday: "", Friday: "" },
    status: data.status ? data.status : "",
    submission_date: data.submission_date,
    approved_date: data.approved_date,
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

const addProjectToDatabase = async (
  entry: TimesheetEntry
): Promise<string | undefined> => {
  const tokenExpiry = parseInt(sessionStorage.getItem("tokenExpiry") || "0");
  if (Date.now() > tokenExpiry) {
    await refreshTokens();
  }
  const accessToken = sessionStorage.getItem("accessToken") || "";
  const data: Record<string, any> = transformTSToJSON(entry);
  console.log("Added project:", data);

  try {
    const response = await fetch(
      "https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/timesheet",
      {
        method: "POST",
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Message:", responseData);
    return responseData.id; // Return the auto-generated ID from the database
  } catch (error) {
    console.error("Error adding project to database:", error);
    return undefined;
  }
};

const fetchProjectData = async (employee_id: string): Promise<Project[]> => {
  const tokenExpiry = parseInt(sessionStorage.getItem("tokenExpiry") || "0");
  if (Date.now() > tokenExpiry) {
    await refreshTokens();
  }
  const accessToken = sessionStorage.getItem("accessToken") || "";
  try {
    const response = await fetch(
      `https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/project/worker/${employee_id}`,
      {
        method: "GET",
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    if (Array.isArray(data)) {
      return data.map((project: Record<string, any>) => ({
        id: project.project_id,
        name: project.project_name,
      }));
    } else {
      console.error("No data found");
      return [];
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

const fetchTimesheetData = async (
  employee_id: string,
  currentWeekStart: Date
): Promise<TimesheetEntry[]> => {
  const tokenExpiry = parseInt(sessionStorage.getItem("tokenExpiry") || "0");
  if (Date.now() > tokenExpiry) {
    await refreshTokens();
  }
  const accessToken = sessionStorage.getItem("accessToken") || "";
  try {
    const response = await fetch(
      `https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/timesheet?employee_id=${employee_id}&start_date_of_the_week=${format(
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
    const data = await response.json();
    console.log("Fetched data:", data);

    if (Array.isArray(data)) {
      return data.map((entry: Record<string, any>) =>
        transformToTimesheetEntry(entry)
      );
    } else {
      console.error("No data found");
      return []; // return empty array if no data is found
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

const addOrUpdateTimeRecord = async (
  timeRecord: TimeRecord
): Promise<string | undefined> => {
  const data = {
    ...(timeRecord.id && { id: timeRecord.id }),
    timesheet_id: timeRecord.timesheet_id,
    day: timeRecord.day,
    date: timeRecord.date,
    start_time: timeRecord.start_time,
    end_time: timeRecord.end_time,
  };
  const tokenExpiry = parseInt(sessionStorage.getItem("tokenExpiry") || "0");
  if (Date.now() > tokenExpiry) {
    await refreshTokens();
  }
  const accessToken = sessionStorage.getItem("accessToken") || "";
  try {
    const response = await fetch(
      "https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/timesheet/timerecord",
      {
        method: "POST",
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Message:", responseData);
    return responseData.id; // Return the auto-generated ID from the database
  } catch (error) {
    console.error("Error adding/updating time record:", error);
    return undefined;
  }
};

const submitTimesheet = async (timesheet: TimesheetEntry[]): Promise<void> => {
  const data = timesheet.reduce<
    { id: string | undefined; submission_date: string }[]
  >((result, entry) => {
    if (entry.status === "pending" || entry.status === "approved")
      return result;
    result.push({
      id: entry.id,
      submission_date: format(new Date(), "yyyy-MM-dd"),
    });
    return result;
  }, []);
  const tokenExpiry = parseInt(sessionStorage.getItem("tokenExpiry") || "0");
  if (Date.now() > tokenExpiry) {
    await refreshTokens();
  }
  const accessToken = sessionStorage.getItem("accessToken") || "";
  console.log("Submitting timesheet:", data);
  data.forEach(async (entry) => {
    try {
      const response = await fetch(
        "https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/timesheet/submit",
        {
          method: "PATCH",
          headers: {
            Authorization: accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(entry),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Message:", responseData);
    } catch (error) {
      console.error("Error submitting timesheet:", error);
    }
  });
  console.log("Submitted timesheet:", data);
};

const deleteTimesheetEntry = async (entryId: string): Promise<void> => {
  const tokenExpiry = parseInt(sessionStorage.getItem("tokenExpiry") || "0");
  if (Date.now() > tokenExpiry) {
    await refreshTokens();
  }
  const accessToken = sessionStorage.getItem("accessToken") || "";
  const response = await fetch(
    `https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/timesheet?id=${entryId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  console.log("Deleted entry:", entryId);
};

export function TimesheetTable({ employee_id, notificationDate }: TimesheetProps) {
  const [timesheet, setTimesheet] = useState<TimesheetEntry[]>([]);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEntryDisabled, setIsEntryDisabled] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<{
    entryId: string | null;
    day: keyof DayHours | null;
  }>({ entryId: null, day: null });
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(true); //TODO
  const today = new Date();
  const currentWeek = startOfWeek(today, { weekStartsOn: 1 });

  useEffect(() => {
    if (notificationDate.current) {
      setCurrentWeekStart(notificationDate.current);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTimesheetData(employee_id, notificationDate.current ?? currentWeekStart);
      const projectData = await fetchProjectData(employee_id);
      setTimesheet(data);
      setAvailableProjects(projectData);
      updateAvailableProjects(data, projectData);
      if (data && data.length > 0) {
        const isSubmitting = data.some(
          (entry) => entry.submission_date === null
        );
        console.log("isSubmitting:", isSubmitting);
        setIsSubmitting(isSubmitting);
      } else {
        setIsSubmitting(false);
      }

      if (notificationDate.current === currentWeekStart) {
        notificationDate.current = null;
      }
    };

    fetchData();
  }, [currentWeekStart, employee_id]);

  const updateAvailableProjects = (
    timesheetData: TimesheetEntry[],
    projectData: Project[]
  ) => {
    const usedProjectIds = new Set(
      timesheetData.map((entry) => entry.project_id)
    );
    const updatedAvailableProjects = projectData.filter(
      (project) => !usedProjectIds.has(project.id)
    );
    setAvailableProjects(updatedAvailableProjects);
  };

  const handleCellClick = (entryId: string, day: keyof DayHours) => {
    setSelectedCell({ entryId, day });
    setIsDialogOpen(true);
    const entry = timesheet.find((e) => e.id === entryId);
    const timeRecord = entry?.time_records.find((r) => r.day === day);
    setStartTime(timeRecord?.start_time || "");
    setEndTime(timeRecord?.end_time || "");
    const isDisabled =
      entry?.status === "pending" || entry?.status === "approved";
    setIsEntryDisabled(isDisabled);
  };

  const handleSaveTime = async () => {
    if (startTime && endTime && selectedCell.entryId && selectedCell.day) {
      setIsSubmitting(true);
      const start = new Date(`2024-01-01T${startTime}:00`);
      const end = new Date(`2024-01-01T${endTime}:00`);
      const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      const updatedTimesheet = await Promise.all(
        timesheet.map(async (entry) => {
          if (entry.id === selectedCell.entryId) {
            const existingTimeRecord = entry.time_records.find(
              (r) => r.day === selectedCell.day
            );
            let updatedTimeRecord: TimeRecord;

            if (existingTimeRecord) {
              updatedTimeRecord = {
                ...existingTimeRecord,
                start_time: startTime,
                end_time: endTime,
              };
            } else {
              updatedTimeRecord = {
                timesheet_id: entry.id!,
                day: selectedCell.day!,
                date: format(
                  addDays(
                    parseISO(entry.start_date_of_the_week),
                    days.indexOf(selectedCell.day!)
                  ),
                  "yyyy-MM-dd"
                ),
                start_time: startTime,
                end_time: endTime,
              };
            }

            const timeRecordId = await addOrUpdateTimeRecord(updatedTimeRecord);

            if (timeRecordId) {
              updatedTimeRecord.id = timeRecordId;
            }

            return {
              ...entry,
              hours: {
                ...entry.hours,
                [selectedCell.day!]: diffHours.toFixed(2),
              },
              time_records: existingTimeRecord
                ? entry.time_records.map((record) =>
                    record.day === selectedCell.day ? updatedTimeRecord : record
                  )
                : [...entry.time_records, updatedTimeRecord],
            };
          }
          return entry;
        })
      );

      setTimesheet(updatedTimesheet);
    }
    // setIsSubmitting(false)
    setIsDialogOpen(false);
  };

  const handleDeleteRow = (entryId: string) => {
    const entryToDelete = timesheet.find((entry) => entry.id === entryId);
    if (entryToDelete) {
      setTimesheet((prevTimesheet) =>
        prevTimesheet.filter((entry) => entry.id !== entryId)
      );
      setAvailableProjects((prevAvailable) =>
        [
          ...prevAvailable,
          { id: entryToDelete.project_id, name: entryToDelete.project_name },
        ].sort((a, b) => a.id.localeCompare(b.id))
      );
      deleteTimesheetEntry(entryId);
    }
  };

  const handleAddProject = async () => {
    const projectToAdd = availableProjects.find(
      (p) => p.id === selectedProjectId
    );
    if (projectToAdd) {
      const newEntry: TimesheetEntry = {
        project_id: projectToAdd.id,
        project_name: projectToAdd.name,
        employee_id: employee_id,
        start_date_of_the_week: format(currentWeekStart, "yyyy-MM-dd"),
        hours: {
          Monday: "",
          Tuesday: "",
          Wednesday: "",
          Thursday: "",
          Friday: "",
        },
        status: undefined,
        submission_date: undefined,
        approved_date: undefined,
        time_records: [],
      };

      try {
        const timesheetId = await addProjectToDatabase(newEntry);
        if (timesheetId) {
          newEntry.id = timesheetId;
          setTimesheet((prevTimesheet) => [...prevTimesheet, newEntry]);
          setAvailableProjects((prevAvailable) =>
            prevAvailable.filter((p) => p.id !== projectToAdd.id)
          );
          setIsSubmitting(true);
          setSelectedProjectId("");
        }
      } catch (error) {
        console.error("Failed to add project:", error);
      }
    }
  };

  const handleSubmitForApproval = () => {
    if (timesheet.length === 0) {
      return;
    }
    submitTimesheet(timesheet);
    timesheet
      .filter((entry) => entry.status !== "approved")
      .forEach((entry) => (entry.status = "pending"));
    setTimesheet([...timesheet]);
    setIsSubmitting(false); // not sure
  };

  const calculateTotalHours = (hours: DayHours): number => {
    return Object.values(hours).reduce(
      (sum, hour) => sum + (parseFloat(hour) || 0),
      0
    );
  };

  const calculateDayTotal = (day: keyof DayHours): number => {
    return timesheet.reduce(
      (sum, entry) => sum + (parseFloat(entry.hours[day]) || 0),
      0
    );
  };

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

  return (
    <div className="space-y-4 rounded-lg shadow-md p-6 bg-background">
      <div className="flex justify-between mb-4 items-baseline">
        <h1 className="font-bold">Timesheet</h1>
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

      <Table>
        <TableCaption>Weekly Timesheet</TableCaption>
        <TableHeader>
          <TableRow className="bg-accent dark:border-none">
            <TableHead>Project</TableHead>
            {days.map((day) => (
              <TableHead key={day} className="text-center">
                {day}
              </TableHead>
            ))}
            <TableHead>Total Hours</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timesheet.map((entry) => (
            <TableRow key={entry.id} className=" hover:bg-secondaryBackground dark:border-input">
              <TableCell>{entry.project_name}</TableCell>
              {days.map((day) => (
                <TableCell key={day}>
                  <Button
                    variant="outline"
                    className="w-full h-full"
                    onClick={() => handleCellClick(entry.id!, day)}
                  >
                    {entry.hours[day] || "0.00"}
                  </Button>
                </TableCell>
              ))}
              <TableCell>
                {calculateTotalHours(entry.hours).toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    entry.status === "pending"
                      ? "bg-custom-yellow p-2 font-semibold" // Pending
                      : entry.status === "approved"
                      ? "bg-custom-green p-2 font-semibold" // Approved
                      : entry.status === "rejected"
                      ? "bg-custom-red p-2 font-semibold" // Rejected
                      : "" // Fallback for unknown status
                  }`}
                >
                  {entry.status
                  ? entry.status.charAt(0).toUpperCase() + entry.status.slice(1)
                  : ""}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteRow(entry.id!)}
                  aria-label={`Delete ${entry.project_name}`}
                  disabled={
                    entry.status === "pending" || entry.status === "approved"
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className=" border-gray-300 dark:border-input dark:border-t-2">
          <TableRow>
            <TableCell>Daily Total</TableCell>
            {days.map((day) => (
              <TableCell key={day} className="text-center">
                {calculateDayTotal(day).toFixed(2)}
              </TableCell>
            ))}
            <TableCell>
              {timesheet
                .reduce(
                  (sum, entry) => sum + calculateTotalHours(entry.hours),
                  0
                )
                .toFixed(2)}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* disable the select section when the isSubmitted is true */}
          <Select
            value={selectedProjectId}
            onValueChange={setSelectedProjectId}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {availableProjects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddProject} disabled={!selectedProjectId}>
            Add Project
          </Button>
        </div>
        {isSubmitting ? (
          <Button
            onClick={handleSubmitForApproval}
            className="border-black hover:opacity-95"
          >
            <Check className="mr-2 h-4 w-4" /> Submit for Approval
          </Button>
        ) : (
          <Button onClick={handleSubmitForApproval} disabled>
            Submitted for Approval
          </Button>
        )}
      </div>

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
                disabled={isEntryDisabled}
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
                disabled={isEntryDisabled}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveTime} disabled={isEntryDisabled}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
