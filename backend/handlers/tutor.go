package handlers

import (
	"fmt"
	"net/http"
	"tutor-backend/models"

	"github.com/gin-gonic/gin"
)

// GetTutors handles GET /api/tutors
func GetTutors(c *gin.Context) {
	tutors, err := models.GetTutors()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   err.Error(),
			"message": "Failed to retrieve tutors",
			"status":  "error",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":    tutors,
		"message": "Tutors retrieved successfully",
		"status":  "success",
	})
}

// CreateTutor handles POST /api/tutors
func CreateTutor(c *gin.Context) {
	var newTutor models.Tutor
	
	if err := c.ShouldBindJSON(&newTutor); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   err.Error(),
			"message": "Invalid tutor data",
			"status":  "error",
		})
		return
	}
	
	// Save tutor to database
	if err := models.CreateTutor(&newTutor); err != nil {
		fmt.Printf("Error creating tutor: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   err.Error(),
			"message": "Failed to create tutor",
			"status":  "error",
		})
		return
	}
	
	fmt.Printf("New Tutor Created: %+v\n", newTutor)
	
	c.JSON(http.StatusCreated, gin.H{
		"data":    newTutor,
		"message": "Tutor profile created successfully",
		"status":  "success",
	})
} 