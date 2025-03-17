package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/biboy/blog/api/db"
	"github.com/biboy/blog/api/models"
)

// PostHandler handles HTTP requests for blog posts
type PostHandler struct {
	postService *models.PostService
}

// NewPostHandler creates a new post handler
func NewPostHandler() *PostHandler {
	return &PostHandler{
		postService: models.NewPostService(db.GetDB()),
	}
}

// RegisterRoutes registers the post routes with the given router group
func (h *PostHandler) RegisterRoutes(router *gin.RouterGroup) {
	posts := router.Group("/posts")
	{
		posts.GET("", h.GetAllPosts)
		posts.GET("/:id", h.GetPostByID)
		posts.GET("/slug/:slug", h.GetPostBySlug)
		posts.POST("", h.CreatePost)
		posts.PUT("/:id", h.UpdatePost)
		posts.DELETE("/:id", h.DeletePost)
	}
}

// GetAllPosts returns all posts
func (h *PostHandler) GetAllPosts(c *gin.Context) {
	posts, err := h.postService.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve posts"})
		return
	}

	c.JSON(http.StatusOK, posts)
}

// GetPostByID returns a post by ID
func (h *PostHandler) GetPostByID(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post ID is required"})
		return
	}

	post, err := h.postService.GetByID(id)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve post"})
		}
		return
	}

	c.JSON(http.StatusOK, post)
}

// GetPostBySlug returns a post by slug
func (h *PostHandler) GetPostBySlug(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post slug is required"})
		return
	}

	post, err := h.postService.GetBySlug(slug)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve post"})
		}
		return
	}

	c.JSON(http.StatusOK, post)
}

// CreatePost adds a new post
func (h *PostHandler) CreatePost(c *gin.Context) {
	var request struct {
		Post   models.PostFormData `json:"post"`
		Author models.Author       `json:"author"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	post, err := h.postService.Create(request.Post, request.Author)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
		return
	}

	c.JSON(http.StatusCreated, post)
}

// UpdatePost modifies an existing post
func (h *PostHandler) UpdatePost(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post ID is required"})
		return
	}

	var request models.PostFormData
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	post, err := h.postService.Update(id, request)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update post"})
		}
		return
	}

	c.JSON(http.StatusOK, post)
}

// DeletePost removes a post
func (h *PostHandler) DeletePost(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post ID is required"})
		return
	}

	if err := h.postService.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
}
