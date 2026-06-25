# SETUP CHECKLIST FOR GREENROUTE

## Pre-Deployment Checklist

Use this checklist to ensure GreenRoute is properly configured before deployment.

### Phase 1: API Key Registration ✅

- [ ] **LTA Datamall Account**
  - [ ] Visit https://datamall.lta.gov.sg/content/datamall/en.html
  - [ ] Create account (email, password, basic info)
  - [ ] Verify email
  - [ ] Generate AccountKey under "Settings"
  - [ ] Copy AccountKey and store securely
  - **Test**: `curl "https://www.ltaodataservice.gov.sg/ltaodataservice/v3/BusArrival?BusStopCode=10011&AccountKey=YOUR_KEY"`

- [ ] **OneMap SLA Account**
  - [ ] Visit https://www.onemap.gov.sg/apidocs
  - [ ] Click "Plans & Pricing" → "Sign Up"
  - [ ] Create account (email, password)
  - [ ] Verify email
  - [ ] Under "API Accounts", generate token via:
    - [ ] POST request: `https://www.onemap.gov.sg/api/auth/post/getToken`
    - [ ] Body: `{ "email": "your@email.com", "password": "your_password" }`
    - [ ] Save the `token` (valid 3 days)
  - **Test**: Geocode API call with your token

- [ ] **Anthropic Claude API**
  - [ ] Visit https://console.anthropic.com
  - [ ] Sign up (free tier available)
  - [ ] Create API key under "API Keys"
  - [ ] Copy ANTHROPIC_API_KEY
  - **Test**: `curl https://api.anthropic.com/v1/messages -H "x-api-key: YOUR_KEY"`

### Phase 2: Local Environment Setup ✅

- [ ] Create `.env.local` file in project root
- [ ] Add all three keys:
  ```env
  LTA_KEY=your_lta_account_key
  ONEMAP_TOKEN=your_onemap_token  
  ANTHROPIC_API_KEY=your_anthropic_key
  ```
- [ ] Never commit `.env.local` to git (already in `.gitignore`)
- [ ] Verify keys are loaded: `npm run dev` and check browser console (should not show "undefined")

### Phase 3: Local Testing ✅

