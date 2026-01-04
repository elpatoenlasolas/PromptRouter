# PromptRouter - Complete Project Structure

## 📁 Directory Tree

```
PromptRouter/
│
├── 📄 README.md                    # Main project documentation
├── 📄 LICENSE                      # MIT License
├── 📄 DEVELOPMENT.md               # Local development guide
├── 📄 DEPLOYMENT.md                # Production deployment guide
├── 📄 ROADMAP.md                   # 90-day product roadmap
├── 📄 .env.example                 # Environment variables template
├── 📄 .gitignore                   # Git ignore rules
├── 📄 docker-compose.yml           # Local PostgreSQL + Redis setup
├── 📄 quickstart.sh                # One-command setup script
│
├── 🐍 backend/                     # FastAPI backend application
│   ├── 📄 README.md                # Backend-specific docs
│   ├── 📄 Dockerfile               # Container configuration
│   ├── 📄 requirements.txt         # Python dependencies
│   ├── 📄 railway.json             # Railway deployment config (legacy)
│   ├── 📄 railway.toml             # Railway deployment config
│   │
│   └── app/                        # Application code
│       ├── __init__.py
│       ├── 📄 main.py              # FastAPI app entry point
│       ├── 📄 config.py            # Application configuration
│       ├── 📄 middleware.py        # Error handling middleware
│       │
│       ├── adapters/               # LLM Provider Adapters
│       │   ├── __init__.py
│       │   ├── 📄 base.py          # Base adapter interface
│       │   ├── 📄 openai.py        # OpenAI adapter
│       │   ├── 📄 anthropic.py     # Anthropic adapter
│       │   ├── 📄 google.py        # Google AI adapter
│       │   └── 📄 grok.py          # Grok adapter
│       │
│       ├── api/                    # API endpoints
│       │   ├── __init__.py
│       │   └── v1/                 # API version 1
│       │       ├── __init__.py
│       │       ├── 📄 prompt.py    # Prompt execution endpoint
│       │       ├── 📄 metrics.py   # Metrics/analytics endpoint
│       │       ├── 📄 config.py    # User configuration endpoint
│       │       └── 📄 usage.py     # Usage tracking endpoint
│       │
│       ├── core/                   # Core business logic
│       │   ├── 📄 database.py      # Database connection
│       │   ├── 📄 router.py        # Routing engine (cost optimization)
│       │   ├── 📄 cache.py         # Redis caching layer
│       │   └── 📄 security.py      # Encryption/decryption
│       │
│       ├── models/                 # Data models
│       │   ├── 📄 database.py      # SQLAlchemy ORM models
│       │   └── 📄 schemas.py       # Pydantic schemas (validation)
│       │
│       └── services/               # Business services
│           ├── 📄 execution.py     # Prompt execution logic
│           ├── 📄 execution_updated.py  # Updated execution service
│           └── 📄 usage_limits.py  # Usage tracking & limits
│
├── ⚛️  frontend/                   # Next.js frontend application
│   ├── 📄 package.json             # Node.js dependencies
│   ├── 📄 tsconfig.json            # TypeScript configuration
│   ├── 📄 tailwind.config.js       # Tailwind CSS config
│   ├── 📄 next.config.js           # Next.js config
│   ├── 📄 postcss.config.js        # PostCSS config (auto-generated)
│   ├── 📄 .env.local.example       # Frontend environment template
│   ├── 📄 vercel.json              # Vercel deployment config
│   ├── 📄 middleware.ts            # Clerk auth middleware
│   │
│   ├── app/                        # Next.js App Router pages
│   │   ├── 📄 layout.tsx           # Root layout (with Clerk provider)
│   │   ├── 📄 page.tsx             # Landing page
│   │   ├── 📄 globals.css          # Global styles
│   │   │
│   │   ├── dashboard/              # Protected dashboard area
│   │   │   ├── 📄 layout.tsx       # Dashboard layout with nav
│   │   │   ├── 📄 page.tsx         # Main dashboard (metrics, savings)
│   │   │   ├── requests/           # Request history (future)
│   │   │   └── settings/           
│   │   │       └── 📄 page.tsx     # Settings page (API keys, tier)
│   │   │
│   │   ├── onboarding/             # First-time user flow
│   │   │   └── 📄 page.tsx         # 60-second onboarding
│   │   │
│   │   ├── sign-in/                # Clerk sign-in
│   │   │   └── [[...sign-in]]/
│   │   │       └── 📄 page.tsx
│   │   │
│   │   └── sign-up/                # Clerk sign-up
│   │       └── [[...sign-up]]/
│   │           └── 📄 page.tsx
│   │
│   ├── components/                 # React components
│   │   ├── 📄 PromptTester.tsx     # Test prompt execution UI
│   │   │
│   │   └── dashboard/              # Dashboard-specific components
│   │       ├── 📄 SavingsChart.tsx # Recharts visualization
│   │       └── 📄 RecentRequests.tsx # Recent requests table
│   │
│   ├── lib/                        # Utility functions
│   │   └── 📄 utils.ts             # cn(), formatCurrency(), etc.
│   │
│   └── types/                      # TypeScript type definitions
│       └── 📄 index.ts             # Shared types (API responses, etc.)
│
└── 🗄️  Database Schema (PostgreSQL)
    ├── users                       # User accounts
    ├── user_api_keys               # Encrypted LLM provider keys
    ├── prompt_executions           # Execution history
    └── (auto-created on startup)
```

