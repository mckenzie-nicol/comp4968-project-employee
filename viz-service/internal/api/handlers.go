package api

import (
	"encoding/json"
	"net/http"
	"viz-service/internal/database"
)

type Handler struct {
	db *database.DB
}

func NewHandler(db *database.DB) *Handler {
	return &Handler{db: db}
}

func (h *Handler) GetProjectReports(w http.ResponseWriter, r *http.Request) {
	reports, err := h.db.GetProjectReports()
	if err != nil {
		http.Error(w, "Error fetching project reports", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reports)
}

func (h *Handler) GetRecentTimesheets(w http.ResponseWriter, r *http.Request) {
	timesheets, err := h.db.GetRecentTimesheets()
	if err != nil {
		http.Error(w, "Error fetching recent timesheets", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(timesheets)
}

func (h *Handler) GetProjectAllocations(w http.ResponseWriter, r *http.Request) {
	allocations, err := h.db.GetProjectAllocations()
	if err != nil {
		http.Error(w, "Error fetching project allocations", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(allocations)
}
