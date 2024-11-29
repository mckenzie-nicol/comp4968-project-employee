import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO, addDays, differenceInCalendarDays } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Project } from "./projects-list";

interface BurnDownData {
  date: string;
  remaining: number;
  ideal: number;
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
            The project does not have an end date, so the burn down chart cannot be generated.
          </div>
        </CardContent>
      </Card>
    );
  }

  const generateBurnDownData = (): BurnDownData[] => {
    const startDate = parseISO(project.start_date);
    const endDate = parseISO(project.end_date!);

    // Calculate total days including both start and end dates
    let totalDays = differenceInCalendarDays(endDate, startDate) + 1;
    if (totalDays <= 0) totalDays = 1; // Ensure at least one day

    const totalWork = project.estimated_hours;
    const data: BurnDownData[] = [];
    const dailyIdealBurn = totalWork / (totalDays - 1);

    let remainingWork = totalWork;

    for (let i = 0; i < totalDays; i++) {
      const date = addDays(startDate, i);

      // Ideal remaining work
      const ideal = totalWork - dailyIdealBurn * i;

      // Simulate actual remaining work with some variance
      if (i > 0) {
        const variance = (Math.random() * 0.2 - 0.1) * dailyIdealBurn; // ±10% variance
        const actualBurn = dailyIdealBurn + variance;
        remainingWork = Math.max(0, remainingWork - actualBurn);
      }

      data.push({
        date: format(date, "MMM dd"),
        remaining: Math.round(remainingWork),
        ideal: Math.round(ideal),
      });
    }

    return data;
  };

  const data = generateBurnDownData();

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
