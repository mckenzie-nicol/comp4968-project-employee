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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Timesheet,
  HoursRecord,
  ApprovedStatus,
} from "@/components/project/manager-approval-layout";
import { Check, Undo, X, ClockAlert, CircleCheckBig } from "lucide-react";
import { differenceInMinutes } from "date-fns";

const API_URL = "https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com";

const updateApproveStatus = async (id: string, approved: ApprovedStatus) => {
  try {
    const response = await fetch(`${API_URL}/test/timesheet/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        approved: approved !== "approved" ? "approved" : "pending",
        approved_date:
          approved !== "approved" ? new Date().toISOString() : null,
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [entryToReject, setEntryToReject] = useState<string>("");

  const handleApproveClick = async (id: string, approved: ApprovedStatus) => {
    setIsChangingStatus(true);
    await updateApproveStatus(id, approved);
    refetchData();
    setIsChangingStatus(false);
  };

  const handleRejectClick = async () => {
    setIsChangingStatus(true);
    await updateSubmissionStatus(entryToReject!);
    refetchData();
    setIsChangingStatus(false);
    setIsDialogOpen(false);
  };

  console.log(trackedHours);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-center">Hours To Add</TableHead>
            <TableHead className="text-center">Tracked Hours</TableHead>
            <TableHead className="text-center">Regular Hours</TableHead>
            <TableHead className="text-center">Overtime Hours</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Submitted On</TableHead>
            <TableHead className="text-center">Approved On</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timesheets.map((entry, index) => (
            <TableRow key={entry.id}>
              <TableCell>{`${entry.first_name} ${entry.last_name}`}</TableCell>
              <TableCell className="text-center">
                {entry.status !== "approved"
                  ? Object.values(entry.hours)
                      .reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0)
                      .toFixed(2)
                  : ""}
              </TableCell>
              <TableCell className="text-center">
                {trackedHours[index]
                  ?.map((timeRecord: HoursRecord) => {
                    const start = new Date(
                      `2024-01-01T${timeRecord.start_time}:00`
                    );
                    const end = new Date(
                      `2024-01-01T${timeRecord.end_time}:00`
                    );
                    return differenceInMinutes(end, start) / 60;
                  })
                  .reduce((acc: number, curr: number) => acc + curr, 0)
                  .toFixed(2) ?? ""}
              </TableCell>
              <TableCell className="text-center">
                {trackedHours[index]
                  ?.map((timeRecord: HoursRecord) => {
                    const start = new Date(
                      `2024-01-01T${timeRecord.start_time}:00`
                    );
                    const end = new Date(
                      `2024-01-01T${timeRecord.end_time}:00`
                    );
                    const differenceHours =
                      differenceInMinutes(end, start) / 60;
                    return differenceHours > 8 ? 8 : differenceHours;
                  })
                  .reduce((acc: number, curr: number) => acc + curr, 0)
                  .toFixed(2) ?? ""}
              </TableCell>
              <TableCell className="text-center">
                {trackedHours[index]
                  ?.map((timeRecord: HoursRecord) => {
                    let start = new Date(
                      `2024-01-01T${timeRecord.start_time}:00`
                    );
                    const end = new Date(
                      `2024-01-01T${timeRecord.end_time}:00`
                    );
                    const differenceHours =
                      differenceInMinutes(end, start) / 60;
                    return differenceHours > 8 ? differenceHours - 8 : 0;
                  })
                  .reduce((acc: number, curr: number) => acc + curr, 0)
                  .toFixed(2) ?? ""}
              </TableCell>
              <TableCell>
                {entry.status === "approved" ? (
                  <CircleCheckBig className="mx-auto" />
                ) : (
                  <ClockAlert className="mx-auto" />
                )}
              </TableCell>
              <TableCell className="text-center">
                {new Date(entry.submission_date).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                })}
              </TableCell>
              <TableCell className="text-center">
                {entry.approved_date
                  ? new Date(entry.approved_date).toLocaleDateString("en-US")
                  : ""}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3 justify-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleApproveClick(entry.id, entry.status)}
                    disabled={isChangingStatus}
                    size="icon"
                  >
                    {entry.status === "approved" ? (
                      <Undo className="h-4 w-4" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsDialogOpen(true);
                      setEntryToReject(entry.id);
                    }}
                    disabled={isChangingStatus || entry.status === "approved"}
                    size="icon"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Rejection</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to reject this timesheet?</div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isChangingStatus}
              onClick={() => handleRejectClick()}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { ApprovalTable };
