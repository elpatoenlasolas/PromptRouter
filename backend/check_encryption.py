#!/usr/bin/env python3
"""
Script para verificar la configuración de encriptación
"""
import os
from cryptography.fernet import Fernet
from dotenv import load_dotenv

load_dotenv()

encryption_key = os.getenv("ENCRYPTION_KEY", "")

print("=" * 50)
print("Verificación de ENCRYPTION_KEY")
print("=" * 50)

if not encryption_key:
    print("❌ ERROR: ENCRYPTION_KEY no está configurada en .env")
    print("\nGenera una nueva clave con:")
    print("  python3 -c \"from cryptography.fernet import Fernet; print('ENCRYPTION_KEY=' + Fernet.generate_key().decode())\"")
    exit(1)

if len(encryption_key) != 44:
    print(f"❌ ERROR: ENCRYPTION_KEY tiene longitud incorrecta: {len(encryption_key)} (debe ser 44)")
    print("\nGenera una nueva clave con:")
    print("  python3 -c \"from cryptography.fernet import Fernet; print('ENCRYPTION_KEY=' + Fernet.generate_key().decode())\"")
    exit(1)

try:
    cipher = Fernet(encryption_key.encode())
    # Test encryption/decryption
    test_data = "test_api_key_123"
    encrypted = cipher.encrypt(test_data.encode()).decode()
    decrypted = cipher.decrypt(encrypted.encode()).decode()
    
    if decrypted == test_data:
        print("✅ ENCRYPTION_KEY es válida y funciona correctamente")
        print(f"   Longitud: {len(encryption_key)} caracteres")
        print(f"   Primeros 10 caracteres: {encryption_key[:10]}...")
    else:
        print("❌ ERROR: La encriptación/desencriptación no funciona correctamente")
        exit(1)
except Exception as e:
    print(f"❌ ERROR: No se puede usar ENCRYPTION_KEY: {str(e)}")
    exit(1)

print("\n" + "=" * 50)
print("Si las API keys no se pueden desencriptar:")
print("1. Ve a Settings en el frontend")
print("2. Elimina todas las API keys existentes")
print("3. Agrega las API keys nuevamente")
print("=" * 50)

