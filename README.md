# PromptRouter 🎯

**Intelligent AI API cost optimizer and prompt router**

> Stop overpaying for AI. Automatically route every prompt to the cheapest model that meets your quality and speed requirements.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

---

## 🌟 What is PromptRouter?

PromptRouter is an **API-first micro-SaaS** that intelligently routes each AI prompt to the optimal model based on:
- ✅ **Cost** (primary optimization)
- ✅ **Latency** constraints
- ✅ **Quality** requirements  
- ✅ **Reliability** scores

**Users think in euros, not tokens.** See exactly how much you save on every request.

---

## 💰 Why PromptRouter?

In 2026, AI API costs are rising and the number of available LLMs is exploding. Companies waste **hundreds of euros per month** manually testing and switching models.

**PromptRouter solves this by:**
- 🎯 Routing prompts to the cheapest viable model automatically
- 💶 Showing real-time savings vs. standard pricing (e.g., always using GPT-4)
- 🔐 Using YOUR API keys (bring-your-own-keys) with no markup
- ⚡ Explaining every routing decision transparently
- 🚫 No vendor lock-in

### Example Savings

| Scenario | Without PromptRouter | With PromptRouter | Saved |
|----------|---------------------|-------------------|--------|
| 1M tokens/month | €30 (GPT-4) | €8 (Smart routing) | **€22** |
| Customer support bot | €150/month | €45/month | **€105** |
| Content generation | €200/month | €60/month | **€140** |

---

## 🚀 Quick Start

### 1️⃣ Local Development

```bash
# Clone the repo
cd /Users/patofunes/Desktop/Coding/PromptRouter

# Start backend (FastAPI + PostgreSQL + Redis)
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Start frontend (Next.js)
cd ../frontend
npm install && npm run dev
```

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed setup instructions.

### 2️⃣ Deploy to Production

- **Backend**: Deploy to Railway (PostgreSQL + Redis included)
- **Frontend**: Deploy to Vercel

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step deployment guide.

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Next.js App   │  ← Vercel
│  (Dashboard UI) │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  FastAPI Backend│  ← Railway
│ (Routing Engine)│
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌──────┐
│ Postgres│ │Redis │
│  (Data) │ │(Cache)│
└─────────┘ └──────┘
         │
         ▼
  ┌──────────────────────┐
  │  LLM Provider APIs   │
  │ OpenAI • Anthropic   │
  │ Google • Grok        │
  └──────────────────────┘
```

### Tech Stack

**Backend:**
- FastAPI (Python 3.11+)
- PostgreSQL (user data, executions, costs)
- Redis (caching, rate limiting)
- Provider adapters (OpenAI, Anthropic, Google, Grok)

**Frontend:**
- Next.js 14 (App Router)
- Tailwind CSS
- Recharts (data visualization)
- Clerk (authentication)

**Deployment:**
- Railway (backend + databases)
- Vercel (frontend)

---

## 📖 Key Features

### ✅ MVP (Ready Now)

- [x] Multi-provider routing (OpenAI, Anthropic, Google, Grok)
- [x] Cost optimization algorithm
- [x] Real-time savings dashboard
- [x] Secure API key storage (encrypted)
- [x] Latency & quality constraints
- [x] Routing decision explanations
- [x] Usage tracking & limits
- [x] API-first design

### 🚧 Coming Soon

- [ ] Stripe billing integration
- [ ] Advanced analytics (cost per endpoint, A/B testing)
- [ ] Custom routing rules
- [ ] Prompt caching
- [ ] Team collaboration
- [ ] Webhook notifications

---

## 💳 Pricing

| Tier | Price | Token Limit | Features |
|------|-------|-------------|----------|
| **Free** | €0/month | 10K tokens | Basic routing, 1 API key |
| **Starter** | €15/month | 1M tokens | All providers, priority support |
| **Pro** | €25/month | 5M tokens | Advanced analytics, teams |

**Save more than the subscription cost or get a refund.**

---

## 🎯 Product Principles

1. **Users think in euros, not tokens**
2. **Savings-first UX** - Every view shows how much you saved
3. **Bring-your-own-API-keys** - No markup, no lock-in
4. **Explain every decision** - Transparent routing logic
5. **Neutral infrastructure** - No provider preference

---

## 📊 North Star Metric

**Total euros saved by users** 

This aligns our success with customer value.

---

## 🛣️ Roadmap

### Phase 1: MVP (30 days) ✅
- Core routing engine
- Basic dashboard
- Authentication & billing setup
- Deploy to production

### Phase 2: Differentiation (60 days)
- Advanced analytics
- Prompt caching
- Custom routing rules
- Team features

### Phase 3: Moat (90 days)
- ML-based model selection
- Cost prediction
- Auto-scaling suggestions
- Enterprise features

---

## 🧪 Example Usage

### Via Dashboard
1. Sign up at https://promptrouter.vercel.app
2. Add your API keys (OpenAI, Anthropic, etc.)
3. Run a test prompt
4. See immediate savings!

### Via API

```bash
curl -X POST https://api.promptrouter.com/v1/prompt \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a short poem about AI",
    "max_tokens": 100,
    "constraints": {
      "max_latency_ms": 2000,
      "min_quality_tier": "standard"
    }
  }'
