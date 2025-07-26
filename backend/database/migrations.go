package database

import (
	"context"
	"log"
)

// RunMigrations creates the necessary database tables and adds missing columns
func RunMigrations() error {
	db := GetDB()
	if db == nil {
		log.Println("Database not connected, skipping migrations")
		return nil
	}

	// Create tutors table
	createTutorsTable := `
	CREATE TABLE IF NOT EXISTS tutors (
		id SERIAL PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		subjects TEXT[] NOT NULL,
		pay DECIMAL(10,2) NOT NULL,
		rating DECIMAL(3,2) DEFAULT 5.0,
		bio TEXT NOT NULL,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	)`

	if _, err := db.Exec(context.Background(), createTutorsTable); err != nil {
		return err
	}
	log.Println("Tutors table created/verified")

	// Add email column to tutors table if it doesn't exist
	addTutorEmailColumn := `
	ALTER TABLE tutors 
	ADD COLUMN IF NOT EXISTS email VARCHAR(255)`

	if _, err := db.Exec(context.Background(), addTutorEmailColumn); err != nil {
		log.Printf("Warning: Could not add email column to tutors table: %v", err)
	} else {
		log.Println("Email column added/verified in tutors table")
	}

	// Create clients table
	createClientsTable := `
	CREATE TABLE IF NOT EXISTS clients (
		id SERIAL PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		email VARCHAR(255) NOT NULL,
		subjects TEXT[] NOT NULL,
		budget DECIMAL(10,2) NOT NULL,
		description TEXT,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	)`

	if _, err := db.Exec(context.Background(), createClientsTable); err != nil {
		return err
	}
	log.Println("Clients table created/verified")

	// Add email column to clients table if it doesn't exist (for existing installations)
	addClientEmailColumn := `
	ALTER TABLE clients 
	ADD COLUMN IF NOT EXISTS email VARCHAR(255)`

	if _, err := db.Exec(context.Background(), addClientEmailColumn); err != nil {
		log.Printf("Warning: Could not add email column to clients table: %v", err)
	} else {
		log.Println("Email column added/verified in clients table")
	}

	log.Println("Database migrations completed successfully")
	return nil
} 