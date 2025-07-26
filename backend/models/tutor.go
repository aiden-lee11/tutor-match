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
	Email     string    `json:"email"`
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

	// First, try to query with email column (for updated schema)
	query := `
		SELECT id, name, email, subjects, pay, rating, bio, created_at, updated_at 
		FROM tutors 
		ORDER BY created_at DESC
	`

	rows, err := db.Query(context.Background(), query)
	if err != nil {
		// If that fails (email column doesn't exist), try without email
		queryWithoutEmail := `
			SELECT id, name, subjects, pay, rating, bio, created_at, updated_at 
			FROM tutors 
			ORDER BY created_at DESC
		`
		
		rows, err = db.Query(context.Background(), queryWithoutEmail)
		if err != nil {
			return nil, err
		}
		defer rows.Close()

		// Scan without email field
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
	defer rows.Close()

	// Scan with email field
	var tutors []Tutor
	for rows.Next() {
		var tutor Tutor
		err := rows.Scan(
			&tutor.ID,
			&tutor.Name,
			&tutor.Email,
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

	// First, try to insert with email column (for updated schema)
	query := `
		INSERT INTO tutors (name, email, subjects, pay, rating, bio)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at
	`

	err := db.QueryRow(
		context.Background(),
		query,
		tutor.Name,
		tutor.Email,
		tutor.Subjects,
		tutor.Pay,
		tutor.Rating,
		tutor.Bio,
	).Scan(&tutor.ID, &tutor.CreatedAt, &tutor.UpdatedAt)

	if err != nil {
		// If that fails (email column doesn't exist), try without email
		queryWithoutEmail := `
			INSERT INTO tutors (name, subjects, pay, rating, bio)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id, created_at, updated_at
		`

		err = db.QueryRow(
			context.Background(),
			queryWithoutEmail,
			tutor.Name,
			tutor.Subjects,
			tutor.Pay,
			tutor.Rating,
			tutor.Bio,
		).Scan(&tutor.ID, &tutor.CreatedAt, &tutor.UpdatedAt)
	}

	return err
}

// GetTutorByID retrieves a tutor by ID from the database
func GetTutorByID(id int) (*Tutor, error) {
	db := database.GetDB()
	if db == nil {
		return nil, pgx.ErrNoRows
	}

	// First, try to query with email column
	query := `
		SELECT id, name, email, subjects, pay, rating, bio, created_at, updated_at 
		FROM tutors 
		WHERE id = $1
	`

	var tutor Tutor
	err := db.QueryRow(context.Background(), query, id).Scan(
		&tutor.ID,
		&tutor.Name,
		&tutor.Email,
		&tutor.Subjects,
		&tutor.Pay,
		&tutor.Rating,
		&tutor.Bio,
		&tutor.CreatedAt,
		&tutor.UpdatedAt,
	)

	if err != nil {
		// If that fails (email column doesn't exist), try without email
		queryWithoutEmail := `
			SELECT id, name, subjects, pay, rating, bio, created_at, updated_at 
			FROM tutors 
			WHERE id = $1
		`
		
		err = db.QueryRow(context.Background(), queryWithoutEmail, id).Scan(
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
	}

	return &tutor, nil
}

// GetTutorByEmail retrieves a tutor by email from the database
func GetTutorByEmail(email string) (*Tutor, error) {
	db := database.GetDB()
	if db == nil {
		// Check sample data if database is not available
		tutors := getSampleTutors()
		for _, tutor := range tutors {
			if tutor.Email == email {
				return &tutor, nil
			}
		}
		return nil, pgx.ErrNoRows
	}

	query := `
		SELECT id, name, email, subjects, pay, rating, bio, created_at, updated_at 
		FROM tutors 
		WHERE email = $1
	`

	var tutor Tutor
	err := db.QueryRow(context.Background(), query, email).Scan(
		&tutor.ID,
		&tutor.Name,
		&tutor.Email,
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
			Email:    "john.smith@email.com",
			Subjects: []string{"Mathematics", "Physics"},
			Pay:      50.0,
			Rating:   4.8,
			Bio:      "Experienced math and physics tutor with 5+ years of experience",
		},
		{
			ID:       2,
			Name:     "Sarah Johnson",
			Email:    "sarah.johnson@email.com",
			Subjects: []string{"English", "Literature", "Writing"},
			Pay:      45.0,
			Rating:   4.9,
			Bio:      "English literature expert specializing in creative writing and essay composition",
		},
	}
} 