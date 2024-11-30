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
import moment from "moment";

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
  currentDate: moment.Moment;
}

interface WeeklyEntry {
  day: string;
  [key: string]: string | number;
}

export function EmployeeProjectHours({
  hoursBreakdown,
  projects,
  currentDate,
}: EmployeeProjectHoursProps) {
  const [selectedDate, setSelectedDate] = useState(currentDate.clone());

  // Generate data for the selected week
  const generateWeeklyData = (): WeeklyEntry[] => {
    const data: WeeklyEntry[] = [];

    const weekStart = selectedDate.clone().startOf("isoWeek");
    const weekEnd = selectedDate.clone().endOf("isoWeek");

    for (
      let day = weekStart.clone();
      day.isSameOrBefore(weekEnd);
      day.add(1, "day")
    ) {
      const formattedDate = day.format("YYYY-MM-DD");
      const displayDate = day.format("MMM D");

      const entry: WeeklyEntry = { day: displayDate };

      projects.forEach((project) => {
        entry[project.projectId] =
          hoursBreakdown[formattedDate]?.[project.projectId] || 0;
      });

      data.push(entry);
    }

    return data;
  };

  const weeklyData = generateWeeklyData();

  const navigateWeek = (direction: "prev" | "next") => {
    setSelectedDate((current) =>
      direction === "prev"
        ? current.clone().subtract(1, "week")
        : current.clone().add(1, "week")
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
              onClick={() => navigateWeek("prev")}
              className="bg-white/50"
            >
              Previous Week
            </Button>
            <Button
              variant="outline"
              onClick={() => navigateWeek("next")}
              className="bg-white/50"
            >
              Next Week
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
