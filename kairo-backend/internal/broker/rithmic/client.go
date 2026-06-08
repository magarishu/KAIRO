package rithmic

import (
	"errors"
	"go.uber.org/zap"
)

type Client struct {
	systemName string
	user       string
	password   string
	logger     *zap.Logger
	connected  bool
}

func NewClient(systemName, user, password string, logger *zap.Logger) *Client {
	return &Client{
		systemName: systemName,
		user:       user,
		password:   password,
		logger:     logger,
	}
}

func (c *Client) Connect() error {
	c.logger.Info("Connecting to Rithmic API...")
	c.connected = true
	return nil
}

func (c *Client) Disconnect() error {
	c.logger.Info("Disconnecting from Rithmic API...")
	c.connected = false
	return nil
}

func (c *Client) PlaceOrder(symbol string, side string, quantity float64, orderType string) (string, error) {
	if !c.connected {
		return "", errors.New("not connected to Rithmic")
	}
	c.logger.Info("Placing Rithmic order", zap.String("symbol", symbol), zap.String("side", side), zap.Float64("qty", quantity))
	return "rithmic-order-uuid-789", nil
}

func (c *Client) GetLiveQuote(symbol string) (float64, float64, error) {
	if !c.connected {
		return 0, 0, errors.New("not connected to Rithmic")
	}
	return 4200.25, 4200.50, nil // Mock values
}
