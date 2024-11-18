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
import { Timesheet } from "@/components/project/manager-approval-layout";

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
  trackedHours: (number | null)[];
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Tracked Hours</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timesheets.map((entry, index) => (
          <TableRow key={entry.id}>
            <TableCell>{`${entry.first_name} ${entry.last_name}`}</TableCell>
            <TableCell>{trackedHours[index]?.toFixed(2) ?? ""}</TableCell>
            <TableCell>{entry.approved ? "Approved" : "Open"}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => handleApproveClick(entry.id, entry.approved)}
                  disabled={isChangingStatus}
                >
                  {entry.approved ? "Unapprove" : "Approve"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRejectClick(entry.id)}
                  disabled={isChangingStatus}
                >
                  Reject
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export { ApprovalTable };
