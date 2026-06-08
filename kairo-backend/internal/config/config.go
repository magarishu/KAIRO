package config

import (
	"os"
)

// Config holds environment configurations.
type Config struct {
	APIPort       string
	RedisURL      string
	DatabaseURL   string
	EncryptionKey string
}

// LoadConfig parses the configuration from environment variables.
func LoadConfig() *Config {
	apiPort := os.Getenv("API_PORT")
	if apiPort == "" {
		apiPort = "8080"
	}

	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://localhost:6379/0"
	}

	return &Config{
		APIPort:       apiPort,
		RedisURL:      redisURL,
		DatabaseURL:   os.Getenv("DATABASE_URL"),
		EncryptionKey: os.Getenv("KAIRO_ENCRYPTION_KEY"),
	}
}
