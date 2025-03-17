package models

import (
	"database/sql"
)

// Tag represents a blog post tag
type Tag struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// TagService provides methods to interact with tags in the database
type TagService struct {
	DB *sql.DB
}

// NewTagService creates a new tag service
func NewTagService(db *sql.DB) *TagService {
	return &TagService{DB: db}
}

// GetAll retrieves all tags
func (s *TagService) GetAll() ([]Tag, error) {
	rows, err := s.DB.Query(`
		SELECT id, name
		FROM tags
		ORDER BY name ASC
	`)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tags []Tag
	for rows.Next() {
		var tag Tag
		if err := rows.Scan(&tag.ID, &tag.Name); err != nil {
			return nil, err
		}
		tags = append(tags, tag)
	}

	return tags, rows.Err()
}

// GetByID retrieves a tag by its ID
func (s *TagService) GetByID(id string) (Tag, error) {
	var tag Tag
	err := s.DB.QueryRow(`
		SELECT id, name
		FROM tags
		WHERE id = $1
	`, id).Scan(&tag.ID, &tag.Name)

	return tag, err
}

// GetByName retrieves a tag by its name
func (s *TagService) GetByName(name string) (Tag, error) {
	var tag Tag
	err := s.DB.QueryRow(`
		SELECT id, name
		FROM tags
		WHERE name = $1
	`, name).Scan(&tag.ID, &tag.Name)

	return tag, err
}

// Create adds a new tag
func (s *TagService) Create(name string) (Tag, error) {
	tagID := generateID()

	var tag Tag
	err := s.DB.QueryRow(`
		INSERT INTO tags (id, name)
		VALUES ($1, $2)
		RETURNING id, name
	`, tagID, name).Scan(&tag.ID, &tag.Name)

	return tag, err
}

// Update modifies an existing tag
func (s *TagService) Update(id string, name string) (Tag, error) {
	var tag Tag
	err := s.DB.QueryRow(`
		UPDATE tags
		SET name = $1
		WHERE id = $2
		RETURNING id, name
	`, name, id).Scan(&tag.ID, &tag.Name)

	return tag, err
}

// Delete removes a tag
func (s *TagService) Delete(id string) error {
	_, err := s.DB.Exec(`
		DELETE FROM tags WHERE id = $1
	`, id)
	return err
}
