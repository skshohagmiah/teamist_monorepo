// models.go
package main

import "time"

type Task struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description *string   `json:"description,omitempty"`
	AssignedTo  *string   `json:"assignedTo,omitempty"`
	Status      string    `json:"status"`
	Priority    string    `json:"priority"`
	Deadline    *string   `json:"deadline,omitempty"`
	Tags        []string  `json:"tags,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type Column struct {
	ID      string   `json:"id"`
	Title   string   `json:"title"`
	TaskIds []string `json:"taskIds"`
}

type TeamMember struct {
	ID     string  `json:"id"`
	Name   string  `json:"name"`
	Email  string  `json:"email"`
	Avatar *string `json:"avatar,omitempty"`
	Role   *string `json:"role,omitempty"`
}

type Response struct {
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
	Success bool        `json:"success"`
}
