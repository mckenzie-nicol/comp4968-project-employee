import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Timesheet,
  HoursRecord,
} from "@/components/project/manager-approval-layout";
import { Check, Undo, X } from "lucide-react";
import { differenceInMinutes } from "date-fns";

const API_URL = "https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com";

const updateApproveStatus = async (id: string, approved: boolean) => {
  try {
    const response = await fetch(`${API_URL}/test/timesheet/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        approved: !approved,
        approved_date: !approved ? new Date().toISOString() : null,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

const updateSubmissionStatus = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/test/timesheet/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

function ApprovalTable({
  trackedHours,
  timesheets,
  refetchData,
}: {
  trackedHours: (HoursRecord[] | null)[];
  timesheets: Timesheet[];
  refetchData: () => void;
}) {
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const handleApproveClick = async (id: string, approved: boolean) => {
    setIsChangingStatus(true);
    await updateApproveStatus(id, approved);
    refetchData();
    setIsChangingStatus(false);
  };

  const handleRejectClick = async (id: string) => {
    setIsChangingStatus(true);
    await updateSubmissionStatus(id);
    refetchData();
    setIsChangingStatus(false);
  };

  console.log(trackedHours);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Hours To Add</TableHead>
          <TableHead>Tracked Hours</TableHead>
          <TableHead>Regular Hours</TableHead>
          <TableHead>Overtime Hours</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timesheets.map((entry, index) => (
          <TableRow key={entry.id}>
            <TableCell>{`${entry.first_name} ${entry.last_name}`}</TableCell>
            <TableCell>
              {!entry.approved
                ? Object.values(entry.hours)
                    .reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0)
                    .toFixed(2)
                : ""}
            </TableCell>
            <TableCell>
              {trackedHours[index]
                ?.map((timeRecord: HoursRecord) => {
                  const start = new Date(
                    `2024-01-01T${timeRecord.start_time}:00`
                  );
                  const end = new Date(`2024-01-01T${timeRecord.end_time}:00`);
                  return differenceInMinutes(end, start) / 60;
                })
                .reduce((acc: number, curr: number) => acc + curr, 0)
                .toFixed(2) ?? ""}
            </TableCell>
            <TableCell>
              {trackedHours[index]
                ?.map((timeRecord: HoursRecord) => {
                  const start = new Date(
                    `2024-01-01T${timeRecord.start_time}:00`
                  );
                  let end = new Date(`2024-01-01T${timeRecord.end_time}:00`);
                  if (end >= new Date(`2024-01-01T17:00:00`)) {
                    end = new Date(`2024-01-01T17:00:00`);
                  }
                  return differenceInMinutes(end, start) / 60;
                })
                .reduce((acc: number, curr: number) => acc + curr, 0)
                .toFixed(2) ?? ""}
            </TableCell>
            <TableCell>
              {trackedHours[index]
                ?.filter((timeRecord: HoursRecord) => {
                  const end = new Date(`2024-01-01T${timeRecord.end_time}:00`);
                  return end >= new Date(`2024-01-01T17:00:00`);
                })
                .map((timeRecord: HoursRecord) => {
                  const start = new Date(`2024-01-01T17:00:00`);
                  const end = new Date(`2024-01-01T${timeRecord.end_time}:00`);
                  return differenceInMinutes(end, start) / 60;
                })
                .reduce((acc: number, curr: number) => acc + curr, 0)
                .toFixed(2) ?? ""}
            </TableCell>
            <TableCell>{entry.approved ? "Approved" : "Open"}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => handleApproveClick(entry.id, entry.approved)}
                  disabled={isChangingStatus}
                  size="icon"
                >
                  {entry.approved ? (
                    <Undo className="h-4 w-4" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleRejectClick(entry.id)}
                  disabled={isChangingStatus || entry.approved}
                  size="icon"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <div className="h-screen"></div>
    </Table>
  );
}

export { ApprovalTable };
