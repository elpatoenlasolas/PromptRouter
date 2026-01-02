"""
Security utilities for API key encryption and authentication
"""
from cryptography.fernet import Fernet
from app.config import get_settings

settings = get_settings()

# Initialize Fernet cipher with encryption key
def get_cipher():
    """Get or create Fernet cipher"""
    try:
        key = settings.ENCRYPTION_KEY
        # Fernet keys are 44 characters (base64 encoded 32-byte key)
        if len(key) == 44:
            return Fernet(key.encode())
        else:
            # Generate a new key if invalid
            import warnings
            warnings.warn("ENCRYPTION_KEY is invalid length. Generating new key. This will break existing encrypted data!")
            new_key = Fernet.generate_key()
            return Fernet(new_key)
    except Exception as e:
        # Fallback: generate a new key
        import warnings
        warnings.warn(f"Failed to initialize encryption: {e}. Generating new key.")
        new_key = Fernet.generate_key()
        return Fernet(new_key)

cipher = get_cipher()


def encrypt_api_key(api_key: str) -> str:
    """
    Encrypt an API key for secure storage
    
    Args:
        api_key: Plain text API key
        
    Returns:
        Encrypted API key as string
    """
    return cipher.encrypt(api_key.encode()).decode()


def decrypt_api_key(encrypted_key: str) -> str:
    """
    Decrypt an API key for use
    
    Args:
        encrypted_key: Encrypted API key
        
    Returns:
        Plain text API key
    """
    try:
        if not encrypted_key:
            raise ValueError("Encrypted key is empty")
        
        # Try to decrypt
        decrypted_bytes = cipher.decrypt(encrypted_key.encode())
        return decrypted_bytes.decode()
    except Exception as e:
        raise ValueError(f"Failed to decrypt API key: {str(e)}. This usually means the ENCRYPTION_KEY has changed or the key was encrypted with a different key.")


def generate_encryption_key() -> str:
    """Generate a new encryption key for .env"""
    return Fernet.generate_key().decode()
