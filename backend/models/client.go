package models

import (
	"context"
	"time"
	"tutor-backend/database"

	"github.com/jackc/pgx/v5"
)

// Client represents a client in the system
type Client struct {
	ID           int       `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	Subjects     []string  `json:"subjects"`
	Budget       float64   `json:"budget"`
	Description  string    `json:"description"`
	Language     string    `json:"language"`
	Location     string    `json:"location"`
	Availability string    `json:"availability"`
	Education    string    `json:"education"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// GetClients returns all clients from the database
func GetClients() ([]Client, error) {
	db := database.GetDB()
	if db == nil {
		// Return sample data if database is not available
		return getSampleClients(), nil
	}

	query := `
		SELECT id, name, email, subjects, budget, description, language, location, availability, education, created_at, updated_at
		FROM clients 
		ORDER BY created_at DESC
	`

	rows, err := db.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var clients []Client
	for rows.Next() {
		var client Client
		err := rows.Scan(
			&client.ID,
			&client.Name,
			&client.Email,
			&client.Subjects,
			&client.Budget,
			&client.Description,
			&client.Language,
			&client.Location,
			&client.Availability,
			&client.Education,
			&client.CreatedAt,
			&client.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		clients = append(clients, client)
	}

	return clients, nil
}

// CreateClient saves a new client to the database
func CreateClient(client *Client) error {
	db := database.GetDB()
	if db == nil {
		return nil // Skip database operations if not available
	}

	query := `
		INSERT INTO clients (name, email, subjects, budget, description, language, location, availability, education)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, created_at, updated_at
	`

	err := db.QueryRow(
		context.Background(),
		query,
		client.Name,
		client.Email,
		client.Subjects,
		client.Budget,
		client.Description,
		client.Language,
		client.Location,
		client.Availability,
		client.Education,
	).Scan(&client.ID, &client.CreatedAt, &client.UpdatedAt)

	return err
}

// GetClientByID retrieves a client by ID from the database
func GetClientByID(id int) (*Client, error) {
	db := database.GetDB()
	if db == nil {
		return nil, pgx.ErrNoRows
	}

	query := `
		SELECT id, name, email, subjects, budget, description, language, location, availability, education, created_at, updated_at
		FROM clients 
		WHERE id = $1
	`

	var client Client
	err := db.QueryRow(context.Background(), query, id).Scan(
		&client.ID,
		&client.Name,
		&client.Email,
		&client.Subjects,
		&client.Budget,
		&client.Description,
		&client.Language,
		&client.Location,
		&client.Availability,
		&client.Education,
		&client.CreatedAt,
		&client.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &client, nil
}

// GetClientByEmail retrieves a client by email from the database
func GetClientByEmail(email string) (*Client, error) {
	db := database.GetDB()
	if db == nil {
		// Check sample data if database is not available
		clients := getSampleClients()
		for _, client := range clients {
			if client.Email == email {
				return &client, nil
			}
		}
		return nil, pgx.ErrNoRows
	}

	query := `
		SELECT id, name, email, subjects, budget, description, language, location, availability, education, created_at, updated_at
		FROM clients 
		WHERE email = $1
	`

	var client Client
	err := db.QueryRow(context.Background(), query, email).Scan(
		&client.ID,
		&client.Name,
		&client.Email,
		&client.Subjects,
		&client.Budget,
		&client.Description,
		&client.Language,
		&client.Location,
		&client.Availability,
		&client.Education,
		&client.CreatedAt,
		&client.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &client, nil
}

// UpdateClient updates an existing client in the database
func UpdateClient(client *Client) error {
	db := database.GetDB()
	if db == nil {
		return nil // Skip database operations if not available
	}

	query := `
		UPDATE clients 
		SET name = $2, email = $3, subjects = $4, budget = $5, description = $6, 
		    language = $7, location = $8, availability = $9, education = $10, 
		    updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
		RETURNING updated_at
	`

	err := db.QueryRow(
		context.Background(),
		query,
		client.ID,
		client.Name,
		client.Email,
		client.Subjects,
		client.Budget,
		client.Description,
		client.Language,
		client.Location,
		client.Availability,
		client.Education,
	).Scan(&client.UpdatedAt)

	return err
}

// DeleteClient removes a client from the database
func DeleteClient(id int) error {
	db := database.GetDB()
	if db == nil {
		return nil // Skip database operations if not available
	}

	query := `DELETE FROM clients WHERE id = $1`

	result, err := db.Exec(context.Background(), query, id)
	if err != nil {
		return err
	}

	rowsAffected := result.RowsAffected()
	if rowsAffected == 0 {
		return pgx.ErrNoRows
	}

	return nil
}

// getSampleClients returns sample client data (fallback when database is not available)
func getSampleClients() []Client {
	return []Client{
		{
			ID:          1,
			Name:        "Mike Davis",
			Email:       "mike.davis@email.com",
			Subjects:    []string{"Mathematics"},
			Budget:      60.0,
			Description: "Looking for advanced calculus help",
		},
		{
			ID:          2,
			Name:        "Emily Wilson",
			Email:       "emily.wilson@email.com",
			Subjects:    []string{"English", "Writing"},
			Budget:      50.0,
			Description: "Need help with essay writing and literature analysis",
		},
	}
}
