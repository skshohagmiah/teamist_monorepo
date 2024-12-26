// utils.go
package main

import (
	"encoding/json"
	"net/http"
	"strings"
)

func getIDFromPath(path, prefix string) string {
	return strings.TrimPrefix(path, prefix)
}

func parseJSON(r *http.Request, v interface{}) error {
	return json.NewDecoder(r.Body).Decode(v)
}

func validateMethod(w http.ResponseWriter, r *http.Request, allowedMethods ...string) bool {
	for _, method := range allowedMethods {
		if r.Method == method {
			return true
		}
	}

	w.Header().Set("Allow", strings.Join(allowedMethods, ", "))
	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	return false
}
