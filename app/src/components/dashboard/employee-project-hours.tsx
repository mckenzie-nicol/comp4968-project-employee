import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";

interface HoursBreakdown {
  [day: string]: {
    [projectId: string]: number; // Hours worked for each project on that day
  };
}

interface ProjectDetails {
  projectId: string;
  projectName: string;
  color: string;
}

interface EmployeeProjectHoursProps {
  hoursBreakdown: HoursBreakdown;
  projects: ProjectDetails[];
}

interface WeeklyEntry {
  day: string;
  [key: string]: string | number;
}

export function EmployeeProjectHours({
  hoursBreakdown,
  projects,
}: EmployeeProjectHoursProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate the last 7 days of data for the bar graph
  const generateLast7DaysData = (): WeeklyEntry[] => {
    const data: WeeklyEntry[] = [];

    // Iterate over the last 7 days
    for (let i = 0; i < 7; i++) {
      const currentDate = subDays(selectedDate, i);
      const formattedDate = format(currentDate, "yyyy-MM-dd");
      const displayDate = format(currentDate, "MMM d");

      const entry: WeeklyEntry = { day: displayDate };

      projects.forEach((project) => {
        entry[project.projectId] =
          hoursBreakdown[formattedDate]?.[project.projectId] || 0;
      });

      data.push(entry);
    }

    return data.reverse(); // Reverse to show oldest dates first
  };

  const weeklyData = generateLast7DaysData();

  const navigateDay = (direction: "prev" | "next") => {
    setSelectedDate((current) =>
      direction === "prev" ? subDays(current, 7) : subDays(current, -7)
    );
  };

  return (
    <Card className="bg-white/10 border-0">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-gradient">
            My Project Hours
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigateDay("prev")}
              className="bg-white/50"
            >
              Previous 7 Days
            </Button>
            <Button
              variant="outline"
              onClick={() => navigateDay("next")}
              className="bg-white/50"
            >
              Next 7 Days
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200"
                />
                <XAxis
                  dataKey="day"
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
                <Legend />
                {projects.map((project) => (
                  <Bar
                    key={project.projectId}
                    dataKey={project.projectId}
                    fill={project.color}
                    opacity={0.8}
                    name={project.projectName}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
