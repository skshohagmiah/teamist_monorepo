// handlers.go
package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

type Handler struct {
	db *sql.DB
}

func NewHandler(db *sql.DB) *Handler {
	return &Handler{db: db}
}

func (h *Handler) HandleTasks(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.getTasks(w, r)
	case http.MethodPost:
		h.createTask(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *Handler) HandleTask(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/api/tasks/")
	if id == "" {
		http.Error(w, "Invalid task ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	// case http.MethodPut:
	// 	h.updateTask(w, r, id)
	// case http.MethodDelete:
	// 	h.deleteTask(w, r, id)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *Handler) getTasks(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(`
		SELECT id, title, description, assigned_to, status, 
		priority, deadline, tags, created_at, updated_at 
		FROM tasks
	`)
	if err != nil {
		sendJSON(w, Response{Error: err.Error(), Success: false}, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	tasks := make(map[string]Task)
	for rows.Next() {
		var task Task
		err := rows.Scan(
			&task.ID, &task.Title, &task.Description, &task.AssignedTo,
			&task.Status, &task.Priority, &task.Deadline, pq.Array(&task.Tags),
			&task.CreatedAt, &task.UpdatedAt,
		)
		if err != nil {
			sendJSON(w, Response{Error: err.Error(), Success: false}, http.StatusInternalServerError)
			return
		}
		tasks[task.ID] = task
	}

	sendJSON(w, Response{Data: tasks, Success: true}, http.StatusOK)
}

func (h *Handler) createTask(w http.ResponseWriter, r *http.Request) {
	var task Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		sendJSON(w, Response{Error: err.Error(), Success: false}, http.StatusBadRequest)
		return
	}

	task.ID = uuid.New().String()
	task.CreatedAt = time.Now()
	task.UpdatedAt = time.Now()

	_, err := h.db.Exec(`
		INSERT INTO tasks (
			id, title, description, assigned_to, status, 
			priority, deadline, tags, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
		task.ID, task.Title, task.Description, task.AssignedTo, task.Status,
		task.Priority, task.Deadline, pq.Array(task.Tags), task.CreatedAt, task.UpdatedAt,
	)

	if err != nil {
		sendJSON(w, Response{Error: err.Error(), Success: false}, http.StatusInternalServerError)
		return
	}

	sendJSON(w, Response{Data: task, Success: true}, http.StatusCreated)
}

// Similar patterns for HandleColumns, HandleTeamMembers, etc.

func sendJSON(w http.ResponseWriter, data interface{}, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
