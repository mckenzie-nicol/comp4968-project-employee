import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  format,
  parseISO,
  addDays,
  differenceInCalendarDays,
} from "date-fns";
import {
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Project } from "./projects-list";

interface ChartData {
  date: string;
  estimatedCumulative: number;
  approvedCumulative: number;
}

interface BurnDownChartProps {
  project: Project | null;
}

export function BurnDownChart({ project }: BurnDownChartProps) {
  if (!project) {
    return (
      <Card className="bg-white/10 border-4">
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
    );
  }

  if (!project.end_date) {
    return (
      <Card className="bg-white/10 border-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gradient">
            {project.name} - Burn Down
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center text-gray-500">
            The project does not have an end date, so the burn down chart cannot
            be generated.
          </div>
        </CardContent>
      </Card>
    );
  }

  const generateChartData = (): ChartData[] => {
    const startDate = parseISO(project.start_date);
    const endDate = parseISO(project.end_date!);
    const today = new Date();

    // Calculate total days including both start and end dates
    let totalDays = differenceInCalendarDays(endDate, startDate) + 1;
    if (totalDays <= 0) totalDays = 1; 

    const totalWork = project.estimated_hours;
    const approvedWork = project.approved_hours;

    const estimatedHoursPerDay = totalWork / totalDays;

    // Calculate days from start date up to today
    let daysUpToToday = differenceInCalendarDays(today, startDate) + 1;
    if (daysUpToToday < 0) daysUpToToday = 0;
    if (daysUpToToday > totalDays) daysUpToToday = totalDays;

    const approvedHoursPerDay =
      daysUpToToday > 0 ? approvedWork / daysUpToToday : 0;

    const data: ChartData[] = [];

    let cumulativeEstimated = 0;
    let cumulativeApproved = 0;

    for (let i = 0; i < totalDays; i++) {
      const date = addDays(startDate, i);

      cumulativeEstimated += estimatedHoursPerDay;

      if (differenceInCalendarDays(date, today) <= 0) {
        cumulativeApproved += approvedHoursPerDay;
      }

      data.push({
        date: format(date, "MMM dd"),
        estimatedCumulative: Math.round(cumulativeEstimated * 100) / 100,
        approvedCumulative: Math.round(cumulativeApproved * 100) / 100,
      });
    }

    return data;
  };

  const data = generateChartData();

  return (
    <Card className="bg-white/10 border-4">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gradient">
          {project.name} - Burn Down
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#666666" }}
                tickLine={{ stroke: "#666666" }}
              />
              <YAxis
                tick={{ fill: "#666666" }}
                tickLine={{ stroke: "#666666" }}
                label={{
                  value: "Hours",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#666666" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid #ccc",
                }}
              />
              <Line
                type="monotone"
                dataKey="estimatedCumulative"
                stroke="#0000FF"
                strokeWidth={2}
                name="Estimated Hours"
              />
              <Line
                type="monotone"
                dataKey="approvedCumulative"
                stroke="#FF0000"
                strokeWidth={2}
                name="Approved Hours"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold text-sm mb-2 text-gray-600">
            Project Metrics:
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Estimated Hours:</p>
              <p className="font-medium">{project.estimated_hours} hours</p>
            </div>
            <div>
              <p className="text-gray-500">Approved Hours:</p>
              <p className="font-medium">
                {Math.round(project.approved_hours * 100) / 100} hours
              </p>
            </div>
            <div>
              <p className="text-gray-500">Start Date:</p>
              <p className="font-medium">
                {format(parseISO(project.start_date), "MMMM d, yyyy")}
              </p>
            </div>
            <div>
              <p className="text-gray-500">End Date:</p>
              <p className="font-medium">
                {format(parseISO(project.end_date!), "MMMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
