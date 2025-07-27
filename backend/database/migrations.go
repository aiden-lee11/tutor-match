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

	// Create tutors table if it doesn't exist (with complete schema)
	createTutorsTable := `
	CREATE TABLE IF NOT EXISTS tutors (
		id SERIAL PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		email VARCHAR(255),
		subjects TEXT[] NOT NULL,
		pay DECIMAL(10,2) NOT NULL,
		rating DECIMAL(3,2) DEFAULT 5.0,
		bio TEXT NOT NULL,
		language VARCHAR(255),
		location VARCHAR(255),
		availability VARCHAR(255),
		experience VARCHAR(255),
		education VARCHAR(255),
		certification VARCHAR(255),
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	)`

	if _, err := db.Exec(context.Background(), createTutorsTable); err != nil {
		return err
	}
	log.Println("Tutors table verified")

	// Create clients table if it doesn't exist (with complete schema)
	createClientsTable := `
	CREATE TABLE IF NOT EXISTS clients (
		id SERIAL PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		email VARCHAR(255),
		subjects TEXT[] NOT NULL,
		budget DECIMAL(10,2) NOT NULL,
		description TEXT,
		language VARCHAR(255),
		location VARCHAR(255),
		availability VARCHAR(255),
		education VARCHAR(255),
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	)`

	if _, err := db.Exec(context.Background(), createClientsTable); err != nil {
		return err
	}
	log.Println("Clients table verified")

	log.Println("Database migrations completed successfully")
	return nil
} 