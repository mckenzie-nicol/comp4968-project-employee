//timesheet page
import { TimesheetTable } from "@/components/timesheet/timesheet-form";
import { useRef } from "react";

// get userId from session storage
const userId = sessionStorage.getItem("userId") || "";

export default function Timesheet() {
  const notificationDate = useRef<Date | null>(null); 

  return (
    <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Timesheet</h1>
        </div>
        <TimesheetTable employee_id={userId} notificationDate={notificationDate}/>
    </div>
  );
}