# 🚀 Getting Started with PromptRouter

Welcome! This is your **5-minute guide** to get PromptRouter running locally.

---

## ⚡ Quick Start (Fastest Path)

```bash
# 1. Run the setup script
./quickstart.sh

# 2. Edit environment files with your keys
#    - backend/.env (keep defaults for local dev)
#    - frontend/.env.local (add Clerk keys from https://clerk.com)

# 3. Start backend (Terminal 1)
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# 4. Start frontend (Terminal 2)
cd frontend
npm run dev

# 5. Visit http://localhost:3000
```

That's it! 🎉

---

## 📋 Prerequisites

Before running `./quickstart.sh`, make sure you have:

- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Docker** - [Download](https://www.docker.com/get-started)
- **Git** - Usually pre-installed on Mac/Linux

Check versions:
```bash
python3 --version   # Should be 3.11+
node --version      # Should be 18+
docker --version    # Any recent version
```

---

## 🔑 Get Your API Keys

### 1. Clerk (Authentication) - **REQUIRED**

1. Go to [clerk.com](https://clerk.com)
2. Sign up (free plan)
3. Click "Create Application"
4. Choose "Email & Password" for login
5. Copy these two keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...`
   - `CLERK_SECRET_KEY=sk_test_...`
6. Paste them into `frontend/.env.local`

### 2. LLM Provider Keys - **At least ONE required**

You need at least one LLM provider to test routing:

**OpenAI** (Recommended for testing)
- Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Create new key
- Add in the app Settings page (not in .env)

**Or any of these:**
- **Anthropic**: [console.anthropic.com](https://console.anthropic.com/)
- **Google**: [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- **Grok**: [console.x.ai](https://console.x.ai/)

💡 **Tip:** You add these through the web UI after signing up, not in environment files!

---

## 🧪 Test It Works

### 1. Sign Up
1. Go to http://localhost:3000
2. Click "Get Started"
3. Create an account (Clerk handles this)

### 2. Add API Key
1. Go to Settings
2. Click "Add Key"
3. Select provider (e.g., OpenAI)
4. Paste your API key
5. Click "Add"

### 3. Run Test Prompt
1. Go to Dashboard
2. Find the prompt tester
3. Enter: "Write a haiku about coding"
4. Click "Execute Prompt"
5. **See the magic happen!** 🎯

You should see:
- ✅ Response from the AI
- ✅ Model that was selected
- ✅ Cost of the request
- ✅ **How much you saved** vs. expensive alternative
- ✅ Routing explanation

---

## 🎯 What's Next?

### Try Different Prompts
- Simple question: "What is 2+2?"
- Code generation: "Write a Python function to sort a list"
- Long content: "Write a blog post about AI costs"

Watch how PromptRouter selects different models based on complexity!

### Add More Providers
Add multiple API keys to see routing in action:
- Settings → Add Key → Select different provider

### Deploy to Production
Ready to go live?
1. Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. Deploy backend to Railway
3. Deploy frontend to Vercel
4. Start saving money! 💰

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Error: Database connection failed
# Fix: Make sure Docker is running
docker-compose up -d
docker ps  # Should show PostgreSQL and Redis running
```

### Frontend errors
```bash
# Error: Clerk keys missing
# Fix: Create .env.local file
cp frontend/.env.local.example frontend/.env.local
# Then add your Clerk keys from https://clerk.com
```

### Can't add API key
```bash
# Make sure backend is running
# Check: http://localhost:8000/health
# Should return: {"status": "healthy"}
```

### CORS errors
Check that backend allows `localhost:3000`:
- File: `backend/app/main.py`
- Should see: `allow_origins=["http://localhost:3000", ...]`

---

## 📚 Full Documentation

- **Local Setup**: [DEVELOPMENT.md](DEVELOPMENT.md)
- **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Codebase Tour**: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- **Roadmap**: [ROADMAP.md](ROADMAP.md)

---

## 💡 Pro Tips

1. **Use test API keys** for development (not production keys)
2. **Start with OpenAI** - easiest to test with
3. **Check backend logs** for detailed routing decisions
4. **Try different prompt lengths** to see routing change
5. **Monitor the dashboard** to see savings accumulate

---

## 🎓 Learn More

### Backend (FastAPI)
- API Docs: http://localhost:8000/docs (auto-generated)
- Code: [backend/app/](backend/app/)
- Routing Engine: [backend/app/core/router.py](backend/app/core/router.py)

### Frontend (Next.js)
- Dashboard: [frontend/app/dashboard/](frontend/app/dashboard/)
- Components: [frontend/components/](frontend/components/)

---

## ❓ Still Stuck?

1. Check if all services are running:
   ```bash
   docker ps                    # PostgreSQL + Redis
   curl localhost:8000/health   # Backend
   curl localhost:3000          # Frontend
   ```

2. Review logs:
   ```bash
   # Backend terminal shows detailed logs
   # Frontend terminal shows build/render errors
   ```

3. Read detailed guides:
   - [DEVELOPMENT.md](DEVELOPMENT.md) - Full setup
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Production help

---

## 🎉 Success!

If you can:
- ✅ Sign up
- ✅ Add an API key
- ✅ Execute a prompt
- ✅ See savings calculated

**You're all set!** 🚀

Now go save some money on AI costs! 💰

---

**Built with ❤️ for developers who refuse to overpay**
