# PromptRouter Backend

FastAPI-based routing engine and API gateway for intelligent AI prompt routing.

## Architecture

```
app/
├── main.py              # FastAPI application entry
├── config.py            # Configuration management
├── dependencies.py      # Dependency injection
│
├── api/
│   ├── v1/
│   │   ├── prompt.py    # Prompt execution endpoint
│   │   ├── metrics.py   # Usage and savings metrics
│   │   └── config.py    # User configuration
│
├── core/
│   ├── router.py        # Routing engine
│   ├── cost_calculator.py
│   └── security.py      # API key encryption
│
├── adapters/
│   ├── base.py          # Base adapter interface
│   ├── openai.py
│   ├── anthropic.py
│   ├── google.py
│   └── grok.py
│
├── models/
│   ├── database.py      # SQLAlchemy models
│   └── schemas.py       # Pydantic schemas
│
└── services/
    ├── execution.py     # Prompt execution service
    ├── metrics.py       # Metrics calculation
    └── cache.py         # Redis caching
```

## Setup

### Prerequisites
- Python 3.11+
- PostgreSQL 15+
- Redis 7+

### Installation

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/promptrouter
REDIS_URL=redis://localhost:6379/0
API_SECRET_KEY=your-secret-key
ENCRYPTION_KEY=your-encryption-key
```

### Database Setup

```bash
# Run migrations
alembic upgrade head

# Or use the init script
python scripts/init_db.py
```

### Run Development Server

```bash
uvicorn app.main:app --reload
```

API will be available at `http://localhost:8000`

## API Endpoints

### POST /v1/prompt
Execute a prompt through the routing engine.

```json
{
  "prompt": "Write a haiku about coding",
  "constraints": {
    "max_cost_per_1k_tokens": 0.01,
    "max_latency_ms": 2000,
    "min_quality_tier": "standard"
  }
}
```

### GET /v1/metrics
Get usage and savings metrics.

```json
{
  "total_spend": 12.45,
  "estimated_spend_without_routing": 28.90,
  "total_saved": 16.45,
  "total_requests": 1523,
  "average_latency_ms": 850
}
```

## Testing

```bash
pytest
```

## Deployment (Railway)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

See `railway.json` for configuration.
