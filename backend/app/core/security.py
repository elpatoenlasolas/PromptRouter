"""
Security utilities for API key encryption and authentication
"""
from cryptography.fernet import Fernet
from app.config import get_settings

settings = get_settings()

# Initialize Fernet cipher with encryption key
cipher = Fernet(settings.ENCRYPTION_KEY.encode() if len(settings.ENCRYPTION_KEY) == 44 else Fernet.generate_key())


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
    return cipher.decrypt(encrypted_key.encode()).decode()


def generate_encryption_key() -> str:
    """Generate a new encryption key for .env"""
    return Fernet.generate_key().decode()
