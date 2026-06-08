package copier

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
	"kairo-backend/pkg/redisclient"
)

const (
	StreamName    = "kairo:trade:events"
	ConsumerGroup = "kairo-copier-group"
	NumWorkers    = 50
)

// Processor drains the Redis stream using a fixed pool of workers.
type Processor struct {
	rdb    *redisclient.Client
	logger *zap.Logger
	wg     sync.WaitGroup
	ctx    context.Context
	cancel context.CancelFunc
}

func NewProcessor(rdb *redisclient.Client, logger *zap.Logger) *Processor {
	ctx, cancel := context.WithCancel(context.Background())
	return &Processor{
		rdb:    rdb,
		logger: logger,
		ctx:    ctx,
		cancel: cancel,
	}
}

func (p *Processor) Start() {
	// Ensure consumer group exists
	err := p.rdb.XGroupCreateMkStream(p.ctx, StreamName, ConsumerGroup, "$").Err()
	if err != nil && err.Error() != "BUSYGROUP Consumer Group name already exists" {
		p.logger.Error("Failed to create consumer group", zap.Error(err))
	}

	p.logger.Info(fmt.Sprintf("Starting %d background workers for trade processing", NumWorkers))
	for i := 0; i < NumWorkers; i++ {
		p.wg.Add(1)
		workerID := fmt.Sprintf("worker-%d", i)
		go p.worker(workerID)
	}
}

func (p *Processor) Stop() {
	p.cancel()
	p.wg.Wait()
}

func (p *Processor) worker(workerID string) {
	defer p.wg.Done()
	for {
		select {
		case <-p.ctx.Done():
			p.logger.Info("Worker shutting down", zap.String("worker_id", workerID))
			return
		default:
			// Block for up to 2 seconds waiting for a new message
			streams, err := p.rdb.XReadGroup(p.ctx, &redis.XReadGroupArgs{
				Group:    ConsumerGroup,
				Consumer: workerID,
				Streams:  []string{StreamName, ">"},
				Count:    10,
				Block:    2 * time.Second,
			}).Result()

			if err != nil {
				if err != redis.Nil && err != context.Canceled {
					p.logger.Error("Error reading from Redis Stream", zap.Error(err))
					time.Sleep(1 * time.Second) // backoff
				}
				continue
			}

			for _, stream := range streams {
				for _, msg := range stream.Messages {
					p.processMessage(msg)
					// Acknowledge the message so it's not processed again
					p.rdb.XAck(p.ctx, StreamName, ConsumerGroup, msg.ID)
				}
			}
		}
	}
}

func (p *Processor) processMessage(msg redis.XMessage) {
	payload, ok := msg.Values["payload"].(string)
	if !ok {
		p.logger.Error("Invalid payload format in message", zap.String("msgID", msg.ID))
		return
	}

	var event MasterTradeEvent
	if err := json.Unmarshal([]byte(payload), &event); err != nil {
		p.logger.Error("Failed to parse event", zap.Error(err))
		return
	}

	p.logger.Info("Processing master trade event",
		zap.String("event_id", event.EventID),
		zap.String("symbol", event.Symbol),
		zap.Float64("volume", event.Volume),
		zap.String("action", event.Action))

	// 1. Fetch Followers for this MasterAccountID from DB (Simulated)
	// 2. Fetch mapping (EURUSD -> 6E) using SymbolMap
	// 3. Calculate Risk Sizing Allocation
	// 4. Spin up concurrent goroutines to execute Follower Trades via BrokerClients

	// Placeholder simulation
	time.Sleep(5 * time.Millisecond)
}
