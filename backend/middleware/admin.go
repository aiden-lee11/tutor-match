package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

// AdminAuth middleware checks if the user email is in the admin whitelist
func AdminAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get email from header (you can modify this to get from JWT token if you have one)
		email := c.GetHeader("X-User-Email")

		if email == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error":   "Missing user email",
				"message": "Admin access requires authentication",
				"status":  "error",
			})
			c.Abort()
			return
		}

		// Get admin emails from environment variable or use default list
		adminEmailsEnv := os.Getenv("ADMIN_EMAILS")
		var adminEmails []string

		if adminEmailsEnv != "" {
			adminEmails = strings.Split(adminEmailsEnv, ",")
			// Trim whitespace from each email
			for i, email := range adminEmails {
				adminEmails[i] = strings.TrimSpace(email)
			}
		} else {
			// Default admin emails - you should set these via environment variable
			adminEmails = []string{
				"admin@example.com",
				// Add your admin emails here or set ADMIN_EMAILS environment variable
			}
		}

		// Check if the email is in the admin list
		isAdmin := false
		for _, adminEmail := range adminEmails {
			if strings.EqualFold(email, adminEmail) {
				isAdmin = true
				break
			}
		}

		if !isAdmin {
			c.JSON(http.StatusForbidden, gin.H{
				"error":   "Access denied",
				"message": "Admin access required",
				"status":  "error",
			})
			c.Abort()
			return
		}

		// Store admin email in context for use in handlers
		c.Set("admin_email", email)
		c.Next()
	}
}
