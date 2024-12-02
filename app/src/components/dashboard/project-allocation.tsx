
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import refreshTokens from "@/actions/refresh-token";
import { CalendarIcon, UsersIcon } from "lucide-react";

// Function to get all projects managed by the user
const getAllProjects = async () => {
  const tokenExpiry = parseInt(sessionStorage.getItem("tokenExpiry") || "0");
  if (Date.now() > tokenExpiry) {
    await refreshTokens();
  }

  const userId = sessionStorage.getItem("userId");
  const accessToken = sessionStorage.getItem("accessToken") || "";

  const body = {
    id: userId,
  };
  const result = await fetch(
    `https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/project/manager`,
    {
      method: "POST",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const data = await result.json();
  return data;
};

// Function to get workers for a specific project
const getWorkers = async (projectId: string) => {
  const tokenExpiry = parseInt(sessionStorage.getItem("tokenExpiry") || "0");
  if (Date.now() > tokenExpiry) {
    await refreshTokens();
  }

  const accessToken = sessionStorage.getItem("accessToken") || "";

  const result = await fetch(
    `https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/project/worker?projectId=${projectId}`,
    {
      method: "GET",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await result.json();
  return data;
};

// Main component
export function ProjectAllocation() {
  const [projects, setProjects] = useState<
    {
      id: string;
      name: string;
      estimated_hours?: number;
      approved_hours?: number;
      start_date?: string;
      end_date?: string;
      workers?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
      }[];
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects and workers on component mount
  useEffect(() => {
    const fetchProjectsAndWorkers = async () => {
      try {
        const projectsResponse = await getAllProjects();
        if (projectsResponse.status === "success") {
          const projectsData = projectsResponse.data;

          // Fetch workers for each project
          const projectsWithWorkersPromises = projectsData.map(
            async (project: {
              id: string;
              name: string;
              estimated_hours?: number;
              approved_hours?: number;
              start_date?: string;
              end_date?: string;
            }) => {
              const workersResponse = await getWorkers(project.id);
              if (
                workersResponse.message ===
                "Project workers retrieved successfully."
              ) {
                return {
                  ...project,
                  workers: workersResponse.users, // Adjust according to actual API response
                };
              } else {
                return {
                  ...project,
                  workers: [],
                };
              }
            }
          );

          const projectsWithWorkers = await Promise.all(
            projectsWithWorkersPromises
          );
          setProjects(projectsWithWorkers);
        } else {
          setError(projectsResponse.message || "Error fetching projects");
        }
      } catch (err) {
        console.error("Error fetching projects and workers:", err);
        setError("Error fetching projects and workers");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsAndWorkers();
  }, []);

  // Handle loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-xl font-semibold text-red-500">Error: {error}</div>
      </div>
    );
  }

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Project Allocations
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="bg-background shadow-lg rounded-lg overflow-hidden transform hover:-translate-y-1 hover:shadow-2xl transition duration-300 dark:border-none dark:shadow-gray-950"
          >
            <CardHeader className="bg-primary text-white p-6">
              <CardTitle className="text-2xl font-bold">
                {project.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-6 w-6 mr-2 text-blue-500" />
                  <span>
                    <strong>Start Date:</strong>{" "}
                    {formatDate(project.start_date || "")}
                  </span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-6 w-6 mr-2 text-purple-500" />
                  <span>
                    <strong>End Date:</strong>{" "}
                    {formatDate(project.end_date || "")}
                  </span>
                </div>
                <div className="flex items-center ">
                  <span className="font-medium">Estimated Hours:</span>
                  <span className="ml-2">
                    {project.estimated_hours || "N/A"}
                  </span>
                </div>
                <div className="flex items-center ">
                  <span className="font-medium">Approved Hours:</span>
                  <span className="ml-2">{project.approved_hours || 0}</span>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Workers</h3>
                  {project.workers && project.workers.length > 0 ? (
                    <ul className="space-y-3">
                      {project.workers.map((worker) => (
                        <li key={worker.id} className="flex items-center">
                          <UsersIcon className="h-6 w-6 mr-2 text-green-500" />
                          <span className="">
                            {worker.first_name} {worker.last_name} (
                            {worker.email})
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No workers assigned to this project.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
