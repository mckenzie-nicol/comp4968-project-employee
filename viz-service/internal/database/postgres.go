package database

import (
	"database/sql"
	"fmt"
	"viz-service/config"
	"viz-service/internal/models"
)

type DB struct {
	db *sql.DB
}

func NewDB(cfg *config.Config) (*DB, error) {
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=require",
		cfg.DB.Host,
		cfg.DB.Port,
		cfg.DB.User,
		cfg.DB.Password,
		cfg.DB.Name,
	)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("error connecting to database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("error pinging database: %w", err)
	}

	return &DB{db: db}, nil
}

func (d *DB) GetProjectReports() ([]models.ProjectReportResponse, error) {
	query := `
        WITH project_hours AS (
            SELECT 
                p.id,
                p.name,
                p.estimated_hours,
                COUNT(DISTINCT tr.id) as total_records,
                COUNT(DISTINCT tr.id) FILTER (WHERE tr.end_time IS NOT NULL) as completed_records
            FROM project p
            LEFT JOIN timesheet t ON p.id = t.project_id
            LEFT JOIN time_record tr ON t.id = tr.timesheet_id
            GROUP BY p.id, p.name, p.estimated_hours
        )
        SELECT 
            id,
            name,
            COALESCE(estimated_hours, 0) as estimated_hours,
            total_records,
            completed_records
        FROM project_hours`

	rows, err := d.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reports []models.ProjectReportResponse
	for rows.Next() {
		var r models.ProjectReportResponse
		var id string
		var estimatedHours int
		var totalRecords, completedRecords int

		err := rows.Scan(&id, &r.ProjectName, &estimatedHours, &totalRecords, &completedRecords)
		if err != nil {
			continue
		}

		r.EstimatedHours = estimatedHours
		r.ActualHours = float64(completedRecords) * 8
		r.RemainingHours = float64(estimatedHours) - r.ActualHours

		reports = append(reports, r)
	}

	return reports, nil
}

func (d *DB) GetRecentTimesheets() ([]models.RecentTimesheetResponse, error) {
	query := `
        WITH recent_timesheets AS (
            SELECT 
                t.id,
                t.start_date_of_the_week,
                t.approved,
                p.name as project_name,
                COUNT(tr.id) as record_count,
                COUNT(tr.end_time) as completed_count
            FROM timesheet t
            JOIN project p ON t.project_id = p.id
            LEFT JOIN time_record tr ON t.id = tr.timesheet_id
            GROUP BY t.id, t.start_date_of_the_week, t.approved, p.name
            ORDER BY t.start_date_of_the_week DESC
            LIMIT 3
        )
        SELECT * FROM recent_timesheets`

	rows, err := d.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var timesheets []models.RecentTimesheetResponse
	for rows.Next() {
		var t models.RecentTimesheetResponse
		var approved bool
		var recordCount, completedCount int
		var projectName string

		err := rows.Scan(
			&t.ID,
			&t.Date,
			&approved,
			&projectName,
			&recordCount,
			&completedCount,
		)
		if err != nil {
			continue
		}

		t.Status = map[bool]string{true: "Approved", false: "Pending"}[approved]
		t.Hours = float64(completedCount) * 8
		t.Projects = []string{projectName}

		timesheets = append(timesheets, t)
	}

	return timesheets, nil
}

func (d *DB) GetProjectAllocations() ([]models.ProjectAllocationResponse, error) {
	query := `
        WITH current_allocations AS (
            SELECT 
                p.id as project_id,
                p.name as project_name,
                p.estimated_hours,
                e.id as employee_id,
                e.first_name,
                e.last_name,
                e.role,
                COUNT(tr.id) as total_records,
                COUNT(tr.end_time) as completed_records
            FROM project p
            JOIN timesheet t ON p.id = t.project_id
            JOIN employee e ON t.employee_id = e.id
            LEFT JOIN time_record tr ON t.id = tr.timesheet_id
            WHERE t.start_date_of_the_week = (
                SELECT start_date_of_the_week 
                FROM timesheet 
                ORDER BY submission_date DESC 
                LIMIT 1
            )
            GROUP BY 
                p.id, p.name, p.estimated_hours,
                e.id, e.first_name, e.last_name, e.role
        )
        SELECT * FROM current_allocations`

	rows, err := d.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	projects := make(map[string]*models.ProjectAllocationResponse)
	for rows.Next() {
		var (
			projectID, projectName                string
			estimatedHours                        *int
			employeeID, firstName, lastName, role string
			totalRecords, completedRecords        int
		)

		err := rows.Scan(
			&projectID,
			&projectName,
			&estimatedHours,
			&employeeID,
			&firstName,
			&lastName,
			&role,
			&totalRecords,
			&completedRecords,
		)
		if err != nil {
			continue
		}

		if _, exists := projects[projectID]; !exists {
			estHours := 0
			if estimatedHours != nil {
				estHours = *estimatedHours
			}
			projects[projectID] = &models.ProjectAllocationResponse{
				ProjectID:      projectID,
				ProjectName:    projectName,
				EstimatedHours: float64(estHours),
				Team:           []models.TeamMemberResponse{},
			}
		}

		actualHours := float64(completedRecords) * 8

		member := models.TeamMemberResponse{
			ID:             employeeID,
			Name:           firstName + " " + lastName,
			Role:           role,
			Avatar:         string(firstName[0]) + string(lastName[0]),
			EstimatedHours: actualHours,
		}

		projects[projectID].Team = append(projects[projectID].Team, member)
	}

	allocations := make([]models.ProjectAllocationResponse, 0, len(projects))
	for _, p := range projects {
		allocations = append(allocations, *p)
	}

	return allocations, nil
}
