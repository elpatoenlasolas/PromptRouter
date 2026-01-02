# Quick Fix para CORS y Error 500

## Problemas resueltos:

### 1. CORS ✅
- Actualizado para permitir `http://localhost:3000` y `http://127.0.0.1:3000`
- Agregado `expose_headers` para mejor compatibilidad

### 2. Error 500 - Usuario no existe ✅
- El endpoint ahora crea automáticamente el usuario si no existe (solo en desarrollo)
- Mejor manejo de errores con rollback de transacciones
- Logging mejorado para debugging

## Para probar:

1. **Asegúrate de que el backend esté corriendo**:
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```

2. **Verifica las variables de entorno**:
   - `DATABASE_URL` debe estar configurada
   - `ENCRYPTION_KEY` debe ser una clave válida de Fernet (44 caracteres)
   - `API_SECRET_KEY` debe estar configurada

3. **Si no tienes ENCRYPTION_KEY**, genera una:
   ```python
   from cryptography.fernet import Fernet
   print(Fernet.generate_key().decode())
   ```
   Agrega el resultado a tu `.env` como `ENCRYPTION_KEY=...`

4. **Prueba agregar una API key** desde el frontend

## Si aún hay errores:

1. Revisa los logs del backend para ver el error exacto
2. Verifica que la base de datos esté corriendo y accesible
3. Asegúrate de que las tablas estén creadas (se crean automáticamente al iniciar)

