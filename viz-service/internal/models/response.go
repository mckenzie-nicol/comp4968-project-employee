package models

type TeamMemberResponse struct {
	ID             string  `json:"id"`
	Name           string  `json:"name"`
	Role           string  `json:"role"`
	Avatar         string  `json:"avatar"`
	EstimatedHours float64 `json:"estimatedHours"`
}

type ProjectAllocationResponse struct {
	ProjectID      string               `json:"projectId"`
	ProjectName    string               `json:"projectName"`
	EstimatedHours float64              `json:"estimatedHours"`
	Team           []TeamMemberResponse `json:"team"`
}

type ProjectReportResponse struct {
	ProjectName    string  `json:"projectName"`
	EstimatedHours int     `json:"estimatedHours"`
	ActualHours    float64 `json:"actualHours"`
	RemainingHours float64 `json:"remainingHours"`
}

type RecentTimesheetResponse struct {
	ID       string   `json:"id"`
	Date     string   `json:"date"`
	Status   string   `json:"status"`
	Hours    float64  `json:"hours"`
	Projects []string `json:"projects"`
}

type ProjectResponse struct {
	ID               string  `json:"id"`
	Name             string  `json:"name"`
	Progress         float64 `json:"progress"`
	Hours            float64 `json:"hours"`
	Status           string  `json:"status"`
	StartDate        string  `json:"startDate"`
	TotalStoryPoints int     `json:"totalStoryPoints"`
}

type DailyHours struct {
	Date  string  `json:"date"`
	Hours float64 `json:"hours"`
}

type WeeklyHours struct {
	WeekStart string       `json:"weekStart"`
	Days      []DailyHours `json:"days"`
	Total     float64      `json:"total"`
}
