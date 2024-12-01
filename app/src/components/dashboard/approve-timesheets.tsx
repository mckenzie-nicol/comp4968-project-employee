import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components//ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { ManagerApprovalLayout } from "@/components/project/manager-approval-layout";
import refreshTokens from "@/actions/refresh-token";

const API_URL = "https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com";

const fetchProjectDetails = async () => {
  const tokenExpiry = parseInt(sessionStorage.getItem("tokenExpiry") || "0");
  if (Date.now() > tokenExpiry) {
    await refreshTokens();
  }
  const accessToken = sessionStorage.getItem("accessToken") || "";
  try {
    const response = await fetch(`${API_URL}/test/project/manager/details`, {
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
  const { state } = useLocation();

  console.log(state);

  useEffect(() => {
    const fetchData = async () => {
      const projectsData = await fetchProjectDetails();
      setProjects(projectsData);
    };
    setSelectedProject(state?.projectId || null);
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
        <div className="mb-6">
          <Select
            value={selectedProject || ""}
            onValueChange={setSelectedProject}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedProject && (
          <ManagerApprovalLayout
            pid={selectedProject}
            notificationDate={state?.notificationDate}
          />
        )}
      </CardContent>
    </Card>
  );
}
