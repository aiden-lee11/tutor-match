package database

import (
	"context"
	"log"
)

// RunMigrations creates the necessary tables if they don't exist
func RunMigrations() error {
	if DB == nil {
		log.Println("Database not initialized, skipping migrations")
		return nil
	}

	// Create tutors table
	tutorsTable := `
	CREATE TABLE IF NOT EXISTS tutors (
		id SERIAL PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		subjects TEXT[] NOT NULL,
		pay DECIMAL(10,2) NOT NULL,
		rating DECIMAL(3,2) DEFAULT 0,
		bio TEXT,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);`

	// Create clients table
	clientsTable := `
	CREATE TABLE IF NOT EXISTS clients (
		id SERIAL PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		email VARCHAR(255),
		subjects TEXT[] NOT NULL,
		budget DECIMAL(10,2) NOT NULL,
		description TEXT,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);`

	// Add email column to existing clients table if it doesn't exist
	addEmailColumn := `
	ALTER TABLE clients 
	ADD COLUMN IF NOT EXISTS email VARCHAR(255);`

	// Execute migrations
	if _, err := DB.Exec(context.Background(), tutorsTable); err != nil {
		return err
	}
	log.Println("Tutors table created/verified")

	if _, err := DB.Exec(context.Background(), clientsTable); err != nil {
		return err
	}
	log.Println("Clients table created/verified")

	// Add email column if it doesn't exist
	if _, err := DB.Exec(context.Background(), addEmailColumn); err != nil {
		log.Printf("Warning: Could not add email column (may already exist): %v", err)
	} else {
		log.Println("Email column added/verified in clients table")
	}

	return nil
} 