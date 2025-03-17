package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/biboy/blog/api/db"
	"github.com/biboy/blog/api/handlers"
)

func main() {
	// Load environment variables from .env.local
	if err := godotenv.Load(".env.local"); err != nil {
		log.Println("Warning: .env.local file not found, using environment variables")
	}

	// Get the database URL from environment variables
	dbURL := os.Getenv("NEON_DATABASE_URL")
	if dbURL == "" {
		// Try with VITE_ prefix (as seen in .env.local)
		dbURL = os.Getenv("VITE_NEON_DATABASE_URL")
		if dbURL == "" {
			log.Fatal("Database URL not found in environment variables")
		}
	}

	// Initialize database schema
	if err := db.InitSchema(); err != nil {
		log.Fatal("Failed to initialize database schema: ", err)
	}

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Initialize Gin router
	router := gin.Default()

	// Add CORS middleware
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Define routes
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Welcome to Neon Database API",
		})
	})

	// Initialize API routes
	initializeRoutes(router)

	// Start the server
	serverAddr := fmt.Sprintf(":%s", port)
	log.Printf("Server starting on http://localhost%s", serverAddr)
	if err := router.Run(serverAddr); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}

func initializeRoutes(router *gin.Engine) {
	// API routes will be defined here or imported from handlers
	api := router.Group("/api")
	{
		// Health check endpoint
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status":  "healthy",
				"message": "API is running properly",
			})
		})

		// Register Todo handlers (keep for backward compatibility)
		todoHandler := handlers.NewTodoHandler()
		todoHandler.RegisterRoutes(api)

		// Register Blog API handlers
		postHandler := handlers.NewPostHandler()
		postHandler.RegisterRoutes(api)

		commentHandler := handlers.NewCommentHandler()
		commentHandler.RegisterRoutes(api)

		tagHandler := handlers.NewTagHandler()
		tagHandler.RegisterRoutes(api)
	}
}
