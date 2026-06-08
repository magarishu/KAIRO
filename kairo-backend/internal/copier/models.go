package copier

import "time"

// MasterTradeEvent is the immutable payload generated when a master account takes action.
type MasterTradeEvent struct {
	EventID         string    `json:"event_id"`          // Unique UUID for tracing this specific execution
	MasterAccountID string    `json:"master_account_id"` // DB UUID of the source account
	UserID          string    `json:"user_id"`           // Kairo User ID owner
	BrokerSource    string    `json:"broker_source"`     // E.g., "MT5", "TRADOVATE"

	// Transaction Metrics
	Symbol    string  `json:"symbol"`     // Source symbol directly from broker (e.g., "EURUSD", "MNQM6")
	Action    string  `json:"action"`     // "BUY" or "SELL"
	OrderType string  `json:"order_type"` // "MARKET", "LIMIT", "STOP"
	Volume    float64 `json:"volume"`     // Raw size: Lots for Forex, Contracts for Futures
	Price     float64 `json:"price"`      // Execution price of the Master

	// State Tracking
	TradeAction string  `json:"trade_action"`          // "OPEN", "PARTIAL_CLOSE", "CLOSE", "MODIFY_SL_TP"
	StopLoss    float64 `json:"stop_loss,omitempty"`   // Absolute price level
	TakeProfit  float64 `json:"take_profit,omitempty"` // Absolute price level

	Timestamp time.Time `json:"timestamp"` // Exact millisecond timestamp from the broker fill
}
