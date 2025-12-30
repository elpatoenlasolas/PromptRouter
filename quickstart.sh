#!/bin/bash

# PromptRouter - Quick Start Script
# This script sets up and runs the entire PromptRouter stack locally

set -e  # Exit on error

echo "🚀 PromptRouter Quick Start"
echo "================================"

# Check prerequisites
echo "📋 Checking prerequisites..."

command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3 is required but not installed."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed."; exit 1; }

echo "✅ Prerequisites met"

# Start databases
echo ""
echo "🐳 Starting PostgreSQL and Redis..."
docker-compose up -d

echo "⏳ Waiting for databases to be ready..."
sleep 5

# Setup backend
echo ""
echo "🐍 Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
echo "Installing Python dependencies..."
pip install -q -r requirements.txt

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp ../.env.example .env
    echo "⚠️  Please edit backend/.env with your configuration"
fi

# Setup frontend
echo ""
echo "⚛️  Setting up frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install --silent
fi

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file from template..."
    cp .env.local.example .env.local
    echo "⚠️  Please edit frontend/.env.local with your Clerk keys"
fi

# Instructions
echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit backend/.env with your database URL (or keep defaults for Docker)"
echo "2. Edit frontend/.env.local with your Clerk API keys (get from https://clerk.com)"
echo ""
echo "🚀 To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn app.main:app --reload"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
echo "📚 For more details, see:"
echo "  - DEVELOPMENT.md for local setup"
echo "  - DEPLOYMENT.md for production deployment"
echo "  - ROADMAP.md for feature plans"
