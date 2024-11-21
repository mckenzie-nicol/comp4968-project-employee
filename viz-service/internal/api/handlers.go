package api

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"viz-service/internal/database"
)

type Handler struct {
	db *sql.DB
}

func NewHandler(db *sql.DB) *Handler {
	return &Handler{db: db}
}

type BaseRequest struct {
	OrganizationID string `json:"organizationId"`
}

func (h *Handler) GetProjectReports(w http.ResponseWriter, r *http.Request) {
	var req BaseRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.OrganizationID == "" {
		log.Println("Missing organization ID")
		http.Error(w, "Missing organization ID", http.StatusBadRequest)
		return
	}

	reports, err := database.GetProjectReports(h.db, req.OrganizationID)
	if err != nil {
		http.Error(w, "Error fetching project reports", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reports)
}

func (h *Handler) GetRecentTimesheets(w http.ResponseWriter, r *http.Request) {
	var req BaseRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.OrganizationID == "" {
		http.Error(w, "Missing organization ID", http.StatusBadRequest)
		return
	}

	timesheets, err := database.GetRecentTimesheets(h.db, req.OrganizationID)
	if err != nil {
		http.Error(w, "Error fetching recent timesheets", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(timesheets)
}

func (h *Handler) GetProjectAllocations(w http.ResponseWriter, r *http.Request) {
	var req BaseRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.OrganizationID == "" {
		http.Error(w, "Missing organization ID", http.StatusBadRequest)
		return
	}

	allocations, err := database.GetProjectAllocations(h.db, req.OrganizationID)
	if err != nil {
		http.Error(w, "Error fetching project allocations", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(allocations)
}
