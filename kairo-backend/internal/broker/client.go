package broker

// BrokerClient defines the unified layout for any integrated broker platform
type BrokerClient interface {
	Connect() error
	Disconnect() error
	PlaceOrder(symbol string, side string, quantity float64, orderType string) (OrderID string, err error)
	GetLiveQuote(symbol string) (Bid float64, Ask float64, err error)
}
