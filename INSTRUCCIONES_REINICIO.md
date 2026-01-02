# Cómo Reiniciar el Backend

## Opción 1: Con Docker (Recomendado)

1. **Abre Docker Desktop**:
   - Busca "Docker" en Spotlight (Cmd+Space)
   - O abre desde Applications
   - Espera a que el ícono de Docker en la barra de menú esté verde/activo

2. **Reinicia el backend**:
   ```bash
   cd /Users/patofunes/Desktop/Coding/PromptRouter
   docker-compose restart backend
   ```

3. **O si no está corriendo, inícialo**:
   ```bash
   docker-compose up -d backend
   ```

4. **Verifica que esté funcionando**:
   ```bash
   curl http://localhost:8000/health
   ```

## Opción 2: Sin Docker (Solo para desarrollo)

Si Docker no está disponible, puedes iniciar el backend directamente:

```bash
cd /Users/patofunes/Desktop/Coding/PromptRouter/backend

# Asegúrate de tener las dependencias instaladas
pip install -r requirements.txt

# Inicia el servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Nota**: Necesitarás tener PostgreSQL y Redis corriendo por separado.

## Script Automático

También puedes usar el script que creé:

```bash
./restart-backend.sh
```

Este script detecta automáticamente si Docker está corriendo y usa el método apropiado.

