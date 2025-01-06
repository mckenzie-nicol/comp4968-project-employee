// src/mockData/users.ts
export interface User {
  email: string;
  password: string;
  role: "admin" | "worker" | "project_manager";
  organizationId?: string;
  name: string;
}

// Example mock data for demonstration
export const mockUsers: User[] = [
  {
    email: "ksulli@example.ca",
    password: "Password123@",
    name: "Kate",
    role: "admin",
    organizationId: "org-1",
  },
  {
    email: "rhedi@example.ca",
    password: "Password123@",
    name: "Reza",
    role: "project_manager",
    organizationId: "org-1",
  },
  {
    email: "isuzuuu@example.ca",
    password: "Password123@",
    name: "Grace",
    role: "project_manager",
    organizationId: "org-1",
  },
  {
    email: "mnico@example.ca",
    password: "Password123@",
    name: "Mckenzie",
    role: "worker",
    organizationId: "org-1",
  },
  {
    email: "czha@example.ca",
    password: "Password123@",
    name: "Charlie",
    role: "worker",
    organizationId: "org-1",
  },
  {
    email: "ccha@example.ca",
    password: "Password123@",
    name: "Colin",
    role: "worker",
    organizationId: "org-1",
  },
  {
    email: "jcur@example.ca",
    password: "Password123@",
    name: "Jake",
    role: "worker",
    organizationId: "org-1",
  },
  {
    email: "mhoooo@example.ca",
    password: "Password123@",
    name: "Marco",
    role: "worker",
    organizationId: "org-1",
  },
];
