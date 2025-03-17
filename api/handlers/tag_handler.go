package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/biboy/blog/api/db"
	"github.com/biboy/blog/api/models"
)

// TagHandler handles HTTP requests for tags
type TagHandler struct {
	tagService *models.TagService
}

// NewTagHandler creates a new tag handler
func NewTagHandler() *TagHandler {
	return &TagHandler{
		tagService: models.NewTagService(db.GetDB()),
	}
}

// RegisterRoutes registers the tag routes with the given router group
func (h *TagHandler) RegisterRoutes(router *gin.RouterGroup) {
	tags := router.Group("/tags")
	{
		tags.GET("", h.GetAllTags)
		tags.GET("/:id", h.GetTagByID)
		tags.GET("/name/:name", h.GetTagByName)
		tags.POST("", h.CreateTag)
		tags.PUT("/:id", h.UpdateTag)
		tags.DELETE("/:id", h.DeleteTag)
	}
}

// GetAllTags returns all tags
func (h *TagHandler) GetAllTags(c *gin.Context) {
	tags, err := h.tagService.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve tags"})
		return
	}

	c.JSON(http.StatusOK, tags)
}

// GetTagByID returns a tag by ID
func (h *TagHandler) GetTagByID(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tag ID is required"})
		return
	}

	tag, err := h.tagService.GetByID(id)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Tag not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve tag"})
		}
		return
	}

	c.JSON(http.StatusOK, tag)
}

// GetTagByName returns a tag by name
func (h *TagHandler) GetTagByName(c *gin.Context) {
	name := c.Param("name")
	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tag name is required"})
		return
	}

	tag, err := h.tagService.GetByName(name)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Tag not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve tag"})
		}
		return
	}

	c.JSON(http.StatusOK, tag)
}

// CreateTag adds a new tag
func (h *TagHandler) CreateTag(c *gin.Context) {
	var request struct {
		Name string `json:"name" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: tag name is required"})
		return
	}

	tag, err := h.tagService.Create(request.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create tag"})
		return
	}

	c.JSON(http.StatusCreated, tag)
}

// UpdateTag modifies an existing tag
func (h *TagHandler) UpdateTag(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tag ID is required"})
		return
	}

	var request struct {
		Name string `json:"name" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: tag name is required"})
		return
	}

	tag, err := h.tagService.Update(id, request.Name)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Tag not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update tag"})
		}
		return
	}

	c.JSON(http.StatusOK, tag)
}

// DeleteTag removes a tag
func (h *TagHandler) DeleteTag(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tag ID is required"})
		return
	}

	if err := h.tagService.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete tag"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tag deleted successfully"})
}
