# 🚀 DEPLOYMENT CHECKLIST - PromptRouter

## ✅ COMPLETED

### Security Fixes
- ✅ Removed hardcoded credentials from docker-compose.yml
- ✅ Updated .env.example with secure key generation instructions
- ✅ Created .env.docker for local development with environment variables

### Billing & Upgrade Flow
- ✅ Added Plan & Billing section in Settings page
- ✅ Created upgrade flow with buttons in Pricing page
- ✅ Added `/v1/create-checkout-session` endpoint (ready for Stripe)
- ✅ Added tier validation and upgrade logic
- ✅ Visual improvements: progress bars, usage warnings, plan comparisons

---

## 🔑 BEFORE DEPLOYING TO PRODUCTION

### 1. Generate Production Security Keys (5 minutes)

```bash
# In backend directory with venv activated:
cd backend
source venv/bin/activate

# Generate ENCRYPTION_KEY (44 characters)
python -c "from cryptography.fernet import Fernet; print('ENCRYPTION_KEY=' + Fernet.generate_key().decode())"

# Generate API_SECRET_KEY (32+ characters)
python -c "import secrets; print('API_SECRET_KEY=' + secrets.token_urlsafe(32))"
```

**⚠️ CRITICAL**: Save these keys securely! You'll need them for Railway and they cannot be recovered.

---

### 2. Railway Backend Setup (10 minutes)

#### A. Create New Project
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `PromptRouter` repository
4. Choose "Deploy Backend"

#### B. Add PostgreSQL Database
1. In your project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will auto-create `DATABASE_URL` environment variable

#### C. Add Redis
1. Click "+ New" → "Database" → "Redis"
2. Railway will auto-create `REDIS_URL` environment variable

#### D. Configure Environment Variables
Go to Backend service → "Variables" → Add these:

```bash
# Required - Security
ENCRYPTION_KEY=<paste the 44-char key you generated>
API_SECRET_KEY=<paste the 32-char key you generated>

# Required - App Config
ENVIRONMENT=production
DEBUG=False
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app

# Optional - Stripe (when ready)
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_STARTER_PRICE_ID=price_xxxxx
STRIPE_PRO_PRICE_ID=price_xxxxx

# Optional - LLM Provider Keys (for testing)
OPENAI_API_KEY=sk-xxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx
GOOGLE_API_KEY=xxxxx
GROK_API_KEY=xxxxx
```

#### E. Deploy Settings
1. Set "Root Directory" to `/backend`
2. Set "Build Command" to `pip install -r requirements.txt`
3. Set "Start Command" to `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Click "Deploy"

#### F. Get Your Backend URL
- Railway will assign a URL like: `https://promptrouter-production.up.railway.app`
- Copy this URL - you'll need it for Vercel

---

### 3. Vercel Frontend Setup (5 minutes)

#### A. Create New Project
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import from GitHub: `PromptRouter`

#### B. Configure Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

#### C. Environment Variables
Add these in Vercel dashboard:

```bash
# Required - Backend Connection
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app

# Required - Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx

# Optional - Stripe (when ready)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

#### D. Deploy
1. Click "Deploy"
2. Wait for build to complete (~2 minutes)
3. Get your production URL: `https://promptrouter.vercel.app`

---

### 4. Update CORS in Railway (2 minutes)

Go back to Railway → Backend service → Variables:
```bash
ALLOWED_ORIGINS=https://promptrouter.vercel.app,https://promptrouter-git-main.vercel.app
```

Redeploy backend to apply changes.

---

### 5. Setup Clerk Production (5 minutes)

