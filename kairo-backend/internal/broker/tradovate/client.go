package tradovate

import (
	"errors"
	"go.uber.org/zap"
)

type Client struct {
	apiSecret string
	token     string
	logger    *zap.Logger
	connected bool
}

func NewClient(apiSecret string, logger *zap.Logger) *Client {
	return &Client{
		apiSecret: apiSecret,
		logger:    logger,
	}
}

func (c *Client) Connect() error {
	c.logger.Info("Connecting to Tradovate API via WebSockets...")
	c.connected = true
	return nil
}

func (c *Client) Disconnect() error {
	c.logger.Info("Disconnecting from Tradovate API...")
	c.connected = false
	return nil
}

func (c *Client) PlaceOrder(symbol string, side string, quantity float64, orderType string) (string, error) {
	if !c.connected {
		return "", errors.New("not connected to Tradovate")
	}
	c.logger.Info("Placing Tradovate order", zap.String("symbol", symbol), zap.String("side", side), zap.Float64("qty", quantity))
	return "tv-order-uuid-456", nil
}

func (c *Client) GetLiveQuote(symbol string) (float64, float64, error) {
	if !c.connected {
		return 0, 0, errors.New("not connected to Tradovate")
	}
	return 4200.25, 4200.50, nil // Mock values
}
