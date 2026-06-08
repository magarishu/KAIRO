package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"kairo-backend/internal/config"
	"kairo-backend/pkg/redisclient"
)

func main() {
	// Initialize logger
	logger, err := zap.NewProduction()
	if err != nil {
		log.Fatalf("can't initialize zap logger: %v", err)
	}
	defer logger.Sync()

	logger.Info("Starting API Orchestrator...")

	// Load configuration
	cfg := config.LoadConfig()

	// Initialize Redis
	rdb := redisclient.NewClient(cfg.RedisURL)
	defer rdb.Close()

	// Set up Gin Router
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "API is healthy",
		})
	})

	// TODO: Setup routes for user registration, payments, broker linking

	port := fmt.Sprintf(":%s", cfg.APIPort)
	logger.Info("API listening on " + port)
	if err := r.Run(port); err != nil {
		logger.Fatal("Failed to start API", zap.Error(err))
	}
}
