// src/utils/localStorageUtils.ts
import { User } from "@/mockData/users";

export function getLocalUsers(): User[] {
  const data = localStorage.getItem("timesheetUsers");
  if (!data) {
    return [];
  }
  return JSON.parse(data) as User[];
}

export function setLocalUsers(users: User[]) {
  localStorage.setItem("timesheetUsers", JSON.stringify(users));
}

// Optional: If you want to store org data, you could define similar functions:
// export function getLocalOrgs(): Org[] { ... }
// export function setLocalOrgs(orgs: Org[]) { ... }
