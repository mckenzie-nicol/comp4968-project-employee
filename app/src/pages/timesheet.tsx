//timesheet page
import { TimesheetTable } from "@/components/timesheet/timesheet-form";

export default function Timesheet() {
  return (
    <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Timesheet</h1>
        </div>
        <TimesheetTable employee_id="9e2bff44-e3d1-494f-8d82-b8561e5bf095"/>
      </div>
  );
}