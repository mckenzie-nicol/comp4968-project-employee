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
    email: "ksullivan33@my.bcit.ca",
    password: "Password123@",
    name: "Kate",
    role: "admin",
    organizationId: "org-1",
  },
  {
    email: "rhedieloo@my.bcit.ca",
    password: "Password123@",
    name: "Reza",
    role: "project_manager",
    organizationId: "org-1",
  },
  {
    email: "isu4@my.bcit.ca",
    password: "Password123@",
    name: "Grace",
    role: "project_manager",
    organizationId: "org-1",
  },
  {
    email: "mnicol11@my.bcit.ca",
    password: "Password123@",
    name: "Mckenzie",
    role: "worker",
    organizationId: "org-1",
  },
  {
    email: "czhang177@my.bcit.ca",
    password: "Password123@",
    name: "Charlie",
    role: "worker",
    organizationId: "org-1",
  },
  {
    email: "cchan535@my.bcit.ca",
    password: "Password123@",
    name: "Colin",
    role: "worker",
    organizationId: "org-1",
  },
  {
    email: "jcurrie42@my.bcit.ca",
    password: "Password123@",
    name: "Jake",
    role: "worker",
    organizationId: "org-1",
  },
  {
    email: "mho122@my.bcit.ca",
    password: "Password123@",
    name: "Marco",
    role: "worker",
    organizationId: "org-1",
  },
];
