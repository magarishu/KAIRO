package redisclient

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

// Client wraps the go-redis client.
type Client struct {
	*redis.Client
}

// NewClient creates a new Redis connection pool.
func NewClient(redisURL string) *Client {
	if redisURL == "" {
		redisURL = "redis://localhost:6379/0"
	}

	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		panic(err)
	}

	opt.PoolSize = 100 // Connection pool size
	opt.MinIdleConns = 10
	opt.ConnMaxLifetime = 5 * time.Minute

	client := redis.NewClient(opt)

	// Ping to check connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		panic("Failed to connect to Redis: " + err.Error())
	}

	return &Client{Client: client}
}