---

## 🔑 Key Files Explained

### Backend

**[app/main.py](backend/app/main.py)**
- FastAPI application entry point
- CORS middleware configuration
- Exception handlers
- Route registration
- Database initialization

**[app/core/router.py](backend/app/core/router.py)**
- **THE BRAIN** of PromptRouter
- Cost-based model selection algorithm
- Filters models by constraints (latency, quality, cost)
- Generates routing explanations
- Calculates savings vs. expensive alternative

**[app/adapters/](backend/app/adapters/)**
- Normalize different LLM APIs into a common interface
- Handle provider-specific authentication
- Calculate token-based costs
- Manage rate limits and errors

**[app/services/execution.py](backend/app/services/execution.py)**
- Orchestrates the full prompt execution flow:
  1. Fetch user API keys
  2. Select optimal model via routing engine
  3. Execute prompt via provider adapter
  4. Calculate costs and savings
  5. Store execution record in database

**[app/models/database.py](backend/app/models/database.py)**
- SQLAlchemy ORM models
- Defines database schema:
  - `User` - User accounts and tier
  - `UserAPIKey` - Encrypted provider keys
  - `PromptExecution` - Execution history with costs

### Frontend

**[app/dashboard/page.tsx](frontend/app/dashboard/page.tsx)**
- **THE HERO** of the UX
- Shows total savings vs. estimated spend
- Real-time metrics (tokens, latency, errors)
- Recent requests table
- Savings visualization chart

**[components/PromptTester.tsx](frontend/components/PromptTester.tsx)**
- Interactive prompt testing UI
- Shows routing decision and savings for each prompt
- Used in onboarding and dashboard

**[middleware.ts](frontend/middleware.ts)**
- Clerk authentication middleware
- Protects `/dashboard/*` routes
- Redirects unauthenticated users to sign-in

### Configuration

**[docker-compose.yml](docker-compose.yml)**
- Local development environment
- Spins up PostgreSQL + Redis
- Pre-configured with dev credentials

**[.env.example](.env.example)**
- Template for all required environment variables
- Copy to `.env` (backend) or `.env.local` (frontend)

**[railway.toml](backend/railway.toml)**
- Railway deployment configuration
- Healthcheck, start command, build settings

**[vercel.json](frontend/vercel.json)**
- Vercel deployment configuration
- Environment variables, build settings

---

## 🔄 Data Flow

### Prompt Execution Flow

```
User (Frontend)
    │
    ├─ POST /v1/prompt { prompt: "..." }
    │
    ▼
FastAPI Gateway
    │
    ├─ Extract user_id from auth (Clerk JWT)
    │
    ▼
PromptExecutionService
    │
    ├─ Fetch user's API keys from DB
    ├─ Call RoutingEngine.select_model()
    │   │
    │   ├─ Filter models by available providers
    │   ├─ Apply constraints (latency, quality, cost)
    │   └─ Select cheapest model
    │
    ├─ Initialize provider adapter (e.g., OpenAIAdapter)
    ├─ adapter.execute(prompt) → response
    ├─ Calculate cost & savings
    ├─ Store execution in DB
    │
    ▼
Response to User
    {
      "response": "...",
      "model": "gpt-3.5-turbo",
      "cost": 0.002,
      "saved": 0.018,
      "routing_reason": "Cheapest option | 750ms latency"
    }
```

---

## 🧪 Testing Locally

### 1. Start Infrastructure
```bash
docker-compose up -d
```

### 2. Run Backend
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### 3. Run Frontend
```bash
cd frontend
npm run dev
```

### 4. Visit
- Frontend: http://localhost:3000
- Backend API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

---

## 📦 Dependencies

### Backend Key Packages
- `fastapi` - Web framework
- `sqlalchemy` - ORM
- `asyncpg` - Async PostgreSQL driver
- `redis` - Caching
- `openai`, `anthropic`, `google-generativeai` - LLM SDKs
- `cryptography` - API key encryption
- `pydantic` - Data validation

### Frontend Key Packages
- `next` - React framework
- `@clerk/nextjs` - Authentication
- `recharts` - Data visualization
- `tailwindcss` - Styling
- `axios` - HTTP client
- `lucide-react` - Icons

---

## 🚀 Deployment Checklist

### Backend (Railway)
- [ ] Create Railway project
- [ ] Add PostgreSQL database
- [ ] Add Redis (optional)
- [ ] Set environment variables
- [ ] Deploy from GitHub or CLI
- [ ] Test `/health` endpoint

### Frontend (Vercel)
- [ ] Connect GitHub repo
- [ ] Set environment variables (Clerk, API URL)
- [ ] Deploy
- [ ] Update backend CORS origins

### Post-Deployment
- [ ] Create Clerk account and configure
- [ ] Test sign-up flow
- [ ] Add test API key
- [ ] Execute test prompt
- [ ] Verify savings calculation

---

## 📚 Further Reading

- **API Documentation:** http://localhost:8000/docs (when running)
- **Clerk Setup:** https://clerk.com/docs/quickstarts/nextjs
- **Railway Docs:** https://docs.railway.app/
- **Vercel Docs:** https://vercel.com/docs

---

**Questions?** Check [DEVELOPMENT.md](DEVELOPMENT.md) or [DEPLOYMENT.md](DEPLOYMENT.md)
