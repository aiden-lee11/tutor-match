package models

import (
	"context"
	"time"
	"tutor-backend/database"

	"github.com/jackc/pgx/v5"
)

// Tutor represents a tutor in the system
type Tutor struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Subjects  []string  `json:"subjects"`
	Pay       float64   `json:"pay"`
	Rating    float64   `json:"rating"`
	Bio       string    `json:"bio"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// GetTutors returns all tutors from the database
func GetTutors() ([]Tutor, error) {
	db := database.GetDB()
	if db == nil {
		// Return sample data if database is not available
		return getSampleTutors(), nil
	}

	query := `
		SELECT id, name, subjects, pay, rating, bio, created_at, updated_at 
		FROM tutors 
		ORDER BY created_at DESC
	`

	rows, err := db.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tutors []Tutor
	for rows.Next() {
		var tutor Tutor
		err := rows.Scan(
			&tutor.ID,
			&tutor.Name,
			&tutor.Subjects,
			&tutor.Pay,
			&tutor.Rating,
			&tutor.Bio,
			&tutor.CreatedAt,
			&tutor.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		tutors = append(tutors, tutor)
	}

	return tutors, nil
}

// CreateTutor saves a new tutor to the database
func CreateTutor(tutor *Tutor) error {
	db := database.GetDB()
	if db == nil {
		return nil // Skip database operations if not available
	}

	query := `
		INSERT INTO tutors (name, subjects, pay, rating, bio)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at, updated_at
	`

	err := db.QueryRow(
		context.Background(),
		query,
		tutor.Name,
		tutor.Subjects,
		tutor.Pay,
		tutor.Rating,
		tutor.Bio,
	).Scan(&tutor.ID, &tutor.CreatedAt, &tutor.UpdatedAt)

	return err
}

// GetTutorByID retrieves a tutor by ID from the database
func GetTutorByID(id int) (*Tutor, error) {
	db := database.GetDB()
	if db == nil {
		return nil, pgx.ErrNoRows
	}

	query := `
		SELECT id, name, subjects, pay, rating, bio, created_at, updated_at 
		FROM tutors 
		WHERE id = $1
	`

	var tutor Tutor
	err := db.QueryRow(context.Background(), query, id).Scan(
		&tutor.ID,
		&tutor.Name,
		&tutor.Subjects,
		&tutor.Pay,
		&tutor.Rating,
		&tutor.Bio,
		&tutor.CreatedAt,
		&tutor.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &tutor, nil
}

// getSampleTutors returns sample tutor data (fallback when database is not available)
func getSampleTutors() []Tutor {
	return []Tutor{
		{
			ID:       1,
			Name:     "John Smith",
			Subjects: []string{"Mathematics", "Physics"},
			Pay:      50.0,
			Rating:   4.8,
			Bio:      "Experienced math and physics tutor with 5+ years of experience",
		},
		{
			ID:       2,
			Name:     "Sarah Johnson",
			Subjects: []string{"English", "Literature", "Writing"},
			Pay:      45.0,
			Rating:   4.9,
			Bio:      "English literature expert specializing in creative writing and essay composition",
		},
	}
} 