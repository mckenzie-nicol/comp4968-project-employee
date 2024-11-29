import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components//ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ManagerApprovalLayout } from "@/components/project/manager-approval-layout";

const API_URL = "https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com";

const fetchProjectDetails = async () => {
  const accessToken = sessionStorage.getItem("accessToken") || "";
  try {
    const response = await fetch(`${API_URL}/test/project/manager/details`, {
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
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

type Project = {
  id: string;
  name: string;
  project_manager_id: string;
  start_date: string;
  estimated_hours: number;
  end_date: string;
};

export function ApproveTimesheets() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const projectsData = await fetchProjectDetails();
      setProjects(projectsData);
    };
    fetchData();
  }, []);

  return (
    <Card className="bg-white/10 border-0 min-h-screen">
      <CardHeader>
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="bg-white/50"
          >
            Back to Dashboard
          </Button>
          <CardTitle className="text-3xl font-bold text-gradient">
            Approve Timesheets
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label
            htmlFor="project-dropdown"
            className="block text-sm font-medium text-gray-700"
          >
            Select Project
          </label>
          <select
            id="project-dropdown"
            value={selectedProject || ""}
            className="w-full mt-1 block bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">-- Select Project --</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        {selectedProject && <ManagerApprovalLayout pid={selectedProject} />}
      </CardContent>
    </Card>
  );
}
