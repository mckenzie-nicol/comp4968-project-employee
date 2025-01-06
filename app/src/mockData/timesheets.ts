// src/mockData/timesheet.ts

export interface Timesheet {
  id: string;                 // e.g. "ts-001"
  project_id: string;         // references project.id
  employee_id: string;        // in this mock, worker's email
  start_date_of_the_week: string;
  submission_date: string;    // ISO date/time
  status: string | null;      // e.g. "approved", "pending", "rejected"
  approved_date: string | null;
}

export const mockTimesheets: Timesheet[] = [
  // Devon, p1
  {
    id: "ts-001",
    project_id: "proj-internal-web-app",
    employee_id: "devon@company.com",
    start_date_of_the_week: "2025-02-10",
    submission_date: "2025-02-14T12:00:00Z",
    status: "approved",
    approved_date: "2025-02-15T10:00:00Z",
  },
  // Emily, p1
  {
    id: "ts-002",
    project_id: "proj-internal-web-app",
    employee_id: "emily@company.com",
    start_date_of_the_week: "2025-02-10",
    submission_date: "2025-02-14T12:00:00Z",
    status: "approved",
    approved_date: "2025-02-15T10:00:00Z",
  },
  // Harry, p1
  {
    id: "ts-003",
    project_id: "proj-internal-web-app",
    employee_id: "harry@company.com",
    start_date_of_the_week: "2025-02-10",
    submission_date: "2025-02-14T12:00:00Z",
    status: "pending",
    approved_date: null,
  },

  // Frank, p2
  {
    id: "ts-004",
    project_id: "proj-mobile-integration",
    employee_id: "frank@company.com",
    start_date_of_the_week: "2025-03-01",
    submission_date: "2025-03-05T12:00:00Z",
    status: "approved",
    approved_date: "2025-03-06T11:00:00Z",
  },
  // Gina, p2
  {
    id: "ts-005",
    project_id: "proj-mobile-integration",
    employee_id: "gina@company.com",
    start_date_of_the_week: "2025-03-01",
    submission_date: "2025-03-05T12:00:00Z",
    status: "rejected",
    approved_date: null,
  },
];
