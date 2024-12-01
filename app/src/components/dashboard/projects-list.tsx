import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import refreshTokens from "@/actions/refresh-token";

export interface Project {
  id: string;
  name: string;
  progress: number;
  estimated_hours: number;
  approved_hours: number;
  start_date: string;
  end_date: string | null;
  overEstimated: boolean; // New property
}

interface ProjectsListProps {
  onProjectSelect: (project: Project) => void;
  selectedProjectId: string | null;
}

const API_URL = "https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com";

export function ProjectsList({
  onProjectSelect,
  selectedProjectId,
}: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([]);

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
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: sessionStorage.getItem("userId") }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Project Data Response:", data);

      const mappedProjects = data.data.map((project: any) => {
        const progress =
          Math.round((project.approved_hours / project.estimated_hours) * 100);
        return {
          id: project.id,
          name: project.name,
          estimated_hours: project.estimated_hours,
          approved_hours: Math.round(project.approved_hours * 100) / 100,
          start_date: project.start_date,
          end_date: project.end_date,
          progress,
          overEstimated: project.approved_hours > project.estimated_hours, // New property
        };
      });

      console.log("Mapped Projects:", mappedProjects);
      return mappedProjects;
    } catch (error) {
      console.error("Error fetching project data:", error);
      return [];
    }
  };

  useEffect(() => {
    async function loadProjects() {
      const data = await fetchProjectData();
      setProjects(data);
    }
    loadProjects();
  }, []);

  return (
    <Card className="bg-white/10 border-4">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gradient">
          Active Projects
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors cursor-pointer ${
                selectedProjectId === project.id
                  ? "bg-black/10 hover:bg-black/15"
                  : "bg-white/5 hover:bg-white/10"
              }`}
              onClick={() => onProjectSelect(project)}
            >
              <div>
                <h3
                  className={`font-medium ${
                    project.overEstimated ? "text-gray-800" : "text-gray-800"
                  }`}
                >
                  {project.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">
                    Estimated Hours: {project.estimated_hours}
                  </span>
                  <span className="text-sm text-gray-400">•</span>
                  <span
                    className={`text-sm ${
                      project.overEstimated ? "text-gray-800" : "text-gray-500"
                    }`}
                  >
                    Approved Hours: {project.approved_hours}
                  </span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    Start Date:{" "}
                    {new Date(project.start_date).toLocaleDateString()}
                  </span>
                  {project.end_date && (
                    <>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500">
                        End Date:{" "}
                        {new Date(project.end_date).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${Math.min(project.progress, 100)}%`,
                        backgroundColor: project.overEstimated
                          ? "#DC2626" 
                          : "linear-gradient(to right, black, #2D3748)",
                      }}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      project.overEstimated ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    {project.progress}%
                  </span>
                  {project.overEstimated && (
                    <span className="text-sm font-medium text-red-600">
                      Overbudget!
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gradient">
              Estimated Hours Distribution:
            </CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <defs>
                <linearGradient id="pieGradient1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#666666" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#000000" stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="pieGradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#999999" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#555555" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <Pie
                data={projects}
                dataKey="estimated_hours"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                stroke="none"
                label={({ name, percent }) =>
                  `${name} (${Math.round(percent * 100)}%)`
                }
              >
                {projects.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#pieGradient${index % 2 === 0 ? 1 : 2})`}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid #ccc",
                  color: "#666666",
                }}
              />
              <Legend
                wrapperStyle={{ color: "#666666" }}
                formatter={(value) => (
                  <span style={{ color: "#666666" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
