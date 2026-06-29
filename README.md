# PromptRouter 🎯

**Intelligent AI API cost optimizer and prompt router**

> Stop overpaying for AI. Automatically route every prompt to the cheapest model that meets your quality and speed requirements.

NOTE: The models mentioned in the repo and/or the app may be outdated, as it has not been maintained for months. Please review the latest info in models before creating any API Keys.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Live](https://img.shields.io/badge/Live-prompt--router.com-brightgreen)](https://www.prompt-router.com)

---

## 🌟 What is PromptRouter?

PromptRouter is a **production-ready micro-SaaS** that intelligently routes each AI prompt to the optimal model based on:
- ✅ **Cost** (primary optimization)
- ✅ **Latency** constraints
- ✅ **Quality** requirements  
- ✅ **Provider availability**

**Users see savings in euros, not tokens.** Track exactly how much you save on every request.

---

## 💰 Why PromptRouter?

Companies waste **hundreds of euros per month** by always using premium models or manually switching between providers.

**PromptRouter solves this by:**
- 🎯 Automatically routing to the cheapest viable model
- 💶 Showing real-time savings vs. standard pricing
- 🔐 Using YOUR API keys (BYOK) with zero markup
- ⚡ Transparent routing decisions
- 🚫 No vendor lock-in

### Example Savings

| Scenario | Without PromptRouter | With PromptRouter | Monthly Savings |
|----------|---------------------|-------------------|-----------------|
| Customer support | €150 (GPT-5) | €45 (Smart routing) | **€105** |
| Content generation | €200 (Claude) | €60 (Mixed) | **€140** |
| Data extraction | €100 (GPT-5) | €12 (Gemini Flash) | **€88** |

---

## 🚀 Live Demo

**Production:** [https://www.prompt-router.com](https://www.prompt-router.com)

**API Endpoint:** `https://api.prompt-router.com`

---

## 📚 Quick Start

### 1. Sign Up

Go to [prompt-router.com/sign-up](https://www.prompt-router.com/sign-up) and create a free account.

### 2. Add Your API Keys

In the dashboard, go to Settings and add your LLM provider API keys:
- OpenAI
- Anthropic (Claude)
- Google (Gemini)
- xAI (Grok)

Keys are encrypted at rest and never logged.

### 3. Get Your PromptRouter API Token

In Settings → API Tokens, create a new token. You'll use this to authenticate your requests.

### 4. Start Making Requests

```bash
curl -X POST https://api.prompt-router.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_PROMPTROUTER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Explain quantum computing in simple terms"}
    ]
  }'
```

---

## 🔌 OpenAI-Compatible API

PromptRouter is **100% compatible with the OpenAI SDK**. Just change the base URL:

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.prompt-router.com/v1",
    api_key="YOUR_PROMPTROUTER_TOKEN"  # Your PromptRouter token
)

response = client.chat.completions.create(
    messages=[
        {"role": "user", "content": "Write a haiku about AI"}
    ]
)

print(response.choices[0].message.content)
```

**That's it!** PromptRouter handles model selection, cost optimization, and provider routing automatically.

---

## 🎨 Features

### ✅ Implemented
- [x] **Smart Routing Engine** - Cost-optimized model selection
- [x] **OpenAI-Compatible API** - Drop-in replacement for OpenAI SDK
- [x] **Multi-Provider Support** - OpenAI, Anthropic, Google, xAI
- [x] **Savings Dashboard** - Real-time cost tracking and analytics
- [x] **Encrypted Key Storage** - AES-256 encryption for API keys
- [x] **Usage Tracking** - Token usage and request history
- [x] **Tier-Based Limits** - Free (10K), Starter (500K), Pro (5M tokens/month)
- [x] **Clerk Authentication** - Secure user management with OAuth
- [x] **Webhook Integration** - Automatic user provisioning
- [x] **Production Deployment** - Railway (backend) + Vercel (frontend)

### 🚧 Roadmap
- [ ] Custom routing rules per user
- [ ] A/B testing between models
- [ ] Latency-based routing
- [ ] Streaming support
- [ ] Function calling support
- [ ] Stripe billing integration
- [ ] Team workspaces

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │  Next.js 14 (Vercel)
│   Dashboard     │  - User management (Clerk)
└────────┬────────┘  - Analytics & metrics
         │           - API key management
         │
         ▼
┌─────────────────┐
│   API Gateway   │  FastAPI (Railway)
│   /v1/*         │  - Authentication
└────────┬────────┘  - Rate limiting
         │           - Request routing
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│Routing │ │  Usage │  PostgreSQL (Railway)
│Engine  │ │Tracking│  - User data
└────┬───┘ └───┬────┘  - API keys (encrypted)
     │         │       - Request history
     │         │
     ▼         ▼
┌─────────────────┐
│  LLM Providers  │  User's own API keys
│  - OpenAI       │  - No markup
│  - Anthropic    │  - Direct billing
│  - Google       │  - Full control
│  - xAI          │
└─────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - User data, encrypted keys, analytics
- **SQLAlchemy** - Async ORM
- **Cryptography** - Fernet encryption for API keys
- **Railway** - Production hosting

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Clerk** - Authentication and user management
- **Vercel** - Production hosting

### Infrastructure
- **Railway** - Backend + PostgreSQL database
- **Vercel** - Frontend deployment
- **Clerk** - User authentication + OAuth
- **GitHub** - CI/CD integration

---

## 📖 Documentation

- **[Getting Started](GETTING_STARTED.md)** - Detailed setup guide
- **[API Reference](https://www.prompt-router.com/docs)** - Complete API documentation
- **[Development Guide](DEVELOPMENT.md)** - Local development setup
- **[Production Deployment](PRODUCTION_DEPLOYMENT.md)** - Deploy to production
- **[Testing Guide](TESTING_GUIDE.md)** - Running tests

---

## 🔒 Security

- **Encrypted API Keys** - All LLM provider keys encrypted with Fernet (AES-256)
- **No Key Logging** - API keys never appear in logs or responses
- **HTTPS Only** - All communication over TLS
- **Clerk Auth** - Industry-standard OAuth with GitHub, Google, etc.
- **Environment Isolation** - Separate dev/prod databases and keys
- **Rate Limiting** - Tier-based request limits

---

## 💳 Pricing

### Free Tier
- 10,000 tokens/month
- All providers
- Dashboard access
- **€0/month**

### Starter Tier
- 500,000 tokens/month
- All providers
- Priority routing
- Email support
- **$5/month**

### Pro Tier
- 5,000,000 tokens/month
- All providers
- Custom routing rules
- Priority support
- **$10/month**

> 💡 **You only pay for PromptRouter's service fee.** LLM provider costs are billed directly to you through your own API keys.

---

## 🚀 Deployment

### Production URLs
- **Frontend:** https://www.prompt-router.com
- **API:** https://api.prompt-router.com
- **Docs:** https://www.prompt-router.com/docs

### Environment Variables

**Backend (Railway):**
```bash
DATABASE_URL=postgresql://...
ENCRYPTION_KEY=<44-char-fernet-key>
API_SECRET_KEY=<random-secret>
CLERK_SECRET_KEY=sk_live_...
CLERK_DOMAIN=clerk.prompt-router.com
CLERK_WEBHOOK_SECRET=whsec_...
ENVIRONMENT=production
```

**Frontend (Vercel):**
```bash
NEXT_PUBLIC_API_URL=https://api.prompt-router.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_DOMAIN=https://clerk.prompt-router.com
```

---

## 🧪 Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 13+
- Docker (optional, for databases)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/elpatoenlasolas/PromptRouter.git
cd PromptRouter
```

2. **Start databases (with Docker)**
```bash
docker-compose up -d
```

3. **Setup backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your local config
uvicorn app.main:app --reload --port 8000
```

4. **Setup frontend**
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your local config
npm run dev
```

5. **Access the app**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 📊 Monitoring

### Health Checks
- Backend: `GET https://api.prompt-router.com/health`
- Database: Automatic via Railway

### Logs
- Backend: Railway dashboard → Deployments → Logs
- Frontend: Vercel dashboard → Deployments → Functions

### Metrics
Dashboard shows:
- Total requests
- Total tokens used
- Total spend vs. estimated spend without routing
- Total savings
- Average latency
- Error rate
- Recent requests with routing decisions

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋 Support

- **Documentation:** [prompt-router.com/docs](https://www.prompt-router.com/docs)
- **Email:** contact@promptrouter.com
- **Issues:** [GitHub Issues](https://github.com/elpatoenlasolas/PromptRouter/issues)

---

## 🎯 Built With

Made with ❤️ by developers who were tired of overpaying for AI APIs.

**Stop guessing. Start saving.**

[Get Started →](https://www.prompt-router.com/sign-up)
