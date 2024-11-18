//timesheet page
import { TimesheetTable } from "@/components/timesheet/timesheet-form";

export default function Timesheet() {
  return (
    <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Timesheet</h1>
        </div>
        <TimesheetTable employee_id="5131efb8-4579-492d-97fd-49602e6ed513"/>
      </div>
  );
}