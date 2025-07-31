package models

import (
	"context"
	"time"
	"tutor-backend/database"

	"github.com/jackc/pgx/v5"
)

// Tutor represents a tutor in the system
type Tutor struct {
	ID            int       `json:"id"`
	Name          string    `json:"name"`
	Email         string    `json:"email"`
	Subjects      []string  `json:"subjects"`
	Pay           float64   `json:"pay"`
	Rating        float64   `json:"rating"`
	Bio           string    `json:"bio"`
	Language      string    `json:"language"`
	Location      string    `json:"location"`
	Availability  string    `json:"availability"`
	Experience    string    `json:"experience"`
	Education     string    `json:"education"`
	Certification string    `json:"certification"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// GetTutors returns all tutors from the database
func GetTutors() ([]Tutor, error) {
	db := database.GetDB()
	if db == nil {
		// Return sample data if database is not available
		return getSampleTutors(), nil
	}

	// Query with consistent column order
	query := `
		SELECT id, name, email, subjects, pay, rating, bio, language, location, availability, experience, education, certification, created_at, updated_at
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
			&tutor.Email,
			&tutor.Subjects,
			&tutor.Pay,
			&tutor.Rating,
			&tutor.Bio,
			&tutor.Language,
			&tutor.Location,
			&tutor.Availability,
			&tutor.Experience,
			&tutor.Education,
			&tutor.Certification,
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
		INSERT INTO tutors (name, email, subjects, pay, rating, bio, language, location, availability, experience, education, certification)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
		tutor.Language,
		tutor.Location,
		tutor.Availability,
		tutor.Experience,
		tutor.Education,
		tutor.Certification,
	).Scan(&tutor.ID, &tutor.CreatedAt, &tutor.UpdatedAt)

	if err != nil {
		// If that fails (email column doesn't exist), try without email
		queryWithoutEmail := `
			INSERT INTO tutors (name, subjects, pay, rating, bio, language, location, availability, experience, education, certification)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
			tutor.Language,
			tutor.Location,
			tutor.Availability,
			tutor.Experience,
			tutor.Education,
			tutor.Certification,
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

	query := `
		SELECT id, name, email, subjects, pay, rating, bio, language, location, availability, experience, education, certification, created_at, updated_at
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
		&tutor.Language,
		&tutor.Location,
		&tutor.Availability,
		&tutor.Experience,
		&tutor.Education,
		&tutor.Certification,
		&tutor.CreatedAt,
		&tutor.UpdatedAt,
	)

	if err != nil {
		return nil, err
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
		SELECT id, name, email, subjects, pay, rating, bio, language, location, availability, experience, education, certification, created_at, updated_at
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
		&tutor.Language,
		&tutor.Location,
		&tutor.Availability,
		&tutor.Experience,
		&tutor.Education,
		&tutor.Certification,
		&tutor.CreatedAt,
		&tutor.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &tutor, nil
}

// UpdateTutor updates an existing tutor in the database
func UpdateTutor(tutor *Tutor) error {
	db := database.GetDB()
	if db == nil {
		return nil // Skip database operations if not available
	}

	query := `
		UPDATE tutors 
		SET name = $2, email = $3, subjects = $4, pay = $5, rating = $6, bio = $7, 
		    language = $8, location = $9, availability = $10, experience = $11, 
		    education = $12, certification = $13, updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
		RETURNING updated_at
	`

	err := db.QueryRow(
		context.Background(),
		query,
		tutor.ID,
		tutor.Name,
		tutor.Email,
		tutor.Subjects,
		tutor.Pay,
		tutor.Rating,
		tutor.Bio,
		tutor.Language,
		tutor.Location,
		tutor.Availability,
		tutor.Experience,
		tutor.Education,
		tutor.Certification,
	).Scan(&tutor.UpdatedAt)

	return err
}

// DeleteTutor removes a tutor from the database
func DeleteTutor(id int) error {
	db := database.GetDB()
	if db == nil {
		return nil // Skip database operations if not available
	}

	query := `DELETE FROM tutors WHERE id = $1`

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
