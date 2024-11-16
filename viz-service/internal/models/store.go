package models

import (
	"time"

	"github.com/shopspring/decimal"
)

type Employee struct {
	ID        string  `json:"id" db:"id"`
	FirstName string  `json:"first_name" db:"first_name"`
	LastName  string  `json:"last_name" db:"last_name"`
	Role      string  `json:"role" db:"role"`
	Email     *string `json:"email" db:"email"`
}

type Payment struct {
	ID          string           `json:"id" db:"id"`
	PaymentDate *time.Time       `json:"payment_date" db:"payment_date"`
	Payment     *decimal.Decimal `json:"payment" db:"payment"`
	EmployeeID  *string          `json:"employee_id" db:"employee_id"`
}

type Project struct {
	ID               string     `json:"id" db:"id"`
	Name             string     `json:"name" db:"name"`
	ProjectManagerID *string    `json:"project_manager_id" db:"project_manager_id"`
	StartDate        *time.Time `json:"start_date" db:"start_date"`
	EstimatedHours   *int       `json:"estimated_hours" db:"estimated_hours"`
}

type TimeRecord struct {
	ID          string    `json:"id" db:"id"`
	TimesheetID string    `json:"timesheet_id" db:"timesheet_id"`
	Date        time.Time `json:"date" db:"date"`
	Day         string    `json:"day" db:"day"`
	StartTime   *string   `json:"start_time" db:"start_time"`
	EndTime     *string   `json:"end_time" db:"end_time"`
}

type Timesheet struct {
	ID              string     `json:"id" db:"id"`
	ProjectID       string     `json:"project_id" db:"project_id"`
	EmployeeID      string     `json:"employee_id" db:"employee_id"`
	StartDateOfWeek string     `json:"start_date_of_the_week" db:"start_date_of_the_week"`
	SubmissionDate  *time.Time `json:"submission_date" db:"submission_date"`
	Approved        *bool      `json:"approved" db:"approved"`
	ApprovedBy      *string    `json:"approved_by" db:"approved_by"`
	ApprovedDate    *time.Time `json:"approved_date" db:"approved_date"`
}

const (
	RoleWorker  = "worker"
	RoleManager = "manager"
	RoleAdmin   = "admin"
)
