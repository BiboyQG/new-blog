package models

import (
	"database/sql"
	"time"
)

// Todo represents a todo item in the database
type Todo struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Completed bool      `json:"completed"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// TodoService provides methods to interact with todos in the database
type TodoService struct {
	DB *sql.DB
}

// NewTodoService creates a new todo service with the given DB connection
func NewTodoService(db *sql.DB) *TodoService {
	return &TodoService{DB: db}
}

// GetAll retrieves all todos from the database
func (s *TodoService) GetAll() ([]Todo, error) {
	rows, err := s.DB.Query(`SELECT id, title, completed, created_at, updated_at FROM todos ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var todos []Todo
	for rows.Next() {
		var todo Todo
		if err := rows.Scan(&todo.ID, &todo.Title, &todo.Completed, &todo.CreatedAt, &todo.UpdatedAt); err != nil {
			return nil, err
		}
		todos = append(todos, todo)
	}

	return todos, rows.Err()
}

// GetByID retrieves a todo by its ID
func (s *TodoService) GetByID(id int) (Todo, error) {
	var todo Todo
	err := s.DB.QueryRow(`SELECT id, title, completed, created_at, updated_at FROM todos WHERE id = $1`, id).
		Scan(&todo.ID, &todo.Title, &todo.Completed, &todo.CreatedAt, &todo.UpdatedAt)

	return todo, err
}

// Create adds a new todo to the database
func (s *TodoService) Create(title string) (Todo, error) {
	var todo Todo
	err := s.DB.QueryRow(`
		INSERT INTO todos (title)
		VALUES ($1)
		RETURNING id, title, completed, created_at, updated_at
	`, title).Scan(&todo.ID, &todo.Title, &todo.Completed, &todo.CreatedAt, &todo.UpdatedAt)

	return todo, err
}

// Update modifies an existing todo
func (s *TodoService) Update(id int, title string, completed bool) (Todo, error) {
	var todo Todo
	err := s.DB.QueryRow(`
		UPDATE todos
		SET title = $1, completed = $2, updated_at = CURRENT_TIMESTAMP
		WHERE id = $3
		RETURNING id, title, completed, created_at, updated_at
	`, title, completed, id).Scan(&todo.ID, &todo.Title, &todo.Completed, &todo.CreatedAt, &todo.UpdatedAt)

	return todo, err
}

// Delete removes a todo by its ID
func (s *TodoService) Delete(id int) error {
	_, err := s.DB.Exec(`DELETE FROM todos WHERE id = $1`, id)
	return err
}
