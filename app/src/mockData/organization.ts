// src/mockData/organizations.ts

export interface Organization {
  id: string;
  organizationName: string;
}

// For demonstration, let's assume we only have these two
export const mockOrganizations: Organization[] = [
  {
    id: "org-1",
    organizationName: "Acme Inc.",
  },
  {
    id: "org-2",
    organizationName: "Next Gen Solutions",
  },
];
