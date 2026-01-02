# Fix para Error de Desencriptación de API Keys

## Problema
Error: "Failed to decrypt API key for google:"

## Causas Posibles

1. **ENCRYPTION_KEY cambió**: Si cambiaste la `ENCRYPTION_KEY` en el `.env`, las claves encriptadas anteriormente ya no se pueden desencriptar.

2. **ENCRYPTION_KEY no está configurada**: La clave de encriptación no está en el `.env` o es inválida.

3. **Formato incorrecto**: La clave encriptada en la base de datos está corrupta o en formato incorrecto.

## Soluciones

### Opción 1: Regenerar API Keys (Recomendado)

1. **Elimina las API keys existentes** desde el frontend (Settings)
2. **Agrega las API keys nuevamente** - se encriptarán con la clave actual

### Opción 2: Verificar ENCRYPTION_KEY

1. **Verifica que `ENCRYPTION_KEY` esté en tu `.env`**:
   ```bash
   # Debe ser una clave de 44 caracteres (base64)
   ENCRYPTION_KEY=tu_clave_aqui_de_44_caracteres
   ```

2. **Si no tienes una clave válida**, genera una nueva:
   ```python
   from cryptography.fernet import Fernet
   print(Fernet.generate_key().decode())
   ```

3. **IMPORTANTE**: Si generas una nueva clave, todas las API keys existentes se volverán inválidas. Deberás agregarlas nuevamente.

### Opción 3: Resetear Base de Datos (Solo desarrollo)

Si estás en desarrollo y no te importa perder datos:

1. Elimina las tablas de la base de datos
2. Reinicia el servidor (las tablas se crearán automáticamente)
3. Agrega las API keys nuevamente

## Verificación

Después de aplicar la solución:

1. Ve a Settings en el frontend
2. Elimina todas las API keys existentes
3. Agrega las API keys nuevamente
4. Intenta ejecutar un prompt en el Playground

## Prevención

- **NUNCA cambies `ENCRYPTION_KEY` en producción** sin migrar las claves
- **Guarda `ENCRYPTION_KEY` de forma segura** - es crítica para desencriptar las API keys
- **Usa variables de entorno** - nunca hardcodees la clave

