package handlers

import (
	"fmt"
	"net/http"
	"tutor-backend/models"

	"github.com/gin-gonic/gin"
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