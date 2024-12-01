import { useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Users, PieChart, LogOut } from "lucide-react"
import { ProjectsList, type Project } from "./projects-list"
import { RecentTimesheets } from "./recent-timesheets"
import { TimesheetTable } from "../timesheet/timesheet-form"
import { BurnDownChart } from "./burn-down-chart"
import { ProjectReports } from "./project-reports"
import { EmployeeProjectHours } from "./employee-project-hours"
import { ProjectAllocation } from "./project-allocation"
import CreateProject from "@/components/project/create-project";
import { UserNotification } from "@/components/dashboard/user-notification";

interface DashboardPageProps {
  onSignOut?: () => void
  userRole?: 'worker' | 'project_manager'
}


export function DashboardPage({ onSignOut, userRole = 'project_manager' }: DashboardPageProps) {
  const [showTimesheetForm, setShowTimesheetForm] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeView, setActiveView] = useState<'overview' | 'allocation' | 'reports'>('overview')
  const notificationDate = useRef<Date | null>(null)

  const userId = sessionStorage.getItem("userId") ?? "5131efb8-4579-492d-97fd-49602e6ed513";

  const navigateToTimesheets = (start_date_of_the_week: Date) => {
    notificationDate.current = start_date_of_the_week
    setShowTimesheetForm(true)
  }

  if (showTimesheetForm) {
    return (
      <div className="p-6 mb-80">
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
        <TimesheetTable employee_id={userId} notificationDate={notificationDate}/>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <UserNotification navigateToTimesheets={navigateToTimesheets}/>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
          {userRole === 'worker' && (
            <Button 
            className="bg-gradient-to-r from-grey-800 via-gray-800 to-black"
            onClick={() => setShowTimesheetForm(true)}
          >
            New Timesheet
          </Button>
          )}
          {userRole === 'project_manager' && (
            <div className="flex gap-2">
              <Button
                variant={activeView === 'overview' ? 'default' : 'outline'}
                onClick={() => setActiveView('overview')}
                className={activeView === 'overview' ? 'bg-black' : 'bg-white/50'}
              >
                Overview
              </Button>
              <Button
                variant={activeView === 'reports' ? 'default' : 'outline'}
                onClick={() => setActiveView('reports')}
                className={activeView === 'reports' ? 'bg-black' : 'bg-white/50'}
              >
                Reports
              </Button>
              
              <Button
                variant={activeView === 'allocation' ? 'default' : 'outline'}
                onClick={() => setActiveView('allocation')}
                className={activeView === 'allocation' ? 'bg-black' : 'bg-white/50'}
              >
                Project Allocation
              </Button>
              <CreateProject />
            </div>
          )}
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

      {userRole === 'worker' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-gray-500">Currently assigned</p>
              </CardContent>
            </Card>
          </div>

          <EmployeeProjectHours />
          <RecentTimesheets />

      
        </div>
      ) : (
        <>
          {activeView === 'overview' && (
            <>
            

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProjectsList 
                  onProjectSelect={setSelectedProject}
                  selectedProjectId={selectedProject?.id ?? null}
                />
                <BurnDownChart project={selectedProject} />
              </div>

              <RecentTimesheets />
            </>
          )}

          {activeView === 'reports' && (
            <ProjectReports />
          )}

          {activeView === 'allocation' && (
            <ProjectAllocation />
          )}
        </>
      )}
    </div>
  )
}