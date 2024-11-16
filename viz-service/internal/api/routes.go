package api

import (
	"github.com/gorilla/mux"
)

func SetupRoutes(h *Handler) *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/api/dashboard/projects/reports", h.GetProjectReports).Methods("GET")
	r.HandleFunc("/api/dashboard/timesheets/recent", h.GetRecentTimesheets).Methods("GET")
	r.HandleFunc("/api/dashboard/allocations", h.GetProjectAllocations).Methods("GET")

	return r
}
