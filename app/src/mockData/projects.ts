// src/mockData/projects.ts
// Each project can have an array of timesheets.

export interface MockProject {
  project_id: string;
  project_name: string;
  timesheets: Timesheet[];
}

import { Timesheet } from "@/components/dashboard/dashboard-page";
import { mockTimesheets } from "./timesheets";

// Example: one project with the same timesheets
export const mockProjects: MockProject[] = [
  {
    project_id: "proj-1",
    project_name: "Internal Web App",
    timesheets: mockTimesheets, 
  },
  {
    project_id: "proj-2",
    project_name: "Client Integration",
    timesheets: [], // no timesheets yet
  },
];
