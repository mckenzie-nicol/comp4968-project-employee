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
import { X, Check, ChevronLeft, ChevronRight } from "lucide-react"
import { startOfWeek, endOfWeek, addWeeks, format, isBefore } from "date-fns"
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
  timesheet_entry_id: string;
  day: keyof DayHours;
  start_time: string;
  end_time: string;
}

interface TimesheetEntry {
  id: string
  project_id: number
  employee_id: string
  start_date_of_the_week: string
  hours: DayHours
  approved: boolean
  approved_by?: string
  submission_date?: Date
  approved_date?: Date
  time_records: TimeRecord[]
}

const initialAvailableProjects = [
  { id: 1, name: "Project 1" },
  { id: 2, name: "Project 2" },
  { id: 3, name: "Project 3" },
  { id: 4, name: "Project 4" },
  { id: 5, name: "Project 5" },
]

const days: (keyof DayHours)[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

const transformToJSON = (data: TimesheetEntry): Record<string, any> => {
  return JSON.parse(
    JSON.stringify(data, (_, value) => (value === undefined ? null : value))
  );
}

const transformToTimesheetEntry = (data: Record<string, any>): TimesheetEntry => {
  return {
    id: data.id,
    project_id: data.project_id,
    employee_id: data.employee_id,
    start_date_of_the_week: data.start_date_of_the_week,
    hours: data.hours,
    approved: data.approved,
    approved_by: data.approved_by,
    submission_date: data.submission_date,
    approved_date: data.approved_date,
    time_records: data.time_records
  }
}

const addProjectToDatabase = async (entry: TimesheetEntry): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const data : Record<string, any> = transformToJSON(entry);
  console.log("Timesheet Entry JSON Added to database:", data );
}

const addOrUpdateTimeRecord = async ( entry : TimesheetEntry, timeRecord: TimeRecord): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // patch request to update timesheet entry
  // fetch(`/api/timesheet/${entry.id}`, {
  //   method: "PATCH",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(entry.time_records),
  // });
  console.log(`Patch Change for Project ${entry.project_id}: `, entry.time_records);
  console.log("Added/Updated time record:", timeRecord);
}

export function TimesheetTable({ employee_id }: TimesheetProps) {
  const [timesheet, setTimesheet] = useState<TimesheetEntry[]>([])
  const [availableProjects, setAvailableProjects] = useState(initialAvailableProjects)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [selectedCell, setSelectedCell] = useState<{ entryId: string | null; day: keyof DayHours | null }>({ entryId: null, day: null })
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")

  const today = new Date()
  const currentWeek = startOfWeek(today, { weekStartsOn: 1 })

  // fetch project data from database
  useEffect(() => {
    // TODO: fetchProjectData()
  }, [])

  // fetch timesheet data from database
  useEffect(() => {
    setTimesheet([])
    // TODO: fetchTimesheetData(employee_id, currentWeekStart)
    setAvailableProjects(initialAvailableProjects)
  }, [currentWeekStart])

  // update database when the timesheet state changes
  useEffect(() => {
    console.log("Timesheet updated:", timesheet)
    // TODO: updateDatabase(timesheet)
  }, [timesheet])

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

      const updatedTimesheet = timesheet.map(entry =>
        entry.id === selectedCell.entryId
          ? {
              ...entry,
              hours: {
                ...entry.hours,
                [selectedCell.day!]: diffHours.toFixed(2)
              },
              time_records: entry.time_records.some(record => record.day === selectedCell.day)
                ? entry.time_records.map(record =>
                    record.day === selectedCell.day
                      ? {
                          ...record,
                          start_time: startTime,
                          end_time: endTime,
                        }
                      : record
                  )
                : [
                    ...entry.time_records,
                    {
                      timesheet_entry_id: entry.id,
                      day: selectedCell.day!,
                      start_time: startTime,
                      end_time: endTime,
                    }
                  ]
            }
          : entry
      )

      setTimesheet(updatedTimesheet)

      const updatedEntry = updatedTimesheet.find(entry => entry.id === selectedCell.entryId)
      if (updatedEntry) {
        const updatedTimeRecord = updatedEntry.time_records.find(record => record.day === selectedCell.day)
        if (updatedTimeRecord) {
          try {
            await addOrUpdateTimeRecord( updatedEntry, updatedTimeRecord)
          } catch (error) {
            console.error("Failed to add/update time record:", error)
          }
        }
      }
    }
    setIsDialogOpen(false)
  }

  const handleDeleteRow = (entryId: string) => {
    const entryToDelete = timesheet.find(entry => entry.id === entryId)
    if (entryToDelete) {
      setTimesheet(prevTimesheet => prevTimesheet.filter(entry => entry.id !== entryId))
      setAvailableProjects(prevAvailable => [...prevAvailable, { id: entryToDelete.project_id, name: `Project ${entryToDelete.project_id}` }].sort((a, b) => a.id - b.id))
    }
  }

  const handleAddProject = async () => {
    const projectToAdd = availableProjects.find(p => p.id.toString() === selectedProjectId)
    if (projectToAdd) {
      const newEntry: TimesheetEntry = {
        id: `${employee_id}-${projectToAdd.id}-${format(currentWeekStart, 'yyyy-MM-dd')}`,
        project_id: projectToAdd.id,
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
        await addProjectToDatabase(newEntry)
        setTimesheet(prevTimesheet => [...prevTimesheet, newEntry])
        setAvailableProjects(prevAvailable => prevAvailable.filter(p => p.id !== projectToAdd.id))
        setSelectedProjectId("")
      } catch (error) {
        console.error("Failed to add project:", error)
      }
    }
  }

  const handleSubmitForApproval = () => {
    console.log("Timesheet submitted for approval")
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
              <TableCell>{`Project ${entry.project_id}`}</TableCell>
              {days.map(day => (
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
                  aria-label={`Delete Project ${entry.project_id}`}
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
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {availableProjects.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddProject} disabled={!selectedProjectId}>
            Add Project
          </Button>
        </div>
        <Button onClick={handleSubmitForApproval} variant="outline" className="border-black">
          <Check className="mr-2 h-4 w-4" /> Submit for Approval
        </Button>
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
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveTime}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}