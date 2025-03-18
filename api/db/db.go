package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"sync"

	_ "github.com/lib/pq" // PostgreSQL driver
)

var (
	db   *sql.DB
	once sync.Once
)

// GetDB returns a singleton database connection
func GetDB() *sql.DB {
	once.Do(func() {
		// Get the database URL from environment variables
		dbURL := os.Getenv("NEON_DATABASE_URL")
		if dbURL == "" {
			// Try with VITE_ prefix (as seen in .env.local)
			dbURL = os.Getenv("VITE_NEON_DATABASE_URL")
			if dbURL == "" {
				log.Fatal("Database URL not found in environment variables")
			}
		}

		var err error
		db, err = sql.Open("postgres", dbURL)
		if err != nil {
			log.Fatal("Failed to connect to database: ", err)
		}

		// Test the connection
		if err = db.Ping(); err != nil {
			log.Fatal("Failed to ping database: ", err)
		}

		// Configure connection pool
		db.SetMaxOpenConns(25)
		db.SetMaxIdleConns(5)

		log.Println("Successfully connected to Neon database")
	})

	return db
}

// InitSchema initializes database schema if not exists
func InitSchema() error {
	db := GetDB()

	// Create posts table
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS posts (
			id TEXT PRIMARY KEY,
			title TEXT NOT NULL,
			content TEXT NOT NULL,
			excerpt TEXT NOT NULL,
			slug TEXT UNIQUE NOT NULL,
			published BOOLEAN NOT NULL DEFAULT false,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			author_id TEXT NOT NULL,
			author_email TEXT NOT NULL,
			author_name TEXT NOT NULL,
			author_picture TEXT NOT NULL,
			author_is_admin BOOLEAN NOT NULL DEFAULT false
		)
	`)
	if err != nil {
		return fmt.Errorf("failed to create posts table: %w", err)
	}

	// Create tags table
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS tags (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL UNIQUE
		)
	`)
	if err != nil {
		return fmt.Errorf("failed to create tags table: %w", err)
	}

	// Create post_tags junction table
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS post_tags (
			post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
			tag_id TEXT REFERENCES tags(id) ON DELETE CASCADE,
			PRIMARY KEY (post_id, tag_id)
		)
	`)
	if err != nil {
		return fmt.Errorf("failed to create post_tags table: %w", err)
	}

	// Create comments table
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS comments (
			id TEXT PRIMARY KEY,
			content TEXT NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
			author_id TEXT NOT NULL,
			author_email TEXT NOT NULL,
			author_name TEXT NOT NULL,
			author_picture TEXT NOT NULL,
			author_is_admin BOOLEAN NOT NULL DEFAULT false
		)
	`)
	if err != nil {
		return fmt.Errorf("failed to create comments table: %w", err)
	}

	log.Println("Database schema initialized")
	return nil
}
