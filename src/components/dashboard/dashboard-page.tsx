import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Users, PieChart, LogOut } from "lucide-react"
import { ProjectsList } from "./projects-list"
import { RecentTimesheets } from "./recent-timesheets"
import { TimesheetForm } from "../timesheet/timesheet-form"

interface DashboardPageProps {
  onSignOut?: () => void
}

export function DashboardPage({ onSignOut }: DashboardPageProps) {
  const [showTimesheetForm, setShowTimesheetForm] = useState(false)

  if (showTimesheetForm) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => setShowTimesheetForm(false)}
            className="bg-white/50"
          >
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gradient">New Timesheet</h1>
        </div>
        <TimesheetForm onSubmit={() => setShowTimesheetForm(false)} />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
          <Button 
            className="bg-gradient-to-r from-black via-gray-800 to-black"
            onClick={() => setShowTimesheetForm(true)}
          >
            New Timesheet
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={onSignOut}
          className="bg-white/50 hover:bg-white/80"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/10 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Hours This Week
            </CardTitle>
            <Clock className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.5</div>
            <p className="text-xs text-gray-500">+2.5 from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Projects
            </CardTitle>
            <PieChart className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-gray-500">Across 2 teams</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Team Members
            </CardTitle>
            <Users className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500">In your projects</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Next Review
            </CardTitle>
            <Calendar className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2d</div>
            <p className="text-xs text-gray-500">Friday, 3PM</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectsList />
        <RecentTimesheets />
      </div>
    </div>
  )
}