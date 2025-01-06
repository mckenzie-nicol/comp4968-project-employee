// src/mockData/time_record.ts

export interface TimeRecord {
  id: string;             // e.g. "tr-001"
  timesheet_id: string;   // references timesheet.id
  date: string;           // ISO datetime
  day: string;            // e.g. "Monday"
  start_time: string | null;
  end_time: string | null;
}

export const mockTimeRecords: TimeRecord[] = [
  // Timesheet ts-001 (Devon)
  {
    id: "tr-001",
    timesheet_id: "ts-001",
    date: "2025-02-10T08:00:00Z",
    day: "Monday",
    start_time: "08:00",
    end_time: "16:00",
  },
  {
    id: "tr-002",
    timesheet_id: "ts-001",
    date: "2025-02-11T08:00:00Z",
    day: "Tuesday",
    start_time: "08:00",
    end_time: "16:00",
  },

  // Timesheet ts-002 (Emily)
  {
    id: "tr-003",
    timesheet_id: "ts-002",
    date: "2025-02-10T08:00:00Z",
    day: "Monday",
    start_time: "08:00",
    end_time: "16:00",
  },
  {
    id: "tr-004",
    timesheet_id: "ts-002",
    date: "2025-02-11T08:00:00Z",
    day: "Tuesday",
    start_time: "08:00",
    end_time: "16:00",
  },

  // Timesheet ts-003 (Harry)
  {
    id: "tr-005",
    timesheet_id: "ts-003",
    date: "2025-02-10T08:00:00Z",
    day: "Monday",
    start_time: "08:00",
    end_time: "16:00",
  },
  {
    id: "tr-006",
    timesheet_id: "ts-003",
    date: "2025-02-11T08:00:00Z",
    day: "Tuesday",
    start_time: "08:00",
    end_time: "16:00",
  },

  // Timesheet ts-004 (Frank)
  {
    id: "tr-007",
    timesheet_id: "ts-004",
    date: "2025-03-01T08:00:00Z",
    day: "Saturday",
    start_time: "08:00",
    end_time: "16:00",
  },
  {
    id: "tr-008",
    timesheet_id: "ts-004",
    date: "2025-03-02T08:00:00Z",
    day: "Sunday",
    start_time: "08:00",
    end_time: "16:00",
  },

  // Timesheet ts-005 (Gina)
  {
    id: "tr-009",
    timesheet_id: "ts-005",
    date: "2025-03-01T08:00:00Z",
    day: "Saturday",
    start_time: "08:00",
    end_time: "16:00",
  },
  {
    id: "tr-010",
    timesheet_id: "ts-005",
    date: "2025-03-02T08:00:00Z",
    day: "Sunday",
    start_time: "08:00",
    end_time: "16:00",
  },
];
