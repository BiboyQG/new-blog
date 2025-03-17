package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/biboy/blog/api/db"
	"github.com/biboy/blog/api/models"
)

// CommentHandler handles HTTP requests for comments
type CommentHandler struct {
	commentService *models.CommentService
}

// NewCommentHandler creates a new comment handler
func NewCommentHandler() *CommentHandler {
	return &CommentHandler{
		commentService: models.NewCommentService(db.GetDB()),
	}
}

// RegisterRoutes registers the comment routes with the given router group
func (h *CommentHandler) RegisterRoutes(router *gin.RouterGroup) {
	comments := router.Group("/comments")
	{
		comments.GET("/post/:postId", h.GetCommentsByPostID)
		comments.POST("", h.CreateComment)
		comments.DELETE("/:id", h.DeleteComment)
	}
}

// GetCommentsByPostID returns all comments for a post
func (h *CommentHandler) GetCommentsByPostID(c *gin.Context) {
	postID := c.Param("postId")
	if postID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post ID is required"})
		return
	}

	comments, err := h.commentService.GetByPostID(postID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve comments"})
		return
	}

	c.JSON(http.StatusOK, comments)
}

// CreateComment adds a new comment
func (h *CommentHandler) CreateComment(c *gin.Context) {
	var request struct {
		PostID  string                 `json:"postId"`
		Comment models.CommentFormData `json:"comment"`
		Author  models.Author          `json:"author"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	if request.PostID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post ID is required"})
		return
	}

	comment, err := h.commentService.Create(request.PostID, request.Comment, request.Author)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
		return
	}

	c.JSON(http.StatusCreated, comment)
}

// DeleteComment removes a comment
func (h *CommentHandler) DeleteComment(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Comment ID is required"})
		return
	}

	if err := h.commentService.Delete(id); err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete comment"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
}
