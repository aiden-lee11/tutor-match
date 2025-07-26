package handlers

import (
	"fmt"
	"net/http"
	"tutor-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

// GetClients handles GET /api/clients
func GetClients(c *gin.Context) {
	clients, err := models.GetClients()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   err.Error(),
			"message": "Failed to retrieve clients",
			"status":  "error",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":    clients,
		"message": "Clients retrieved successfully",
		"status":  "success",
	})
}

// GetClientByEmail handles GET /api/clients/by-email/:email
func GetClientByEmail(c *gin.Context) {
	email := c.Param("email")
	if email == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Email parameter is required",
			"message": "Invalid request",
			"status":  "error",
		})
		return
	}

	client, err := models.GetClientByEmail(email)
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusOK, gin.H{
				"data":    nil,
				"message": "No client found with this email",
				"status":  "success",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   err.Error(),
			"message": "Failed to retrieve client",
			"status":  "error",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":    client,
		"message": "Client retrieved successfully",
		"status":  "success",
	})
}

// CreateClient handles POST /api/clients
func CreateClient(c *gin.Context) {
	var newClient models.Client
	
	if err := c.ShouldBindJSON(&newClient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   err.Error(),
			"message": "Invalid client data",
			"status":  "error",
		})
		return
	}
	
	// Save client to database
	if err := models.CreateClient(&newClient); err != nil {
		fmt.Printf("Error creating client: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   err.Error(),
			"message": "Failed to create client",
			"status":  "error",
		})
		return
	}
	
	fmt.Printf("New Client Created: %+v\n", newClient)
	
	c.JSON(http.StatusCreated, gin.H{
		"data":    newClient,
		"message": "Client profile created successfully",
		"status":  "success",
	})
} 