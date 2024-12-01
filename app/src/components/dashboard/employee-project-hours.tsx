import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
}

interface DailyEntry {
  day: string;
  [key: string]: string | number;
}

export function EmployeeProjectHours({
  hoursBreakdown,
  projects,
}: EmployeeProjectHoursProps) {
  // Generate data for the past 14 days
  const generatePast14DaysData = (): DailyEntry[] => {
    const data: DailyEntry[] = [];

    const endDate = moment.utc().endOf("day");
    const startDate = endDate.clone().subtract(13, "days").startOf("day");

    for (
      let day = startDate.clone();
      day.isSameOrBefore(endDate);
      day.add(1, "day")
    ) {
      const formattedDate = day.format("YYYY-MM-DD");
      const displayDate = day.format("MMM D");

      const entry: DailyEntry = { day: displayDate };

      projects.forEach((project) => {
        entry[project.projectId] =
          hoursBreakdown[formattedDate]?.[project.projectId] || 0;
      });

      data.push(entry);
    }

    return data;
  };

  const dailyData = generatePast14DaysData();

  return (
    <Card className="bg-white/10 border-0">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-gradient">
            My Project Hours (Past 14 Days)
          </CardTitle>
          {/* Removed navigation buttons */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
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
