package metatrader

import (
	"errors"
	"go.uber.org/zap"
)

type Client struct {
	serverURL string
	login     string
	password  string
	logger    *zap.Logger
	connected bool
}

func NewClient(serverURL, login, password string, logger *zap.Logger) *Client {
	return &Client{
		serverURL: serverURL,
		login:     login,
		password:  password,
		logger:    logger,
	}
}

func (c *Client) Connect() error {
	c.logger.Info("Connecting to MetaTrader Manager API...")
	c.connected = true
	return nil
}

func (c *Client) Disconnect() error {
	c.logger.Info("Disconnecting from MetaTrader Manager API...")
	c.connected = false
	return nil
}

func (c *Client) PlaceOrder(symbol string, side string, quantity float64, orderType string) (string, error) {
	if !c.connected {
		return "", errors.New("not connected to MT")
	}
	c.logger.Info("Placing MT order", zap.String("symbol", symbol), zap.String("side", side), zap.Float64("qty", quantity))
	return "mt-order-uuid-123", nil
}

func (c *Client) GetLiveQuote(symbol string) (float64, float64, error) {
	if !c.connected {
		return 0, 0, errors.New("not connected to MT")
	}
	return 1.08500, 1.08510, nil // Mock values
}
