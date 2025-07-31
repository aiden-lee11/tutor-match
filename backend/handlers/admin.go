package handlers

import (
	"net/http"
	"strconv"
	"tutor-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

// UpdateTutor handles PUT /api/admin/tutors/:id
func UpdateTutor(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid tutor ID",
			"message": "Tutor ID must be a number",
			"status":  "error",
		})
		return
	}

	var updatedTutor models.Tutor
	if err := c.ShouldBindJSON(&updatedTutor); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   err.Error(),
			"message": "Invalid tutor data",
			"status":  "error",
		})
		return
	}

	updatedTutor.ID = id

	if err := models.UpdateTutor(&updatedTutor); err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Tutor not found",
				"message": "No tutor found with the given ID",
				"status":  "error",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   err.Error(),
			"message": "Failed to update tutor",
			"status":  "error",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":    updatedTutor,
		"message": "Tutor updated successfully",
		"status":  "success",
	})
}

// DeleteTutor handles DELETE /api/admin/tutors/:id
func DeleteTutor(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid tutor ID",
			"message": "Tutor ID must be a number",
			"status":  "error",
		})
		return
	}

	if err := models.DeleteTutor(id); err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Tutor not found",
				"message": "No tutor found with the given ID",
				"status":  "error",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   err.Error(),
			"message": "Failed to delete tutor",
			"status":  "error",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Tutor deleted successfully",
		"status":  "success",
	})
}

// UpdateClient handles PUT /api/admin/clients/:id
func UpdateClient(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid client ID",
			"message": "Client ID must be a number",
			"status":  "error",
		})
		return
	}

	var updatedClient models.Client
	if err := c.ShouldBindJSON(&updatedClient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   err.Error(),
			"message": "Invalid client data",
			"status":  "error",
		})
		return
	}

	updatedClient.ID = id

	if err := models.UpdateClient(&updatedClient); err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Client not found",
				"message": "No client found with the given ID",
				"status":  "error",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   err.Error(),
			"message": "Failed to update client",
			"status":  "error",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":    updatedClient,
		"message": "Client updated successfully",
		"status":  "success",
	})
}

// DeleteClient handles DELETE /api/admin/clients/:id
func DeleteClient(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid client ID",
			"message": "Client ID must be a number",
			"status":  "error",
		})
		return
	}

	if err := models.DeleteClient(id); err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Client not found",
				"message": "No client found with the given ID",
				"status":  "error",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   err.Error(),
			"message": "Failed to delete client",
			"status":  "error",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Client deleted successfully",
		"status":  "success",
	})
}

// GetAdminStats handles GET /api/admin/stats
func GetAdminStats(c *gin.Context) {
	tutors, err := models.GetTutors()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   err.Error(),
			"message": "Failed to get tutors count",
			"status":  "error",
		})
		return
	}

	clients, err := models.GetClients()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   err.Error(),
			"message": "Failed to get clients count",
			"status":  "error",
		})
		return
	}

	stats := gin.H{
		"tutors_count":  len(tutors),
		"clients_count": len(clients),
		"total_users":   len(tutors) + len(clients),
	}

	c.JSON(http.StatusOK, gin.H{
		"data":    stats,
		"message": "Admin stats retrieved successfully",
		"status":  "success",
	})
}
