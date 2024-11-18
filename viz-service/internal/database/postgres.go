package database

import (
	"database/sql"
	"fmt"
	"viz-service/config"
	"viz-service/internal/models"

	_ "github.com/lib/pq"
)

func NewDB(cfg *config.Config) (*sql.DB, error) {
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

	return db, nil
}

func GetProjectReports(db *sql.DB, orgID string) ([]models.ProjectReportResponse, error) {
	query := `
        WITH project_hours AS (
    SELECT 
        p.id,
        p.name,
        p.estimated_hours,
        COUNT(DISTINCT tr.id) as total_records,
        COUNT(DISTINCT tr.id) FILTER (WHERE tr.end_time IS NOT NULL) as completed_records
    FROM project p
    JOIN organization_user ou ON ou.user_id = p.project_manager_id AND ou.organization_id = $1
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
	FROM project_hours;`

	rows, err := db.Query(query, orgID)
	if err != nil {
		return nil, fmt.Errorf("error querying project reports: %w", err)
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

func GetRecentTimesheets(db *sql.DB, orgID string) ([]models.RecentTimesheetResponse, error) {
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
   JOIN organization_user ou ON p.project_manager_id = ou.user_id AND ou.organization_id = $1
   LEFT JOIN time_record tr ON t.id = tr.timesheet_id
   GROUP BY t.id, t.start_date_of_the_week, t.approved, p.name
   ORDER BY t.start_date_of_the_week DESC
   LIMIT 3
	)
	SELECT * FROM recent_timesheets`

	rows, err := db.Query(query, orgID)
	if err != nil {
		return nil, fmt.Errorf("error querying recent timesheets: %w", err)
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

func GetProjectAllocations(db *sql.DB, orgID string) ([]models.ProjectAllocationResponse, error) {
	query := `
        WITH latest_week AS (
            SELECT DISTINCT t.start_date_of_the_week
            FROM timesheet t
            JOIN project p ON t.project_id = p.id
            JOIN organization_user ou ON p.project_manager_id = ou.user_id 
            WHERE ou.organization_id = $1
            ORDER BY t.start_date_of_the_week DESC
            LIMIT 1
        ),
        current_allocations AS (
            SELECT 
                p.id as project_id,
                p.name as project_name,
                p.estimated_hours,
                COALESCE(t.employee_id, 'N/A') as employee_id,
                COALESCE(u.first_name, 'Not Assigned') as first_name,
                COALESCE(u.last_name, '') as last_name,
                COALESCE(emp_ou.role, 'No Role') as role,
                COUNT(DISTINCT tr.id) as total_records,
                COUNT(DISTINCT CASE WHEN tr.end_time IS NOT NULL THEN tr.id END) as completed_records
            FROM project p
            JOIN organization_user pm_ou ON pm_ou.user_id = p.project_manager_id 
                AND pm_ou.organization_id = $1
            LEFT JOIN timesheet t ON p.id = t.project_id 
                AND t.start_date_of_the_week = (SELECT start_date_of_the_week FROM latest_week)
            LEFT JOIN "user" u ON t.employee_id = u.id
            LEFT JOIN organization_user emp_ou ON t.employee_id = emp_ou.user_id 
                AND emp_ou.organization_id = $1
            LEFT JOIN time_record tr ON t.id = tr.timesheet_id
            GROUP BY 
                p.id, p.name, p.estimated_hours,
                t.employee_id, u.first_name, u.last_name, emp_ou.role
        )
        SELECT * FROM current_allocations`

	rows, err := db.Query(query, orgID)
	if err != nil {
		return nil, fmt.Errorf("query failed: %w", err)
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
			return nil, fmt.Errorf("scan failed: %v", err)
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
			EstimatedHours: actualHours,
		}

		projects[projectID].Team = append(projects[projectID].Team, member)
	}

	allocations := make([]models.ProjectAllocationResponse, 0, len(projects))
	for _, p := range projects {
		allocations = append(allocations, *p)
	}

	if len(allocations) == 0 {
		return nil, fmt.Errorf("no allocations found for organization %s", orgID)
	}

	return allocations, nil
}
