package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"go.uber.org/zap"

	"kairo-backend/internal/config"
	"kairo-backend/internal/copier"
	"kairo-backend/pkg/redisclient"
)

func main() {
	// Initialize logger
	logger, err := zap.NewProduction()
	if err != nil {
		log.Fatalf("can't initialize zap logger: %v", err)
	}
	defer logger.Sync()

	logger.Info("Starting Execution Engine...")

	// Load configuration
	cfg := config.LoadConfig()

	// Initialize Redis
	rdb := redisclient.NewClient(cfg.RedisURL)
	defer rdb.Close()

	// Initialize Execution Processor
	processor := copier.NewProcessor(rdb, logger)

	// Start consuming Redis Streams via Worker Pool
	processor.Start()

	// Wait for termination signal
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	logger.Info("Shutting down Execution Engine...")
	processor.Stop()
	logger.Info("Shutdown complete.")
}
