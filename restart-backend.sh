#!/bin/bash

echo "🔄 Reiniciando backend..."

# Check if Docker is running
if docker info > /dev/null 2>&1; then
    echo "✅ Docker está corriendo, usando docker-compose..."
    cd "$(dirname "$0")"
    
    # Stop and remove backend container
    docker-compose stop backend 2>/dev/null
    docker-compose rm -f backend 2>/dev/null
    
    # Rebuild and start
    docker-compose up -d --build backend
    
    echo "⏳ Esperando que el backend inicie..."
    sleep 5
    
    # Check if it's running
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "✅ Backend reiniciado y funcionando en http://localhost:8000"
        docker-compose logs backend --tail 10
    else
        echo "❌ Backend no responde. Revisa los logs:"
        docker-compose logs backend --tail 20
    fi
else
    echo "⚠️  Docker no está corriendo"
    echo ""
    echo "Para iniciar con Docker:"
    echo "  1. Abre Docker Desktop"
    echo "  2. Espera a que esté listo"
    echo "  3. Ejecuta: docker-compose up -d backend"
    echo ""
    echo "O inicia el backend manualmente con:"
    echo "  cd backend && python3 -m uvicorn app.main:app --reload --port 8000"
fi

