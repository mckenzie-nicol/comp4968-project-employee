// src/mockData/project.ts

export interface Project {
  id: string;                 // e.g. "proj-internal-web-app"
  name: string;
  project_manager_id: string; // In this mock, store the PM's email
  start_date: string;         // e.g. "2025-01-15T09:00:00Z"
  estimated_hours: number;
  end_date: string;           // e.g. "2025-04-15T17:00:00Z"
}

// We'll create two projects, managed by Bob and Charlie
export const mockProjects: Project[] = [
  {
    id: "proj-internal-web-app",
    name: "Internal Web App",
    project_manager_id: "bob@company.com", // Bob is a PM
    start_date: "2025-01-15T09:00:00Z",
    estimated_hours: 300,
    end_date: "2025-04-15T17:00:00Z",
  },
  {
    id: "proj-mobile-integration",
    name: "Mobile Integration",
    project_manager_id: "charlie@company.com", // Charlie is a PM
    start_date: "2025-02-01T09:00:00Z",
    estimated_hours: 200,
    end_date: "2025-05-01T17:00:00Z",
  },
];
