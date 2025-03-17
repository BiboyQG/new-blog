package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/biboy/blog/api/db"
	"github.com/biboy/blog/api/models"
)

// TodoHandler handles HTTP requests for todos
type TodoHandler struct {
	todoService *models.TodoService
}

// NewTodoHandler creates a new todo handler
func NewTodoHandler() *TodoHandler {
	return &TodoHandler{
		todoService: models.NewTodoService(db.GetDB()),
	}
}

// RegisterRoutes registers the todo routes with the given router group
func (h *TodoHandler) RegisterRoutes(router *gin.RouterGroup) {
	todos := router.Group("/todos")
	{
		todos.GET("", h.GetAllTodos)
		todos.GET("/:id", h.GetTodoByID)
		todos.POST("", h.CreateTodo)
		todos.PUT("/:id", h.UpdateTodo)
		todos.DELETE("/:id", h.DeleteTodo)
	}
}

// GetAllTodos returns all todos
func (h *TodoHandler) GetAllTodos(c *gin.Context) {
	todos, err := h.todoService.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve todos"})
		return
	}

	c.JSON(http.StatusOK, todos)
}

// GetTodoByID returns a todo by ID
func (h *TodoHandler) GetTodoByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	todo, err := h.todoService.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
		return
	}

	c.JSON(http.StatusOK, todo)
}

// CreateTodo adds a new todo
func (h *TodoHandler) CreateTodo(c *gin.Context) {
	var request struct {
		Title string `json:"title" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: title is required"})
		return
	}

	todo, err := h.todoService.Create(request.Title)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create todo"})
		return
	}

	c.JSON(http.StatusCreated, todo)
}

// UpdateTodo modifies an existing todo
func (h *TodoHandler) UpdateTodo(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var request struct {
		Title     string `json:"title"`
		Completed bool   `json:"completed"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	todo, err := h.todoService.Update(id, request.Title, request.Completed)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found or update failed"})
		return
	}

	c.JSON(http.StatusOK, todo)
}

// DeleteTodo removes a todo
func (h *TodoHandler) DeleteTodo(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	if err := h.todoService.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete todo"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Todo deleted successfully"})
}
