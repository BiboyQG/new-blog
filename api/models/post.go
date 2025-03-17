package models

import (
	"database/sql"
	"fmt"
	"time"
)

// Post represents a blog post
type Post struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	Excerpt   string    `json:"excerpt"`
	Slug      string    `json:"slug"`
	Published bool      `json:"published"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	Author    Author    `json:"author"`
	Tags      []Tag     `json:"tags"`
	Comments  []Comment `json:"comments,omitempty"`
}

// PostFormData represents the form data for creating/updating a post
type PostFormData struct {
	ID        string   `json:"id"`
	Title     string   `json:"title"`
	Content   string   `json:"content"`
	Excerpt   string   `json:"excerpt"`
	Slug      string   `json:"slug"`
	Published bool     `json:"published"`
	Tags      []string `json:"tags"`
}

// Author represents a user who wrote a post or comment
type Author struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
	IsAdmin bool   `json:"isAdmin"`
}

// PostService provides methods to interact with posts in the database
type PostService struct {
	DB *sql.DB
}

// NewPostService creates a new post service
func NewPostService(db *sql.DB) *PostService {
	return &PostService{DB: db}
}

// GetAll retrieves all posts
func (s *PostService) GetAll() ([]Post, error) {
	rows, err := s.DB.Query(`
		SELECT 
			p.id, p.title, p.content, p.excerpt, p.slug, p.published, 
			p.created_at, p.updated_at, 
			p.author_id, p.author_email, p.author_name, p.author_picture, p.author_is_admin
		FROM posts p
		ORDER BY p.created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var post Post
		if err := rows.Scan(
			&post.ID, &post.Title, &post.Content, &post.Excerpt, &post.Slug, &post.Published,
			&post.CreatedAt, &post.UpdatedAt,
			&post.Author.ID, &post.Author.Email, &post.Author.Name, &post.Author.Picture, &post.Author.IsAdmin,
		); err != nil {
			return nil, err
		}

		// Load tags for this post
		tags, err := s.getTagsForPost(post.ID)
		if err != nil {
			return nil, err
		}
		post.Tags = tags

		// Load comments for this post
		comments, err := s.getCommentsForPost(post.ID)
		if err != nil {
			return nil, err
		}
		post.Comments = comments

		posts = append(posts, post)
	}

	return posts, rows.Err()
}

// GetByID retrieves a post by its ID
func (s *PostService) GetByID(id string) (Post, error) {
	var post Post
	err := s.DB.QueryRow(`
		SELECT 
			p.id, p.title, p.content, p.excerpt, p.slug, p.published, 
			p.created_at, p.updated_at, 
			p.author_id, p.author_email, p.author_name, p.author_picture, p.author_is_admin
		FROM posts p
		WHERE p.id = $1
	`, id).Scan(
		&post.ID, &post.Title, &post.Content, &post.Excerpt, &post.Slug, &post.Published,
		&post.CreatedAt, &post.UpdatedAt,
		&post.Author.ID, &post.Author.Email, &post.Author.Name, &post.Author.Picture, &post.Author.IsAdmin,
	)

	if err != nil {
		return post, err
	}

	// Load tags for this post
	tags, err := s.getTagsForPost(post.ID)
	if err != nil {
		return post, err
	}
	post.Tags = tags

	// Load comments for this post
	comments, err := s.getCommentsForPost(post.ID)
	if err != nil {
		return post, err
	}
	post.Comments = comments

	return post, nil
}

// GetBySlug retrieves a post by its slug
func (s *PostService) GetBySlug(slug string) (Post, error) {
	var post Post
	err := s.DB.QueryRow(`
		SELECT 
			p.id, p.title, p.content, p.excerpt, p.slug, p.published, 
			p.created_at, p.updated_at, 
			p.author_id, p.author_email, p.author_name, p.author_picture, p.author_is_admin
		FROM posts p
		WHERE p.slug = $1
	`, slug).Scan(
		&post.ID, &post.Title, &post.Content, &post.Excerpt, &post.Slug, &post.Published,
		&post.CreatedAt, &post.UpdatedAt,
		&post.Author.ID, &post.Author.Email, &post.Author.Name, &post.Author.Picture, &post.Author.IsAdmin,
	)

	if err != nil {
		return post, err
	}

	// Load tags for this post
	tags, err := s.getTagsForPost(post.ID)
	if err != nil {
		return post, err
	}
	post.Tags = tags

	// Load comments for this post
	comments, err := s.getCommentsForPost(post.ID)
	if err != nil {
		return post, err
	}
	post.Comments = comments

	return post, nil
}

