// main.go
package main

import (
	"log"
	"net/http"
	"os"
)

func main() {
	db, err := InitDB()
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer db.Close()

	handler := NewHandler(db)

	// Register routes
	http.HandleFunc("/api/tasks", handler.HandleTasks)
	http.HandleFunc("/api/tasks/", handler.HandleTask)
	// http.HandleFunc("/api/columns", handler.HandleColumns)
	// http.HandleFunc("/api/columns/", handler.HandleColumn)
	// http.HandleFunc("/api/columns/order", handler.HandleColumnOrder)
	// http.HandleFunc("/api/team-members", handler.HandleTeamMembers)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
