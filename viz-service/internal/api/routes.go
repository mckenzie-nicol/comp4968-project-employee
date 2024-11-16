package api

import (
	"github.com/gorilla/mux"
)

func SetupRoutes(h *Handler) *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/viz/projects/reports", h.GetProjectReports).Methods("GET")
	r.HandleFunc("/viz/timesheets/recent", h.GetRecentTimesheets).Methods("GET")
	r.HandleFunc("/viz/projects/allocations", h.GetProjectAllocations).Methods("GET")

	return r
}
