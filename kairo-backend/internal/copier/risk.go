package copier

// CalculateFollowerRisk computes the correct volume to execute on the Follower account.
// It handles scaling based on balance ratios or fixed lot allocations.
func CalculateFollowerRisk(masterVolume float64, masterEquity float64, followerEquity float64, riskMultiplier float64) float64 {
	// Simple equity ratio calculation
	if masterEquity <= 0 {
		return 0 // Avoid division by zero
	}
	ratio := followerEquity / masterEquity
	followerVolume := masterVolume * ratio * riskMultiplier
	
	// TODO: Apply minimum lot size constraints and rounding based on asset class
	return followerVolume
}