1. Go to [clerk.com](https://clerk.com)
2. Create production instance or switch to production
3. Go to "API Keys" and copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_live_`)
   - `CLERK_SECRET_KEY` (starts with `sk_live_`)
4. Update these in Vercel environment variables
5. In Clerk Dashboard → "Domains" → Add your Vercel domain

---

### 6. Test Production Deployment (10 minutes)

#### A. Test Authentication
- [ ] Sign up with new email
- [ ] Verify email works
- [ ] Log in/out works
- [ ] Dashboard loads correctly

#### B. Test API Connection
- [ ] Go to Settings → Create API Token
- [ ] Add OpenAI API key
- [ ] Go to Playground → Send test prompt
- [ ] Verify request appears in Requests page
- [ ] Check Usage page shows token count

#### C. Test Billing Flow
- [ ] Go to Pricing page
- [ ] Click "Upgrade to Starter" (should show alert: "Stripe checkout coming soon")
- [ ] Verify Settings page shows Free tier and upgrade options

---

### 7. Stripe Setup (Optional - When Ready)

#### A. Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Create account and verify business details
3. Switch to Live mode

#### B. Create Products
1. Dashboard → Products → "+ Add Product"
2. Create "PromptRouter Starter":
   - Price: €15/month
   - Recurring: Monthly
   - Copy the Price ID (starts with `price_`)
3. Create "PromptRouter Pro":
   - Price: €25/month
   - Recurring: Monthly
   - Copy the Price ID

#### C. Setup Webhook
1. Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-backend.railway.app/v1/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy Webhook Secret (starts with `whsec_`)

#### D. Update Environment Variables
Railway Backend:
```bash
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_STARTER_PRICE_ID=price_xxxxx
STRIPE_PRO_PRICE_ID=price_xxxxx
FRONTEND_URL=https://promptrouter.vercel.app
```

Vercel Frontend:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

#### E. Enable Stripe in Code
In `backend/app/api/v1/billing.py`:
- Uncomment the Stripe integration code
- Remove the 501 error responses

#### F. Test Stripe Flow
- [ ] Click "Upgrade to Starter"
- [ ] Redirects to Stripe Checkout
- [ ] Complete test payment (use test card: `4242 4242 4242 4242`)
- [ ] Redirects back to Dashboard
- [ ] Tier updated to "Starter" in Settings
- [ ] Token limit increased to 500K

---

## 📊 PRODUCTION MONITORING

### Check Health Endpoints
```bash
# Backend health
curl https://your-backend.railway.app/health
# Should return: {"status": "healthy"}

# Root endpoint
curl https://your-backend.railway.app/
# Should return service info
```

### Monitor Logs
- **Railway**: Project → Backend → "Deployments" → Click on active deployment
- **Vercel**: Project → "Deployments" → Click on production deployment

### Key Metrics to Watch
- Response time (should be <500ms)
- Error rate (should be <1%)
- Database connections
- Memory usage
- Token usage per user

---

## 🐛 TROUBLESHOOTING

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` in Vercel (must include `https://`)
- Verify CORS is configured in Railway backend
- Check Railway logs for CORS errors

### Clerk authentication fails
- Verify domain is added in Clerk Dashboard
- Check environment variables match (live keys for production)
- Ensure Clerk instance is in production mode

### Database connection errors
- Check `DATABASE_URL` is set (Railway auto-provides this)
- Verify PostgreSQL service is running in Railway
- Check logs for connection pool errors

### API keys not decrypting
- Verify `ENCRYPTION_KEY` is exactly 44 characters
- Check that the same key is used as when keys were encrypted
- If key changed, users need to re-add their provider keys

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

1. **Monitor first users**: Watch logs and error rates
2. **Setup Sentry**: For error tracking and monitoring
3. **Add Stripe**: Complete billing integration
4. **Email notifications**: Setup SendGrid/Resend for usage alerts
5. **Analytics**: Add PostHog or Mixpanel for user tracking
6. **Documentation**: Create public API docs with examples
7. **Marketing**: Launch on Product Hunt, Reddit, Twitter

---

## 📝 DEPLOYMENT SUMMARY

**Current Status: 90% Production Ready**

✅ Ready to deploy:
- Core routing engine
- Multi-provider support
- Authentication (Clerk)
- API token system
- Dashboard and UI
- Settings and configuration
- Upgrade flow UI

⏳ Needs Stripe keys to enable:
- Actual payment processing
- Automatic tier upgrades
- Subscription management

🎉 **You can launch now as a beta** and add Stripe billing within days!

---

## 🔐 SECURITY CHECKLIST

Before going live, verify:
- [ ] ENCRYPTION_KEY is 44 characters (Fernet key)
- [ ] API_SECRET_KEY is 32+ random characters
- [ ] All credentials are in environment variables (not code)
- [ ] DEBUG=False in production
- [ ] CORS is restricted to your frontend domain
- [ ] HTTPS is enabled (Railway and Vercel do this automatically)
- [ ] No test API keys in production environment variables
- [ ] Clerk is in production mode with live keys

---

**Good luck with your launch! 🚀**
