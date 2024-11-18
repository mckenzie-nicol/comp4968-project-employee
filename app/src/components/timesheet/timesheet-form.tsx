// timesheet-form.tsx
import React, { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { startOfWeek, endOfWeek, addWeeks, addDays, format, isBefore, parseISO, differenceInMinutes } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type TimesheetProps = {
  employee_id: string
}

type DayHours = {
  [key in "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"]: string
}

interface TimeRecord {
  id?: string;
  timesheet_id: string;
  day: keyof DayHours;
  date: string;
  start_time: string;
  end_time: string;
}

interface TimesheetEntry {
  id?: string
  project_id: string
  project_name: string
  employee_id: string
  start_date_of_the_week: string
  hours: DayHours
  approved: boolean
  approved_by?: string
  submission_date?: Date
  approved_date?: Date
  time_records: TimeRecord[]
}

interface Project {
  id: string
  name: string
}

const days: (keyof DayHours)[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

const transformTSToJSON = (data: TimesheetEntry): Record<string, any> => {
  const dataToStore = {
    project_id: data.project_id,
    employee_id: data.employee_id,
    start_date_of_the_week: data.start_date_of_the_week,
  };
  return dataToStore;
}

const transformToTimesheetEntry = (data: Record<string, any>): TimesheetEntry => {
  const startDate = parseISO(data.start_date_of_the_week);

  // Calculate hours based on time records
  data.hours = data.time_records.reduce((acc: DayHours, record: TimeRecord) => {
    const start = new Date(`2024-01-01T${record.start_time}:00`);
    const end = new Date(`2024-01-01T${record.end_time}:00`);
    const diffHours = differenceInMinutes(end, start) / 60;
    acc[record.day] = diffHours.toFixed(2);
    return acc;
  }, { Monday: "", Tuesday: "", Wednesday: "", Thursday: "", Friday: "" });

  return {
    id: data.id,
    project_id: data.project_id,
    project_name: data.project_name,
    employee_id: data.employee_id,
    start_date_of_the_week: data.start_date_of_the_week,
    hours: data.hours ? data.hours : { Monday: "", Tuesday: "", Wednesday: "", Thursday: "", Friday: "" },
    approved: data.approved,
    approved_by: data.approved_by,
    submission_date: data.submission_date,
    approved_date: data.approved_date,
    time_records: data.time_records ? data.time_records.map((record: any) => ({
      ...record,
      date: record.date || format(addDays(startDate, days.indexOf(record.day)), 'yyyy-MM-dd')
    })) : []
  }
}

const addProjectToDatabase = async (entry: TimesheetEntry): Promise<string | undefined> => {
  const data: Record<string, any> = transformTSToJSON(entry);
  console.log("Added project:", data);

  try {
    const response = await fetch('https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/timesheet', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

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

const fetchProjectData = async (): Promise<Project[]> => {
  try {
    const response = await fetch('https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/project');
    const data = await response.json();

    if (Array.isArray(data)) {
      return data.map((project: Record<string, any>) => ({
        id: project.id,
        name: project.name,
      }));
    } else {
      console.error("No data found");
      return [];
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

const fetchTimesheetData = async (employee_id: string, currentWeekStart: Date): Promise<TimesheetEntry[]> => {
  try {
    const response = await fetch(
      `https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/timesheet?employee_id=${employee_id}&start_date_of_the_week=${format(currentWeekStart, 'yyyy-MM-dd')}`
    );
    const data = await response.json();
    console.log("Fetched data:", data);
    
    if (Array.isArray(data)) {
      return data.map((entry: Record<string, any>) => transformToTimesheetEntry(entry));
    } else {
      console.error("No data found");
      return []; // return empty array if no data is found
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

const addOrUpdateTimeRecord = async (timeRecord: TimeRecord): Promise<string | undefined> => {
  const data = {
    ...(timeRecord.id && { id: timeRecord.id }),
    timesheet_id: timeRecord.timesheet_id,
    day: timeRecord.day,
    date: timeRecord.date,
    start_time: timeRecord.start_time,
    end_time: timeRecord.end_time,
  };
  
  try {
    const response = await fetch('https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/timesheet/timerecord', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Message:", responseData);
    return responseData.id; // Return the auto-generated ID from the database
  } catch (error) {
    console.error("Error adding/updating time record:", error);
    return undefined;
  };
}

const submitTimesheet = async (timesheet: TimesheetEntry[]): Promise<void> => {
  const data = timesheet.map(entry => {
    return {
      id: entry.id,
      submission_date: format(new Date(), 'yyyy-MM-dd')
    }
  });
  console.log("Submitting timesheet:", data);
  data.forEach(async (entry) => {
    try {
      const response = await fetch('https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/timesheet/submit', {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });

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
  const response = await fetch(`https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/timesheet?id=${entryId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  console.log("Deleted entry:", entryId);
}

export function TimesheetTable({ employee_id }: TimesheetProps) {
  const [timesheet, setTimesheet] = useState<TimesheetEntry[]>([])
  const [availableProjects, setAvailableProjects] = useState<Project[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [selectedCell, setSelectedCell] = useState<{ entryId: string | null; day: keyof DayHours | null }>({ entryId: null, day: null })
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const today = new Date()
  const currentWeek = startOfWeek(today, { weekStartsOn: 1 })

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTimesheetData(employee_id, currentWeekStart);
      const projectData = await fetchProjectData();
      setTimesheet(data);
      setAvailableProjects(projectData);
      updateAvailableProjects(data, projectData);
      if (data && data.length > 0) {
        const isSubmitted = data.every(entry => entry.submission_date !== null);
        setIsSubmitted(isSubmitted);
      } else {
        setIsSubmitted(false);
      }
    };
    console.log('IsSubmitted:', isSubmitted);
    fetchData();
  }, [currentWeekStart, employee_id]);

  const updateAvailableProjects = (timesheetData: TimesheetEntry[], projectData : Project[]) => {
    const usedProjectIds = new Set(timesheetData.map(entry => entry.project_id));
    const updatedAvailableProjects = projectData.filter(
      project => !usedProjectIds.has(project.id)
    );
    setAvailableProjects(updatedAvailableProjects);
  };

  const handleCellClick = (entryId: string, day: keyof DayHours) => {
    setSelectedCell({ entryId, day })
    setIsDialogOpen(true)
    const entry = timesheet.find(e => e.id === entryId)
    const timeRecord = entry?.time_records.find(r => r.day === day)
    setStartTime(timeRecord?.start_time || "")
    setEndTime(timeRecord?.end_time || "")
  }

  const handleSaveTime = async () => {
    if (startTime && endTime && selectedCell.entryId && selectedCell.day) {
      const start = new Date(`2024-01-01T${startTime}:00`)
      const end = new Date(`2024-01-01T${endTime}:00`)
      const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

      const updatedTimesheet = await Promise.all(timesheet.map(async (entry) => {
        if (entry.id === selectedCell.entryId) {
          const existingTimeRecord = entry.time_records.find(r => r.day === selectedCell.day)
          let updatedTimeRecord: TimeRecord;

          if (existingTimeRecord) {
            updatedTimeRecord = {
              ...existingTimeRecord,
              start_time: startTime,
              end_time: endTime,
            }
          } else {
            updatedTimeRecord = {
              timesheet_id: entry.id!,
              day: selectedCell.day!,
              date: format(addDays(parseISO(entry.start_date_of_the_week), days.indexOf(selectedCell.day!)), 'yyyy-MM-dd'),
              start_time: startTime,
              end_time: endTime,
            }
          }

          const timeRecordId = await addOrUpdateTimeRecord(updatedTimeRecord)

          if (timeRecordId) {
            updatedTimeRecord.id = timeRecordId
          }

          return {
            ...entry,
            hours: {
              ...entry.hours,
              [selectedCell.day!]: diffHours.toFixed(2)
            },
            time_records: existingTimeRecord
              ? entry.time_records.map(record =>
                  record.day === selectedCell.day ? updatedTimeRecord : record
                )
              : [...entry.time_records, updatedTimeRecord]
          }
        }
        return entry
      }))

      setTimesheet(updatedTimesheet)
    }
    setIsDialogOpen(false)
  }

  const handleDeleteRow = (entryId: string) => {
    const entryToDelete = timesheet.find(entry => entry.id === entryId)
    if (entryToDelete) {
      setTimesheet(prevTimesheet => prevTimesheet.filter(entry => entry.id !== entryId))
      setAvailableProjects(prevAvailable => [...prevAvailable, { id: entryToDelete.project_id, name: entryToDelete.project_name }].sort((a, b) => a.id.localeCompare(b.id)))
      deleteTimesheetEntry(entryId)
    }
  }

  const handleAddProject = async () => {
    const projectToAdd = availableProjects.find(p => p.id === selectedProjectId)
    if (projectToAdd) {
      const newEntry: TimesheetEntry = {
        project_id: projectToAdd.id,
        project_name: projectToAdd.name,
        employee_id: employee_id,
        start_date_of_the_week: format(currentWeekStart, 'yyyy-MM-dd'),
        hours: { Monday: "", Tuesday: "", Wednesday: "", Thursday: "", Friday: "" },
        approved: false,
        approved_by: undefined,
        submission_date: undefined,
        approved_date: undefined,
        time_records: []
      }

      try {
        const timesheetId = await addProjectToDatabase(newEntry)
        if (timesheetId) {
          newEntry.id = timesheetId
          setTimesheet(prevTimesheet => [...prevTimesheet, newEntry])
          setAvailableProjects(prevAvailable => prevAvailable.filter(p => p.id !== projectToAdd.id))
          setSelectedProjectId("")
        }
      } catch (error) {
        console.error("Failed to add project:", error)
      }
    }
  }

  const handleSubmitForApproval = () => {
    if (timesheet.length === 0) {
      return;
    }
    submitTimesheet(timesheet);
    setIsSubmitted(true);
  }

  const calculateTotalHours = (hours: DayHours): number => {
    return Object.values(hours).reduce((sum, hour) => sum + (parseFloat(hour) || 0), 0)
  }

  const calculateDayTotal = (day: keyof DayHours): number => {
    return timesheet.reduce((sum, entry) => sum + (parseFloat(entry.hours[day]) || 0), 0)
  }

  const handlePreviousWeek = () => {
    setCurrentWeekStart(prevWeekStart => addWeeks(prevWeekStart, -1))
  }

  const handleNextWeek = () => {
    const nextWeek = addWeeks(currentWeekStart, 1)
    if (isBefore(nextWeek, addWeeks(currentWeek, 1))) {
      setCurrentWeekStart(nextWeek)
    }
  }

  const formatDateRange = (start: Date): string => {
    const end = endOfWeek(start, { weekStartsOn: 1 })
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
  }

  const isCurrentWeek = isBefore(currentWeekStart, addWeeks(currentWeek, 1))

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek} aria-label="Previous week">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{formatDateRange(currentWeekStart)}</span>
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
          <TableRow>
            <TableHead>Project</TableHead>
            {days.map(day => (
              <TableHead key={day} className="text-center">{day}</TableHead>
            ))}
            <TableHead>Total Hours</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timesheet.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.project_name}</TableCell>
              {days.map(day => (
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
              <TableCell>{calculateTotalHours(entry.hours).toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteRow(entry.id!)}
                  aria-label={`Delete ${entry.project_name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Daily Total</TableCell>
            {days.map(day => (
              <TableCell key={day} className="text-center">{calculateDayTotal(day).toFixed(2)}</TableCell>
            ))}
            <TableCell>
              {timesheet.reduce((sum, entry) => sum + calculateTotalHours(entry.hours), 0).toFixed(2)}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* disable the select section when the isSubmitted is true */}
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId} disabled={isSubmitted}>
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
        { isSubmitted
          ? <Button onClick={handleSubmitForApproval} disabled>
              Submitted for Approval
            </Button>
          : <Button onClick={handleSubmitForApproval} variant="outline" className="border-black">
              <Check className="mr-2 h-4 w-4" /> Submit for Approval
            </Button>
        }
        
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)}
                className="col-span-3"
                disabled={isSubmitted}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)}
                className="col-span-3"
                disabled={isSubmitted}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveTime} disabled={isSubmitted}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}