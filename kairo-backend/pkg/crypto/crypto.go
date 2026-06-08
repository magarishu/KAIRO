package crypto

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"io"
	"os"
)

var (
	ErrInvalidKey = errors.New("invalid encryption key length (must be 32 bytes for AES-256)")
	ErrDecrypt    = errors.New("failed to decrypt data")
)

// Encrypt encrypts plaintext using AES-256-GCM.
func Encrypt(plaintext []byte, keyHex string) (string, error) {
	key, err := hex.DecodeString(keyHex)
	if err != nil {
		return "", err
	}
	if len(key) != 32 {
		return "", ErrInvalidKey
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonce := make([]byte, aesGCM.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	ciphertext := aesGCM.Seal(nonce, nonce, plaintext, nil)
	return hex.EncodeToString(ciphertext), nil
}

// Decrypt decrypts AES-256-GCM encrypted ciphertext.
func Decrypt(ciphertextHex string, keyHex string) ([]byte, error) {
	key, err := hex.DecodeString(keyHex)
	if err != nil {
		return nil, err
	}
	if len(key) != 32 {
		return nil, ErrInvalidKey
	}

	ciphertext, err := hex.DecodeString(ciphertextHex)
	if err != nil {
		return nil, err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	nonceSize := aesGCM.NonceSize()
	if len(ciphertext) < nonceSize {
		return nil, ErrDecrypt
	}

	nonce, ciphertext := ciphertext[:nonceSize], ciphertext[nonceSize:]
	plaintext, err := aesGCM.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return nil, ErrDecrypt
	}

	return plaintext, nil
}

// GetEncryptionKey loads the 32-byte hex-encoded key from environment.
func GetEncryptionKey() string {
	return os.Getenv("KAIRO_ENCRYPTION_KEY")
}
