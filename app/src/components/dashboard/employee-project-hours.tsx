import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { startOfWeek, endOfWeek, format, addWeeks, subWeeks } from 'date-fns'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ProjectHours {
  projectName: string
  hours: number
  color: string
}

interface WeeklyData {
  week: string
  [key: string]: string | number // For dynamic project names
}

export function EmployeeProjectHours() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  // Sample data - In a real app, this would come from an API
  const projects: ProjectHours[] = [
    { projectName: "Website Redesign", hours: 20, color: "#000000" },
    { projectName: "Mobile App", hours: 15, color: "#666666" }
  ]

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })

  const generateWeeklyData = () => {
    const data: WeeklyData[] = []
    for (let i = -3; i <= 0; i++) {
      const weekStart = startOfWeek(addWeeks(selectedDate, i), { weekStartsOn: 1 })
      const entry: WeeklyData = {
        week: format(weekStart, 'MMM d')
      }
      projects.forEach(project => {
        // Simulate some variation in hours
        const variation = Math.random() * 5 - 2.5
        entry[project.projectName] = Math.max(0, project.hours + variation)
      })
      data.push(entry)
    }
    return data
  }

  const weeklyData = generateWeeklyData()

  const navigateWeek = (direction: 'prev' | 'next') => {
    setSelectedDate(current => 
      direction === 'prev' ? subWeeks(current, 1) : addWeeks(current, 1)
    )
  }

  return (
    <Card className="bg-white/10 border-0">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-gradient">
            My Project Hours
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="week-select">Week:</Label>
              <Input
                id="week-select"
                type="date"
                value={format(weekStart, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-40 bg-white/50"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigateWeek('prev')}
                className="bg-white/50"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => navigateWeek('next')}
                className="bg-white/50"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis 
                  dataKey="week"
                  tick={{ fill: '#666666' }}
                  tickLine={{ stroke: '#666666' }}
                />
                <YAxis
                  tick={{ fill: '#666666' }}
                  tickLine={{ stroke: '#666666' }}
                  label={{ 
                    value: 'Hours',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fill: '#666666' }
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ccc'
                  }}
                />
                <Legend />
                {projects.map((project) => (
                  <Bar
                    key={project.projectName}
                    dataKey={project.projectName}
                    fill={project.color}
                    opacity={0.8}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-4">
            {projects.map((project) => (
              <div
                key={project.projectName}
                className="p-4 rounded-lg bg-white/5 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{project.projectName}</h3>
                  <span className="text-sm text-gray-500">
                    {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">This Week</div>
                    <div className="font-medium">{project.hours}h</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Project Total</div>
                    <div className="font-medium">
                      {(project.hours * 4).toFixed(1)}h
                    </div>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-black to-gray-800"
                    style={{ width: '65%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}