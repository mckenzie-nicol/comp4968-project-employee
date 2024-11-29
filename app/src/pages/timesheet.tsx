//timesheet page
import { TimesheetTable } from "@/components/timesheet/timesheet-form";

// get userId from session storage
const userId = sessionStorage.getItem("userId") || "";

export default function Timesheet() {
  return (
    <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Timesheet</h1>
        </div>
        <TimesheetTable employee_id={userId}/>
    </div>
  );
}