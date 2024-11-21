import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Save, Edit2, X } from 'lucide-react'

interface TeamMember {
  id: number
  name: string
  role: string
  avatar: string
  estimatedHours: number
}

interface ProjectAllocation {
  projectId: number
  projectName: string
  estimatedHours: number
  team: TeamMember[]
}

export function ProjectAllocation() {
  const [allocations, setAllocations] = useState<ProjectAllocation[]>([
    {
      projectId: 1,
      projectName: "Website Redesign",
      estimatedHours: 120,
      team: [
        { id: 1, name: "Alice Johnson", role: "Lead Developer", avatar: "AJ", estimatedHours: 40 },
        { id: 2, name: "Bob Smith", role: "UI Designer", avatar: "BS", estimatedHours: 30 },
        { id: 3, name: "Carol White", role: "Backend Developer", avatar: "CW", estimatedHours: 50 }
      ]
    },
    {
      projectId: 2,
      projectName: "Mobile App Development",
      estimatedHours: 160,
      team: [
        { id: 4, name: "David Brown", role: "Mobile Developer", avatar: "DB", estimatedHours: 60 },
        { id: 5, name: "Eve Taylor", role: "UX Designer", avatar: "ET", estimatedHours: 40 },
        { id: 1, name: "Alice Johnson", role: "Technical Lead", avatar: "AJ", estimatedHours: 60 }
      ]
    }
  ])

  const [editingMember, setEditingMember] = useState<{
    projectId: number
    memberId: number
    hours: number
  } | null>(null)

  const startEditing = (projectId: number, memberId: number, currentHours: number) => {
    setEditingMember({
      projectId,
      memberId,
      hours: currentHours
    })
  }

  const cancelEditing = () => {
    setEditingMember(null)
  }

  const updateMemberHours = () => {
    if (!editingMember) return

    const { projectId, memberId, hours } = editingMember

    setAllocations(current =>
      current.map(project => {
        if (project.projectId === projectId) {
          return {
            ...project,
            team: project.team.map(member => {
              if (member.id === memberId) {
                return { ...member, estimatedHours: hours }
              }
              return member
            })
          }
        }
        return project
      })
    )

    setEditingMember(null)
  }

  return (
    <div className="space-y-6">
      {allocations.map((project) => (
        <Card key={project.projectId} className="bg-white/10 border-0">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gradient">
              {project.projectName}
            </CardTitle>
            <div className="text-sm text-gray-500">
              Total Estimated Hours: {project.estimatedHours}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {project.team.map((member) => (
                <div key={member.id} className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {member.avatar}
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.role}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`hours-${project.projectId}-${member.id}`} className="text-sm">
                      Weekly Hours:
                    </Label>
                    {editingMember?.projectId === project.projectId && 
                     editingMember?.memberId === member.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          id={`hours-${project.projectId}-${member.id}`}
                          type="number"
                          min="0"
                          max="40"
                          value={editingMember.hours}
                          onChange={(e) => setEditingMember({
                            ...editingMember,
                            hours: Number(e.target.value)
                          })}
                          className="w-20 bg-white/50"
                        />
                        <Button
                          size="sm"
                          variant="default"
                          onClick={updateMemberHours}
                          className="bg-black hover:bg-gray-800"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEditing}
                          className="bg-white/50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="w-20 text-center font-medium">
                          {member.estimatedHours}h
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(project.projectId, member.id, member.estimatedHours)}
                          className="bg-white/50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}