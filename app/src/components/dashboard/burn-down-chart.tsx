import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, parseISO, subDays } from "date-fns"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { Project } from "./projects-list"

interface BurnDownData {
  date: string
  remaining: number
  ideal: number
}

interface BurnDownChartProps {
  project: Project | null
}

export function BurnDownChart({ project }: BurnDownChartProps) {
  if (!project) {
    return (
      <Card className="bg-white/10 border-0">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gradient">
            Project Burn Down
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center text-gray-500">
            Select a project to view its burn down chart
          </div>
        </CardContent>
      </Card>
    )
  }

  const generateBurnDownData = (): BurnDownData[] => {
    const startDate = parseISO(project.startDate)
    const totalDays = 14
    const totalWork = project.totalStoryPoints
    const data: BurnDownData[] = []
    const dailyIdealBurn = totalWork / totalDays

    for (let i = 0; i <= totalDays; i++) {
      const date = subDays(startDate, totalDays - i)
      const ideal = totalWork - (dailyIdealBurn * i)
      // Simulate actual remaining work with some variance
      const variance = Math.random() * 10 - 5
      const remaining = i === 0 ? totalWork : 
        Math.max(0, data[i-1].remaining - (dailyIdealBurn + variance))

      data.push({
        date: format(date, "MMM dd"),
        remaining: Math.round(remaining),
        ideal: Math.round(ideal),
      })
    }
    return data
  }

  const data = generateBurnDownData()

  return (
    <Card className="bg-white/10 border-0">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gradient">
          {project.name} - Burn Down
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="remaining" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000000" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ideal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#666666" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#666666" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#666666' }}
                tickLine={{ stroke: '#666666' }}
              />
              <YAxis
                tick={{ fill: '#666666' }}
                tickLine={{ stroke: '#666666' }}
                label={{ 
                  value: 'Story Points',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#666666' }
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #ccc',
                }}
              />
              <Area
                type="monotone"
                dataKey="remaining"
                stroke="#000000"
                fillOpacity={1}
                fill="url(#remaining)"
                strokeWidth={2}
                name="Actual Remaining"
              />
              <Area
                type="monotone"
                dataKey="ideal"
                stroke="#666666"
                fillOpacity={1}
                fill="url(#ideal)"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Ideal Burn"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="text-sm text-gray-600">
            <h4 className="font-semibold mb-2">Understanding the Burn Down Chart:</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-black"></div>
                <span><strong>Actual Progress</strong> - Shows the actual remaining work over time. If this line is above the ideal line, the project is behind schedule; if below, it's ahead of schedule.</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-gray-600 border-t-2 border-dashed"></div>
                <span><strong>Ideal Progress</strong> - Represents the perfect scenario where work is completed at a constant rate from start to finish.</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Total Story Points: {project.totalStoryPoints}</p>
            <p>Start Date: {format(parseISO(project.startDate), 'MMMM d, yyyy')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}