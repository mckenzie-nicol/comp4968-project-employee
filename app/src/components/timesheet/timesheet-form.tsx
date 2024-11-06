import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimesheetEntry {
  id: number
  project: string
  hours: string
  date: string
  description: string
}

export interface TimesheetFormProps {
  onSubmit: () => void
}

export function TimesheetForm({ onSubmit }: TimesheetFormProps) {
  const [entries, setEntries] = useState<TimesheetEntry[]>([
    { id: 1, project: "", hours: "", date: "", description: "" },
  ])

  const addEntry = () => {
    const newEntry: TimesheetEntry = {
      id: entries.length + 1,
      project: "",
      hours: "",
      date: "",
      description: "",
    }
    setEntries([...entries, newEntry])
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically save the timesheet data
    onSubmit()
  }

  return (
    <Card className="bg-white/10 border-0">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`project-${entry.id}`} className="text-gray-700">Project</Label>
                  <Select>
                    <SelectTrigger className="bg-white/50 border-gray-200 focus:border-black focus:ring-black">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="website">Website Redesign</SelectItem>
                      <SelectItem value="mobile">Mobile App</SelectItem>
                      <SelectItem value="database">Database Migration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`date-${entry.id}`} className="text-gray-700">Date</Label>
                  <Input 
                    type="date" 
                    id={`date-${entry.id}`} 
                    required 
                    className="bg-white/50 border-gray-200 focus:border-black focus:ring-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`hours-${entry.id}`} className="text-gray-700">Hours</Label>
                  <Input
                    type="number"
                    id={`hours-${entry.id}`}
                    min="0"
                    step="0.5"
                    required
                    className="bg-white/50 border-gray-200 focus:border-black focus:ring-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`description-${entry.id}`} className="text-gray-700">Description</Label>
                  <Input
                    type="text"
                    id={`description-${entry.id}`}
                    placeholder="Brief description of work done"
                    required
                    className="bg-white/50 border-gray-200 focus:border-black focus:ring-black"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={addEntry}
              className="bg-white/50 hover:bg-white/80 border-gray-200"
            >
              Add Entry
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-black via-gray-800 to-black hover:opacity-90 transition-opacity"
            >
              Submit Timesheet
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}