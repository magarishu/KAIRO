package copier

// TranslateSymbol translates a Master symbol to a Follower symbol.
// e.g., EURUSD -> 6E for cross-market, or EURUSD.r -> EURUSD
func TranslateSymbol(masterSymbol string, masterBrokerType string, followerBrokerType string) string {
	// Simple mock translation map
	// In production, this would read from the DB or a Redis cache
	if masterBrokerType == "MT5" && followerBrokerType == "TRADOVATE" {
		if masterSymbol == "EURUSD" {
			return "6E"
		}
		if masterSymbol == "NDX" {
			return "MNQ"
		}
	}
	
	return masterSymbol // Default to passing through
}
