package account

import (
	"kairo-backend/pkg/crypto"
)

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

// DecryptCredentials fetches and decrypts a user's API credentials.
func (s *Service) DecryptCredentials(accountID string, masterKeyHex string) (string, string, error) {
	creds, err := s.repo.GetCredentials(accountID)
	if err != nil {
		return "", "", err
	}
	
	keyBytes, err := crypto.Decrypt(creds.APIKeyHex, masterKeyHex)
	if err != nil {
		return "", "", err
	}
	
	secretBytes, err := crypto.Decrypt(creds.APISecretHex, masterKeyHex)
	if err != nil {
		return "", "", err
	}
	
	return string(keyBytes), string(secretBytes), nil
}
