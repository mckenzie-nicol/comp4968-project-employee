import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimesheetFormProps {
  onSubmit: () => void
}

export function TimesheetForm({ onSubmit }: TimesheetFormProps) {
  const [entries, setEntries] = useState([
    { id: 1, project: "", hours: "", date: "", description: "" },
  ])

  const addEntry = () => {
    const newEntry = {
      id: entries.length + 1,
      project: "",
      hours: "",
      date: "",
      description: "",
    }
    setEntries([...entries, newEntry])
  }

  const handleSubmit = (e: React.FormEvent) => {
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
              className="p-4 rounded-lg bg-white/5 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`project-${entry.id}`}>Project</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website Redesign</SelectItem>
                      <SelectItem value="mobile">Mobile App</SelectItem>
                      <SelectItem value="database">Database Migration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`date-${entry.id}`}>Date</Label>
                  <Input type="date" id={`date-${entry.id}`} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`hours-${entry.id}`}>Hours</Label>
                  <Input
                    type="number"
                    id={`hours-${entry.id}`}
                    min="0"
                    step="0.5"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`description-${entry.id}`}>Description</Label>
                  <Input
                    type="text"
                    id={`description-${entry.id}`}
                    placeholder="Brief description of work done"
                    required
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
              className="bg-white/50"
            >
              Add Entry
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
            >
              Submit Timesheet
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}