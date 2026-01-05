#!/bin/bash
set -e

echo "Starting PromptRouter API..."

# Run database migrations
echo "Running database migrations..."
alembic upgrade head || echo "Migrations not configured or already applied"

# Start the application
echo "Starting uvicorn server..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
