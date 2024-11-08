package models

import (
	"encoding/json"
	"time"

	"github.com/shopspring/decimal"
)

type Employee struct {
	ID        string `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Role      string `json:"role"`
}

type Payment struct {
	ID          string          `json:"id"`
	PaymentDate time.Time       `json:"payment_date"`
	Payment     decimal.Decimal `json:"payment"`
	EmployeeID  string          `json:"employee_id"`
}

type WeeklyHours struct {
	Monday    *decimal.Decimal `json:"monday"`
	Tuesday   *decimal.Decimal `json:"tuesday"`
	Wednesday *decimal.Decimal `json:"wednesday"`
	Thursday  *decimal.Decimal `json:"thursday"`
	Friday    *decimal.Decimal `json:"friday"`
}

type Timesheet struct {
	ID              string          `json:"id"`
	ProjectID       int             `json:"project_id"`
	EmployeeID      string          `json:"employee_id"`
	StartDateOfWeek string          `json:"start_date_of_the_week"`
	Hours           WeeklyHours     `json:"hours"`
	Approved        bool            `json:"approved"`
	ApprovedBy      *string         `json:"approved_by"`
	SubmissionDate  time.Time       `json:"submission_date"`
	ApprovedDate    *time.Time      `json:"approved_date"`
	TimeRecords     json.RawMessage `json:"time_records"`
}

type Project struct {
	ID               int    `json:"id"`
	Name             string `json:"name"`
	ProjectManagerID string `json:"project_manager_id"`
}

const (
	RoleWorker  = "worker"
	RoleManager = "manager"
	RoleAdmin   = "admin"
)
