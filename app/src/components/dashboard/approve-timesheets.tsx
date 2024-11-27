import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components//ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ApproveTimesheets() {
  const projects = [
    { id: 1, name: "Website Redesign" },
    { id: 2, name: "Mobile App Development" },
    { id: 3, name: "Database Migration" },
  ];

  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const navigate = useNavigate();

  const timesheets: { [key: number]: { id: number; employee: string; week: string; hours: number; }[] } = {
    1: [
      { id: 1, employee: "Alice", week: "Nov 20 - Nov 26", hours: 40 },
      { id: 2, employee: "Bob", week: "Nov 20 - Nov 26", hours: 38.5 },
    ],
    2: [
      { id: 3, employee: "Eve", week: "Nov 20 - Nov 26", hours: 35 },
    ],
    3: [],
  };

  const projectTimesheets = selectedProject ? timesheets[selectedProject] || [] : [];

  const handleApprove = (timesheetId: number) => {
    console.log("Approve timesheet:", timesheetId);
    // Add API or state update logic here
  };

  return (
    <Card className="bg-white/10 border-0 min-h-screen">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gradient">
          Approve Timesheets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label htmlFor="project-dropdown" className="block text-sm font-medium text-gray-700">
            Select Project
          </label>
          <select
            id="project-dropdown"
            value={selectedProject || ""}
            className="w-full mt-1 block bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={(e) => setSelectedProject(Number(e.target.value))}
          >
            <option value="">-- Select Project --</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        {selectedProject && (
          <>
            {projectTimesheets.length > 0 ? (
              <table className="min-w-full bg-white shadow-md rounded-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4">Employee</th>
                    <th className="py-2 px-4">Week</th>
                    <th className="py-2 px-4">Hours</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projectTimesheets.map((timesheet: { id: number; employee: string; week: string; hours: number }) => (
                    <tr key={timesheet.id}>
                      <td className="py-2 px-4">{timesheet.employee}</td>
                      <td className="py-2 px-4">{timesheet.week}</td>
                      <td className="py-2 px-4">{timesheet.hours}</td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleApprove(timesheet.id)}
                          aria-label={`Approve timesheet for ${timesheet.employee}`}
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 focus:ring focus:ring-green-300"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No timesheets available for the selected project.
              </p>
            )}
          </>
        )}
      </CardContent>
      <div className="p-4">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="bg-white/50 hover:bg-white/80"
        >
          Back to Dashboard
        </Button>
      </div>
    </Card>
  );
}
