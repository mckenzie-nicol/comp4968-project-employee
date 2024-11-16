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

function ApprovalTable({
  trackedHours,
  timesheets,
  fetchData,
}: {
  trackedHours: number[];
  timesheets: Timesheet[];
  fetchData: () => void;
}) {
  const updateApproveStatus = async (id: string, approved: boolean) => {
    try {
      const response = await fetch(`${API_URL}/test/timesheet`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          project_id: null,
          employee_id: null,
          start_date_of_the_week: null,
          submission_date: null,
          approved: !approved,
          approved_by: null,
          approved_date: null,
        }),
      });
      console.log(response);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      fetchData();
    }
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
              <Button
                variant="outline"
                onClick={() => {
                  updateApproveStatus(entry.id, entry.approved);
                }}
              >
                {entry.approved ? "Unapprove" : "Approve"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export { ApprovalTable };
