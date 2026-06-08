package account

type Repository interface {
	GetFollowersByMasterID(masterID string) ([]FollowerAccount, error)
	GetCredentials(accountID string) (EncryptedCredentials, error)
}

type FollowerAccount struct {
	AccountID   string
	UserID      string
	BrokerType  string
	RiskProfile float64
}

type EncryptedCredentials struct {
	APIKeyHex    string
	APISecretHex string
}

// Mock implementation for skeleton
type MockRepository struct{}

func (m *MockRepository) GetFollowersByMasterID(masterID string) ([]FollowerAccount, error) {
	return []FollowerAccount{
		{AccountID: "foll_1", UserID: "usr_2", BrokerType: "TRADOVATE", RiskProfile: 1.0},
	}, nil
}

func (m *MockRepository) GetCredentials(accountID string) (EncryptedCredentials, error) {
	return EncryptedCredentials{}, nil
}
