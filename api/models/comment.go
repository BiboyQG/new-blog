package models

import (
	"database/sql"
	"time"
)

// Comment represents a blog comment
type Comment struct {
	ID        string    `json:"id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"createdAt"`
	PostID    string    `json:"postId"`
	Author    Author    `json:"author"`
}

// CommentFormData represents the form data for creating a comment
type CommentFormData struct {
	Content string `json:"content"`
}

// CommentService provides methods to interact with comments in the database
type CommentService struct {
	DB *sql.DB
}

// NewCommentService creates a new comment service
func NewCommentService(db *sql.DB) *CommentService {
	return &CommentService{DB: db}
}

// GetByPostID retrieves all comments for a post
func (s *CommentService) GetByPostID(postID string) ([]Comment, error) {
	rows, err := s.DB.Query(`
		SELECT 
			c.id, c.content, c.created_at, c.post_id,
			c.author_id, c.author_email, c.author_name, c.author_picture, c.author_is_admin
		FROM comments c
		WHERE c.post_id = $1
		ORDER BY c.created_at DESC
	`, postID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []Comment
	for rows.Next() {
		var comment Comment
		if err := rows.Scan(
			&comment.ID, &comment.Content, &comment.CreatedAt, &comment.PostID,
			&comment.Author.ID, &comment.Author.Email, &comment.Author.Name, &comment.Author.Picture, &comment.Author.IsAdmin,
		); err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}

	return comments, rows.Err()
}

// Create adds a new comment to a post
func (s *CommentService) Create(postID string, commentData CommentFormData, author Author) (Comment, error) {
	commentID := generateID()

	var comment Comment
	err := s.DB.QueryRow(`
		INSERT INTO comments (
			id, content, created_at, post_id,
			author_id, author_email, author_name, author_picture, author_is_admin
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, content, created_at, post_id
	`,
		commentID, commentData.Content, time.Now(), postID,
		author.ID, author.Email, author.Name, author.Picture, author.IsAdmin,
	).Scan(
		&comment.ID, &comment.Content, &comment.CreatedAt, &comment.PostID,
	)

	if err != nil {
		return Comment{}, err
	}

	comment.Author = author

	return comment, nil
}

// Delete removes a comment
func (s *CommentService) Delete(id string) error {
	_, err := s.DB.Exec(`
		DELETE FROM comments WHERE id = $1
	`, id)
	return err
}
