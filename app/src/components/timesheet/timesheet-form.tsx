import React, { useState } from "react"
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
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { startOfWeek, endOfWeek, addWeeks, format } from "date-fns"

type DayHours = {
  [key in "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"]: string
}

interface Project {
  id: number
  name: string
  hours: DayHours
}

const initialProjects: Project[] = [
  { id: 1, name: "Project A", hours: { Monday: "", Tuesday: "", Wednesday: "", Thursday: "", Friday: "" } },
  { id: 2, name: "Project B", hours: { Monday: "", Tuesday: "", Wednesday: "", Thursday: "", Friday: "" } },
  { id: 3, name: "Project C", hours: { Monday: "", Tuesday: "", Wednesday: "", Thursday: "", Friday: "" } },
]

const days: (keyof DayHours)[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

export function TimesheetTable() {
  const [timesheet, setTimesheet] = useState<Project[]>(initialProjects)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [selectedCell, setSelectedCell] = useState<{ projectId: number | null; day: keyof DayHours | null }>({ projectId: null, day: null })
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [nextId, setNextId] = useState<number>(initialProjects.length + 1)
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }))

  const handleCellClick = (projectId: number, day: keyof DayHours) => {
    setSelectedCell({ projectId, day })
    setIsDialogOpen(true)
    setStartTime("")
    setEndTime("")
  }

  const handleSaveTime = () => {
    if (startTime && endTime && selectedCell.projectId && selectedCell.day) {
      const start = new Date(`2023-01-01T${startTime}:00`)
      const end = new Date(`2023-01-01T${endTime}:00`)
      const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

      setTimesheet(prevTimesheet =>
        prevTimesheet.map(project =>
          project.id === selectedCell.projectId
            ? {
                ...project,
                hours: {
                  ...project.hours,
                  [selectedCell.day as keyof DayHours]: diffHours.toFixed(2)
                }
              }
            : project
        )
      )
    }
    setIsDialogOpen(false)
  }

  const handleDeleteRow = (projectId: number) => {
    setTimesheet(prevTimesheet => prevTimesheet.filter(project => project.id !== projectId))
  }

  const handleAddRow = () => {
    const newProject: Project = {
      id: nextId,
      name: `Project ${nextId}`,
      hours: { Monday: "", Tuesday: "", Wednesday: "", Thursday: "", Friday: "" }
    }
    setTimesheet(prevTimesheet => [...prevTimesheet, newProject])
    setNextId(prevId => prevId + 1)
  }

  const calculateTotalHours = (hours: DayHours): number => {
    return Object.values(hours).reduce((sum, hour) => sum + (parseFloat(hour) || 0), 0)
  }

  const calculateDayTotal = (day: keyof DayHours): number => {
    return timesheet.reduce((sum, project) => sum + (parseFloat(project.hours[day]) || 0), 0)
  }

  const handlePreviousWeek = () => {
    setCurrentWeekStart(prevWeekStart => addWeeks(prevWeekStart, -1))
  }

  const handleNextWeek = () => {
    setCurrentWeekStart(prevWeekStart => addWeeks(prevWeekStart, 1))
  }

  const formatDateRange = (start: Date): string => {
    const end = endOfWeek(start, { weekStartsOn: 1 })
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek} aria-label="Previous week">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{formatDateRange(currentWeekStart)}</span>
          <Button variant="outline" size="icon" onClick={handleNextWeek} aria-label="Next week">
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
          {timesheet.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.name}</TableCell>
              {days.map(day => (
                <TableCell key={day}>
                  <Button
                    variant="outline"
                    className="w-full h-full"
                    onClick={() => handleCellClick(project.id, day)}
                  >
                    {project.hours[day] || "0.00"}
                  </Button>
                </TableCell>
              ))}
              <TableCell>{calculateTotalHours(project.hours).toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteRow(project.id)}
                  aria-label={`Delete ${project.name}`}
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
              {timesheet.reduce((sum, project) => sum + calculateTotalHours(project.hours), 0).toFixed(2)}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>

      <div className="mt-4">
        <Button onClick={handleAddRow}>
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Time Details</DialogTitle>
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