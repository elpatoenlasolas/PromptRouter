# PromptRouter - Local Development Setup

## Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **PostgreSQL 15+** (or use Docker)
- **Redis** (optional, recommended)
- **Git**

---

## 🚀 Quick Start

### 1. Clone and Setup

```bash
cd /Users/patofunes/Desktop/Coding/PromptRouter
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp ../.env.example .env
```

Edit `.env` with your local credentials:

```env
DATABASE_URL=postgresql://promptrouter:dev_password@localhost:5432/promptrouter
REDIS_URL=redis://localhost:6379/0
ENVIRONMENT=development
API_SECRET_KEY=dev-secret-key-change-in-production
ENCRYPTION_KEY=dev-encryption-key-32-chars!!
```

### 3. Start PostgreSQL & Redis (Using Docker)

```bash
# From project root
docker-compose up -d
```

This will start:
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`

### 4. Run Database Migrations

The app will auto-create tables on startup, but you can verify:

```bash
cd backend
python -c "from app.core.database import engine, Base; import asyncio; asyncio.run(Base.metadata.create_all(engine))"
```

### 5. Start Backend Server

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`

Test it:
```bash
curl http://localhost:8000/health
```

### 6. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000

# Get these from https://clerk.com (create free account)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```

### 7. Start Frontend Server

```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

---

## 📋 Verification Checklist

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] PostgreSQL accessible (check with `psql` or TablePlus)
- [ ] Redis accessible (check with `redis-cli ping`)
- [ ] Can access http://localhost:8000/docs (FastAPI docs)
- [ ] Can access http://localhost:3000 (Next.js app)

---

## 🧪 Testing the Application

### 1. Create Clerk Account (Free)

1. Go to https://clerk.com/sign-up
2. Create a new application
3. Copy the publishable and secret keys to `.env.local`
4. Restart frontend: `npm run dev`

### 2. Sign Up / Sign In

1. Go to http://localhost:3000
2. Click "Get Started" or "Sign In"
3. Create an account using Clerk

### 3. Add API Keys

You'll need at least one LLM provider API key:

- **OpenAI**: https://platform.openai.com/api-keys
- **Anthropic**: https://console.anthropic.com/
- **Google**: https://makersuite.google.com/app/apikey
- **Grok**: https://console.x.ai/

In the app:
1. Go to Settings
2. Click "Add Key"
3. Select provider and paste your API key
4. Click "Add Key"

### 4. Run a Test Prompt

1. Go to Dashboard
2. Scroll to "Recent Requests" or use the Prompt Tester component
3. Enter a prompt like: "Write a haiku about coding"
4. Click "Execute Prompt"
5. See the response and savings calculation!

---

## 🛠️ Development Commands

### Backend

```bash
# Run with auto-reload
uvicorn app.main:app --reload

# Run tests (when implemented)
pytest

# Check code quality
black app/
flake8 app/
mypy app/

# Generate requirements
pip freeze > requirements.txt
```

### Frontend

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

---

## 🐛 Troubleshooting

### Backend won't start

**Error: `could not connect to server: Connection refused`**

→ PostgreSQL not running. Start Docker: `docker-compose up -d`

**Error: `ModuleNotFoundError: No module named 'app'`**

→ Run from backend directory: `cd backend && uvicorn app.main:app --reload`

### Frontend won't start

**Error: `Module not found: Can't resolve '@/components/...'`**

→ Install dependencies: `npm install`

**Error: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not defined`**

→ Create `.env.local` file with Clerk keys

### CORS Errors

→ Check backend CORS settings in `app/main.py`:
```python
allow_origins=["http://localhost:3000", ...]
```

### Database Connection Issues

**Error: `FATAL: database "promptrouter" does not exist`**

→ Create database:
```bash
docker exec -it promptrouter-db psql -U promptrouter -c "CREATE DATABASE promptrouter;"
```

Or access PostgreSQL and create manually:
```bash
psql -U promptrouter -h localhost
CREATE DATABASE promptrouter;
```

---

## 📁 Project Structure

```
PromptRouter/
├── backend/
│   ├── app/
│   │   ├── adapters/       # LLM provider adapters
│   │   ├── api/v1/         # API endpoints
│   │   ├── core/           # Core services (routing, cache, db)
│   │   ├── models/         # Database & Pydantic models
│   │   ├── services/       # Business logic
│   │   └── main.py         # FastAPI app
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/                # Next.js pages (App Router)
│   ├── components/         # React components
│   ├── lib/                # Utilities
│   ├── types/              # TypeScript types
│   └── package.json
├── docker-compose.yml      # Local PostgreSQL & Redis
├── .env.example
└── README.md
```

---

## 🔐 Security Notes for Development

- Never commit `.env` or `.env.local` files
- Use test/development API keys only
- Rotate keys before going to production
- Keep `ENCRYPTION_KEY` and `API_SECRET_KEY` secure

---

## 📚 API Documentation

Once backend is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🎯 Next Steps

1. ✅ Setup complete → Start building features
2. 📖 Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
3. 🧪 Add tests for your code
4. 📊 Monitor costs and savings in the dashboard

---

## 💡 Tips

- Use TablePlus or pgAdmin to view database visually
- Use Postman or Insomnia to test API endpoints
- Enable hot reload in both backend and frontend for faster development
- Check backend logs in terminal for debugging

For questions, check the README or raise an issue.
