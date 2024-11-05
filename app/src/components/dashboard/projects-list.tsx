import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProjectsList() {
  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      progress: 65,
      hours: 24.5,
      status: "In Progress",
    },
    {
      id: 2,
      name: "Mobile App Development",
      progress: 32,
      hours: 12.5,
      status: "In Progress",
    },
    {
      id: 3,
      name: "Database Migration",
      progress: 89,
      hours: 42.0,
      status: "Review",
    },
  ]

  return (
    <Card className="bg-white/10 border-0">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gradient">
          Active Projects
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div>
                <h3 className="font-medium text-gray-800">{project.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">
                    {project.hours} hours logged
                  </span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{project.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-black to-gray-800"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {project.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}