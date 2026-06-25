# GreenRoute - Quick Start Guide

> Get GreenRoute running in 5 minutes

## Step 1: Install & Run (2 min)

```bash
cd /Users/naychizaw/Workspace/vs_code/GreenRoute

# Already installed, just run:
npm run dev

# Opens on http://localhost:3000
```

## Step 2: Get API Keys (3 min)

### 🔑 LTA Datamall Key
1. Visit: https://datamall.lta.gov.sg
2. Sign up → Verify email
3. Copy your **AccountKey**

### 🔑 OneMap Token
1. Visit: https://www.onemap.gov.sg/apidocs
2. Sign up → POST to `/api/auth/post/getToken`
3. Body: `{ "email": "your@email.com", "password": "password" }`
4. Copy **token** from response

### 🔑 Claude API Key
1. Visit: https://console.anthropic.com
2. Create API key
3. Copy **ANTHROPIC_API_KEY**

## Step 3: Add Keys to .env.local

```bash
# Already exists at: .env.local
# Just add your keys:

LTA_KEY=paste_here
ONEMAP_TOKEN=paste_here
ANTHROPIC_API_KEY=paste_here
```

## Step 4: Test

1. Open http://localhost:3000 ✅
2. Type "Jurong East" in "From" field
3. Type "Raffles Place" in "To" field
4. Click "Compare Routes"
5. Should see 3 route options with CO₂ emissions

**Done! 🎉**

---

## Common Issues

### "Route not available"
→ API keys not set or invalid. Check `.env.local` and restart server.

### "Geocode error"
→ OneMap token expired (valid 3 days only). Get a new one.

### Build error
→ Run: `npm install --legacy-peer-deps`

---

## Deployment (5 min)

### To Vercel
```bash
npm run build      # Verify build works
vercel --prod      # Deploy

# In Vercel dashboard, add env vars:
# LTA_KEY, ONEMAP_TOKEN, ANTHROPIC_API_KEY
```

### Docker
```bash
docker build -t greenroute .
docker run -p 3000:3000 \
  -e LTA_KEY=your_key \
  -e ONEMAP_TOKEN=your_token \
  -e ANTHROPIC_API_KEY=your_key \
  greenroute
```

---

## Key Features

✅ Compare 3 transport modes by CO₂ emissions  
✅ Real-time location autocomplete  
✅ AI nudges (Claude-powered)  
✅ Track impact across trips  
✅ Mobile-responsive design  

---

## Documentation

- 📖 [Full Setup Guide](README_SETUP.md)
- 📚 [API Reference](API_DOCS.md)
- ✅ [Pre-Deployment Checklist](SETUP_CHECKLIST.md)
- 📋 [Build Summary](BUILD_SUMMARY.md)

---

**Questions?** Check the docs or see BUILD_SUMMARY.md for troubleshooting.

**Ready to go green! 🌱**
