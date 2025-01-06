// src/mockData/timesheets.ts
// Example: a single worker's timesheets, each with time_records
// You can expand as needed.

import { Timesheet } from "@/components/dashboard/dashboard-page";

export const mockTimesheets: Timesheet[] = [
  {
    timesheet_id: "ts-001",
    submission_date: "2025-11-30T00:00:00.000Z",
    status: "approved",
    time_records: [
      {
        id: "tr-001",
        timesheet_id: "ts-001",
        date: "2025-11-20T00:00:00.000Z",
        day: "Thursday",
        start_time: "08:00",
        end_time: "16:00",
      },
      {
        id: "tr-002",
        timesheet_id: "ts-001",
        date: "2025-11-21T00:00:00.000Z",
        day: "Friday",
        start_time: "08:00",
        end_time: "17:00",
      },
      // etc.
    ],
  },
  // Add more timesheets if desired
];
