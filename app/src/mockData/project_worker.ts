// src/mockData/project_worker.ts

export interface ProjectWorker {
  id: string;         // e.g. "pw-001"
  project_id: string; // Must match a project.id
  worker_id: string;  // We'll store the worker's email
  created_at: string;
}

// We'll assign some workers to each project:
export const mockProjectWorkers: ProjectWorker[] = [
  {
    id: "pw-001",
    project_id: "proj-internal-web-app",
    worker_id: "devon@company.com",
    created_at: "2025-01-20T09:00:00Z",
  },
  {
    id: "pw-002",
    project_id: "proj-internal-web-app",
    worker_id: "emily@company.com",
    created_at: "2025-01-20T09:00:00Z",
  },
  {
    id: "pw-003",
    project_id: "proj-internal-web-app",
    worker_id: "harry@company.com",
    created_at: "2025-01-20T09:00:00Z",
  },
  {
    id: "pw-004",
    project_id: "proj-mobile-integration",
    worker_id: "frank@company.com",
    created_at: "2025-01-25T09:00:00Z",
  },
  {
    id: "pw-005",
    project_id: "proj-mobile-integration",
    worker_id: "gina@company.com",
    created_at: "2025-01-25T09:00:00Z",
  },
];
