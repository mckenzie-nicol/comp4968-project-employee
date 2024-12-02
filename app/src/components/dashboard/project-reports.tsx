import { useEffect, useState } from "react";
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
  Cell
} from 'recharts';
import refreshTokens from "@/actions/refresh-token";

interface Project {
  id: string;
  name: string;
  estimated_hours: number;
  approved_hours: number;
  start_date: string;
  end_date: string | null;
}

interface ProjectReport {
  projectName: string;
  estimatedHours: number;
  actualHours: number;
  remainingHours: number;
}

const API_URL = "https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com";

export function ProjectReports() {
  const [reports, setReports] = useState<ProjectReport[]>([]);

  const fetchProjectData = async () => {
    const tokenExpiry = parseInt(sessionStorage.getItem("tokenExpiry") || "0");
    if (Date.now() > tokenExpiry) {
      await refreshTokens();
    }
    const accessToken = sessionStorage.getItem("accessToken") || "";
    try { 
      const response = await fetch(`${API_URL}/test/project/manager`, {
        method: "POST",
        headers: {
          "Authorization": accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: sessionStorage.getItem("userId") }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Project Data Response:", data); // Log the response to verify the data

      const mappedReports = data.data.map((project: Project) => ({
        projectName: project.name,
        estimatedHours: project.estimated_hours,
        actualHours: Math.round(project.approved_hours * 100) / 100,
        remainingHours:  Math.round(Math.max(0, project.estimated_hours - project.approved_hours)) ,
      }));

      console.log("Mapped Reports:", mappedReports); // Log the mapped reports to verify
      return mappedReports;
    } catch (error) {
      console.error("Error fetching project data:", error);
      return [];
    }
  };

  useEffect(() => {
    async function loadReports() {
      const data = await fetchProjectData();
      setReports(data);
    }
    loadReports();
  }, []);

  const getCompletionColor = (actual: number, estimated: number) => {
    return actual > estimated ? '#ef4444' : '#45B7AF';
  };

  const getProgressBarColor = (actual: number, estimated: number) => {
    return actual > estimated 
      ? 'bg-gradient-to-r from-red-600 to-red-800'
      : 'bg-gradient-to-r from-black to-gray-800';
  };

  return (
    <Card className="bg-background border-0 min-w-screen flex flex-col h-full dark:shadow-gray-950">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Project Hours Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={reports}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis 
                dataKey="projectName" 
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
              <Bar 
                dataKey="estimatedHours" 
                name="Estimated Hours"
                fill="var(--custom-blue)" 
                opacity={0.8}
              />
              <Bar 
                dataKey="actualHours" 
                name="Actual Hours"
              >
                {reports.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={getCompletionColor(entry.actualHours, entry.estimatedHours)}
                    opacity={0.8}
                  />
                ))}
              </Bar>
              <Bar 
                dataKey="remainingHours" 
                name="Remaining Hours"
                fill="var(--custom-yellow)"
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 space-y-4">
          {reports.map((report) => {
            const completion = (report.actualHours / report.estimatedHours) * 100;
            const isOverallocated = completion > 100;
            
            return (
              <div 
                key={report.projectName}
                className="p-4 rounded-lg bg-white/5 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{report.projectName}</h3>
                  <span className={`text-sm ${isOverallocated ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                    {Math.round(completion)}% of Hour Budget
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Estimated</div>
                    <div className="font-medium">{report.estimatedHours}h</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Actual</div>
                    <div className={`font-medium ${isOverallocated ? 'text-red-500' : ''}`}>
                      {report.actualHours}h
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Remaining</div>
                    <div className="font-medium">{report.remainingHours}h</div>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressBarColor(report.actualHours, report.estimatedHours)}`}
                    style={{ 
                      width: `${Math.min(100, completion)}%` 
                    }}
                  />
                </div>
                {isOverallocated && (
                  <div className="text-sm text-red-500 mt-1">
                    ⚠️ Project is over allocated by {Math.round(completion - 100)}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}