- [ ] `npm install --legacy-peer-deps` (completes successfully)
- [ ] `npm run dev` (starts on http://localhost:3000)
- [ ] [ ] **Test Location Search**
  - Type "Jurong East" in "From" field
  - Wait 300ms for autocomplete
  - Results should appear from OneMap Search API
  - Click one to select

- [ ] **Test Route Comparison**
  - Select "Jurong East" as origin
  - Select "Raffles Place" as destination
  - Click "Compare Routes"
  - Should see PT, Walk, Drive route cards within 5 seconds
  - Each should show: duration, distance, fare, CO₂ emissions

- [ ] **Test AI Insights**
  - After route comparison loads
  - "AI Advisor" card should appear below routes
  - Should show Claude-generated 2-sentence nudge
  - Should cite specific CO₂ savings

- [ ] **Test Dashboard**
  - Select one of the routes
  - Should add to "Your Impact This Session" dashboard
  - CO₂ saved, trips count, and tree equivalents should update

### Phase 4: Vercel Deployment ✅

- [ ] Commit code to GitHub (excluding `.env.local`)
- [ ] `npm run build` (no errors locally)
- [ ] Link repository to Vercel project
- [ ] In Vercel dashboard → Settings → Environment Variables:
  - [ ] Add `LTA_KEY`
  - [ ] Add `ONEMAP_TOKEN`
  - [ ] Add `ANTHROPIC_API_KEY`
- [ ] Deploy via `vercel --prod`
- [ ] Test 3 real routes on production:
  1. Jurong East → Raffles Place
  2. Tampines → Orchard
  3. Choa Chu Kang → Novena

### Phase 5: Production Validation ✅

- [ ] [ ] **Verify API calls work**
  - Check browser Network tab
  - `/api/geocode` should return results
  - `/api/route` should return comparison object
  - `/api/insights` should stream Claude response

- [ ] **Check error handling**
  - Try searching with invalid location
  - Should show graceful error messages, not crashes
  - Open DevTools Console - no red errors

- [ ] **Monitor Vercel logs**
  - Visit Vercel dashboard → Deployments → Functions
  - Check for any 500 errors in API routes
  - Fix any CORS or timeout issues

---

## Troubleshooting

### "Routes not available" on all modes
**Likely causes:**
- OneMap token expired (valid only 3 days) → regenerate
- LTA_KEY invalid → verify at datamall.lta.gov.sg
- Invalid coordinates → ensure Location has lat/lng as numbers

**Fix:**
```bash
# Check env vars are loaded
console.log(process.env.LTA_KEY, process.env.ONEMAP_TOKEN)

# Regenerate OneMap token every 3 days
curl -X POST https://www.onemap.gov.sg/api/auth/post/getToken \
  -H "Content-Type: application/json" \
  -d '{"email": "your@email.com", "password": "your_password"}'
```

### "Geocode error" / autocomplete not working
**Check:**
- OneMap token is valid
- Network tab shows `/api/geocode` returning 200
- Query length >= 2 characters

**Fix:**
```bash
# Test geocode endpoint directly
curl "http://localhost:3000/api/geocode?q=Jurong%20East"
```

### Claude nudges not generating (blank AI card)
**Check:**
- ANTHROPIC_API_KEY is set correctly
- Anthropic account has API credits remaining
- No timeout in `/api/insights` route

**Fix:**
- Visit https://console.anthropic.com to verify account status
- Check rate limits haven't been exceeded
- Look at Vercel logs for streaming errors

### CORS errors in browser console
**Root cause:** OneMap API called from browser instead of server-side

**Fix:** All OneMap calls must go through `/api/route` proxy, not directly

---

## OneMap Token Refresh (Important!)

OneMap tokens expire after **3 days**. To avoid service outages:

### Automatic Refresh (Recommended for Production)
Implement token refresh in `/api/route/route.ts`:

```typescript
async function refreshOneMapToken() {
  const response = await fetch('https://www.onemap.gov.sg/api/auth/post/getToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.ONEMAP_EMAIL,
      password: process.env.ONEMAP_PASSWORD,
    }),
  });
  const data = await response.json();
  return data.token;
}
```

### Manual Refresh (For MVP)
Every 3 days:
1. Visit https://www.onemap.gov.sg/apidocs
2. Regenerate token
3. Update `ONEMAP_TOKEN` in Vercel environment variables

---

## Carbon Factors Verification

Before going live, verify these are still accurate for Singapore:

- MRT: 4 gCO₂/km (SG grid ~90% renewable)
- Bus: 25 gCO₂/km (diesel average)
- Car: 147 gCO₂/km (LTA 2023)

**Source**: LTA Singapore Transport Statistics (updated annually)
Check: https://www.lta.gov.sg/content/ltagov/en/industry/statistics_and_publications.html

---

## Performance Targets

For a good user experience, these should be your targets:

| Metric | Target | Tool |
|--------|--------|------|
| Autocomplete response | <500ms | Lighthouse DevTools |
| Route comparison | <3s | Network tab |
| Claude AI generation | <2s | Chrome DevTools |
| Page load | <2s | Vercel Analytics |

---

## Security Notes

⚠️ **Never expose these in browser:**
- LTA_KEY (server-side only)
- ONEMAP_TOKEN (server-side only)  
- ANTHROPIC_API_KEY (server-side only)

✅ **Safe to expose:**
- Location names/coordinates
- Route metrics (time, distance, CO₂)
- UI component code

All external APIs are called through Next.js `/api` routes → never directly from browser.

---

## Monitoring & Alerts

Recommended setup for production:

1. **Vercel Analytics** - Monitor Function execution time, errors
2. **LTA API Status** - Check https://datamall.lta.gov.sg/content/datamall/en.html for outages
3. **OneMap Status** - Monitor https://www.onemap.gov.sg for service alerts
4. **Error Logging** - Send errors to Sentry/LogRocket

---

**Last Updated**: June 2026
**GreenRoute Version**: 0.1.0-beta
