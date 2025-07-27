package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"
	"tutor-backend/database"
	"tutor-backend/handlers"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found or error loading .env file")
	}

	// Initialize database connection
	if err := database.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer database.CloseDB()

	// Run database migrations
	if err := database.RunMigrations(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Create Gin router
	r := gin.Default()

	// Configure CORS manually
	r.Use(func(c *gin.Context) {
		// Define your allowed origins
		allowedOrigins := []string{"http://localhost:5173", "https://tutor-match-mvp.vercel.app"}
		origin := c.Request.Header.Get("Origin")

		// Check if the request's origin is in your list
		for _, allowedOrigin := range allowedOrigins {
			if origin == allowedOrigin {
				c.Header("Access-Control-Allow-Origin", origin)
				break
			}
		}

		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy",
			"message": "Server is running",
		})
	})

	// API routes
	api := r.Group("/api")
	{
		// Tutor routes
		api.GET("/tutors", handlers.GetTutors)
		api.POST("/tutors", handlers.CreateTutor)
		api.GET("/tutors/by-email/:email", handlers.GetTutorByEmail)

		// Client routes
		api.GET("/clients", handlers.GetClients)
		api.POST("/clients", handlers.CreateClient)
		api.GET("/clients/by-email/:email", handlers.GetClientByEmail)
	}

	// Get port from environment variable or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Setup graceful shutdown
	go func() {
		log.Printf("Server starting on port %s", port)
		if err := r.Run(":" + port); err != nil {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")
}
