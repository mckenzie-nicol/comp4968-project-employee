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
    email: "alice@company.com",
    password: "Password123@",
    name: "Alice",
    role: "admin",
    organizationId: "org-1",
  },
  {
    email: "bob@company.com",
    password: "Password123@",
    name: "Bob",
    role: "project_manager",
    organizationId: "org-1",
  },
  {
    email: "charlie@company.com",
    password: "Password123@",
    name: "Charlie",
    role: "project_manager",
    organizationId: "org-1",
  },
  {
    email: "devon@company.com",
    password: "Password123@",
    name: "Devon",
    role: "worker",
    organizationId: "org-1",
  },
  {
    email: "emily@company.com",
    password: "Password123@",
    name: "Emily",
    role: "worker",
    organizationId: "org-1",
  },
  {
    email: "frank@company.com",
    password: "Password123@",
    name: "Frank",
    role: "worker",
    organizationId: "org-1",
  },
  {
    email: "gina@company.com",
    password: "Password123@",
    name: "Gina",
    role: "worker",
    organizationId: "org-1",
  },
  {
    email: "harry@company.com",
    password: "Password123@",
    name: "Harry",
    role: "worker",
    organizationId: "org-1",
  },
];