// Create adds a new post
func (s *PostService) Create(postData PostFormData, author Author) (Post, error) {
	tx, err := s.DB.Begin()
	if err != nil {
		return Post{}, err
	}

	// Generate ID if not provided
	postID := postData.ID
	if postID == "" {
		postID = generateID()
	}

	var post Post
	// Insert the post
	err = tx.QueryRow(`
		INSERT INTO posts (
			id, title, content, excerpt, slug, published, 
			created_at, updated_at, 
			author_id, author_email, author_name, author_picture, author_is_admin
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
		RETURNING id, title, content, excerpt, slug, published, created_at, updated_at
	`,
		postID, postData.Title, postData.Content, postData.Excerpt, postData.Slug, postData.Published,
		time.Now(), time.Now(),
		author.ID, author.Email, author.Name, author.Picture, author.IsAdmin,
	).Scan(
		&post.ID, &post.Title, &post.Content, &post.Excerpt, &post.Slug, &post.Published,
		&post.CreatedAt, &post.UpdatedAt,
	)

	if err != nil {
		tx.Rollback()
		return Post{}, err
	}

	// Set author
	post.Author = author

	// Add tags
	for _, tagName := range postData.Tags {
		// Find or create the tag
		var tagID string
		err := tx.QueryRow(`
			SELECT id FROM tags WHERE name = $1
		`, tagName).Scan(&tagID)

		if err == sql.ErrNoRows {
			// Create new tag
			err = tx.QueryRow(`
				INSERT INTO tags (id, name) VALUES ($1, $2)
				RETURNING id
			`, generateID(), tagName).Scan(&tagID)

			if err != nil {
				tx.Rollback()
				return Post{}, err
			}
		} else if err != nil {
			tx.Rollback()
			return Post{}, err
		}

		// Link tag to post
		_, err = tx.Exec(`
			INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)
		`, post.ID, tagID)

		if err != nil {
			tx.Rollback()
			return Post{}, err
		}

		post.Tags = append(post.Tags, Tag{ID: tagID, Name: tagName})
	}

	if err := tx.Commit(); err != nil {
		return Post{}, err
	}

	return post, nil
}

// Update modifies an existing post
func (s *PostService) Update(id string, postData PostFormData) (Post, error) {
	tx, err := s.DB.Begin()
	if err != nil {
		return Post{}, err
	}

	// Update post
	_, err = tx.Exec(`
		UPDATE posts
		SET title = $1, content = $2, excerpt = $3, slug = $4, published = $5, updated_at = $6
		WHERE id = $7
	`,
		postData.Title, postData.Content, postData.Excerpt, postData.Slug, postData.Published,
		time.Now(), id,
	)

	if err != nil {
		tx.Rollback()
		return Post{}, err
	}

	// Remove all existing post-tag relationships
	_, err = tx.Exec(`
		DELETE FROM post_tags WHERE post_id = $1
	`, id)

	if err != nil {
		tx.Rollback()
		return Post{}, err
	}

	// Add new tags
	for _, tagName := range postData.Tags {
		// Find or create the tag
		var tagID string
		err := tx.QueryRow(`
			SELECT id FROM tags WHERE name = $1
		`, tagName).Scan(&tagID)

		if err == sql.ErrNoRows {
			// Create new tag
			err = tx.QueryRow(`
				INSERT INTO tags (id, name) VALUES ($1, $2)
				RETURNING id
			`, generateID(), tagName).Scan(&tagID)

			if err != nil {
				tx.Rollback()
				return Post{}, err
			}
		} else if err != nil {
			tx.Rollback()
			return Post{}, err
		}

		// Link tag to post
		_, err = tx.Exec(`
			INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)
		`, id, tagID)

		if err != nil {
			tx.Rollback()
			return Post{}, err
		}
	}

	if err := tx.Commit(); err != nil {
		return Post{}, err
	}

	// Return the updated post
	return s.GetByID(id)
}

// Delete removes a post
func (s *PostService) Delete(id string) error {
	_, err := s.DB.Exec(`
		DELETE FROM posts WHERE id = $1
	`, id)
	return err
}

// Helper function to get tags for a post
func (s *PostService) getTagsForPost(postID string) ([]Tag, error) {
	rows, err := s.DB.Query(`
		SELECT t.id, t.name
		FROM tags t
		JOIN post_tags pt ON t.id = pt.tag_id
		WHERE pt.post_id = $1
	`, postID)

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

// Helper function to get comments for a post
func (s *PostService) getCommentsForPost(postID string) ([]Comment, error) {
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

// Helper function to generate a unique ID
func generateID() string {
	// In a real application, you would use a proper UUID library
	return fmt.Sprintf("id_%s_%d", time.Now().Format("20060102150405"), time.Now().Nanosecond()%1000000)
}
