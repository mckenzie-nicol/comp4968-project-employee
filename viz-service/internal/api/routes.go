package api

import (
	"github.com/gorilla/mux"
)

func SetupRoutes(h *Handler) *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/dashboard/reports", h.GetProjectReports).Methods("POST")
	r.HandleFunc("/dashboard/timesheets", h.GetRecentTimesheets).Methods("POST")
	r.HandleFunc("/dashboard/allocations", h.GetProjectAllocations).Methods("POST")

	return r
}