```

Response:
```json
{
  "response": "In circuits bright and code so clean...",
  "model": "claude-3-haiku-20240307",
  "provider": "anthropic",
  "cost": 0.0023,
  "saved": 0.0177,
  "routing_reason": "Cheapest option (87% cheaper than GPT-4) | standard quality | ~650ms latency | €0.0012 avg/1K tokens",
  "latency_ms": 650
}
```

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙋 Support

- **Documentation**: [docs.promptrouter.com](https://docs.promptrouter.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/promptrouter/issues)
- **Email**: support@promptrouter.com

---

## 🌟 Star Us!

If PromptRouter saves you money, give us a star ⭐️

---

**Built with ❤️ for developers who care about AI costs**

A webapp + API that automatically routes every AI prompt to the cheapest model that meets your quality and speed requirements.

## Value Proposition

In 2026, AI API costs are rising and the number of available LLMs is exploding. Companies and power-users waste hundreds of euros per month manually testing and switching models without knowing which one is cheapest, fast enough, or good enough for each task.

**PromptRouter saves you money** by intelligently routing each prompt to the optimal AI model based on cost, latency, reliability, and quality constraints.

## North Star Metric

**Total euros saved by users**

## Tech Stack

### Frontend
- Next.js 14+ (App Router)
- Tailwind CSS
- Recharts (savings visualization)
- Clerk (authentication)
- Deployed on Vercel

### Backend
- FastAPI (Python 3.11+)
- PostgreSQL (Railway)
- Redis (caching)
- Deployed on Railway

## Architecture

```
┌─────────────────┐
│   Next.js App   │  (Vercel)
│   Dashboard     │
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────┐
│  FastAPI Gateway│  (Railway)
│  /v1/prompt     │
└────────┬────────┘
         │
    ┌────┴─────┬──────────┬─────────┐
    ▼          ▼          ▼         ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ OpenAI │ │Anthropic│ │ Google │ │  Grok  │
└────────┘ └────────┘ └────────┘ └────────┘
```

## Product Principles

1. **Users think in euros, not tokens**
2. **Savings-first UX** — Dashboard shows money saved
3. **Bring-your-own-API-keys** — We route, you own the data
4. **Neutral infrastructure** — No vendor lock-in
5. **Immediate value** — See savings after first prompt

## Project Structure

```
PromptRouter/
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── adapters/  # LLM provider adapters
│   │   ├── api/       # API routes
│   │   ├── core/      # Routing engine
│   │   ├── models/    # Database models
│   │   └── services/  # Business logic
│   ├── tests/
│   └── requirements.txt
│
├── frontend/          # Next.js application
│   ├── app/           # App router pages
│   ├── components/    # React components
│   ├── lib/           # Utilities
│   └── public/
│
├── shared/            # Shared types/schemas
└── docker-compose.yml # Local development
```

## Getting Started

See `/backend/README.md` and `/frontend/README.md` for setup instructions.

## Business Model

| Tier | Price | Limit |
|------|-------|-------|
| Free | €0 | 10K tokens/month |
| Starter | €15/month | 500K tokens/month |
| Pro | €25/month | 5M tokens/month |

Users save more than the subscription cost through intelligent routing.

## License

Proprietary
