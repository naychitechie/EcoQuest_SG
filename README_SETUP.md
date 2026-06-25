# GreenRoute - AI-Powered Carbon-Aware Commute Planner for Singapore

![GreenRoute Banner](https://img.shields.io/badge/Made%20with-%E2%9D%A4%20Carbon%20Awareness-green)

## Overview

GreenRoute is a Next.js web application that helps Singapore commuters make environmentally conscious travel decisions. It compares different transport modes (MRT, Bus, Walking, Driving) not just by **speed and fare**, but by **actual CO₂ emissions**.

The app uses real-time data from Singapore's official infrastructure:
- **LTA Datamall** for real-time bus arrivals and train alerts
- **OneMap SLA** for routing and geocoding
- **Claude AI** for personalized eco-nudges

### Key Features

✅ **Carbon-Aware Route Comparison** - See CO₂ emissions for each transport option
✅ **Real-Time Singapore Data** - LTA bus arrivals, train service alerts, OneMap routing
✅ **AI Advisor** - Claude generates personalized 2-sentence nudges for each journey
✅ **Trip Tracking** - LocalStorage persistence to track total carbon savings
✅ **Impact Dashboard** - See your cumulative CO₂ reduction visualized as "trees saved"
✅ **Zero Infrastructure** - No backend database, all client-side + API proxies

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + Tailwind CSS + TypeScript
- **Maps**: Leaflet.js + OneMap tiles
- **APIs**: LTA Datamall + OneMap SLA (both free, no commercial restrictions)
- **AI**: Claude API (claude-3-5-sonnet-20241022)
- **State**: React useState + LocalStorage
- **Deployment**: Vercel (free tier)

## Setup Instructions

### 1. Prerequisites

```bash
Node.js 18+ 
npm or yarn
```

### 2. Clone & Install

```bash
git clone https://github.com/yourusername/greenroute.git
cd greenroute
npm install --legacy-peer-deps
```

### 3. Get API Keys

#### LTA Datamall (for bus/train data)
1. Visit https://datamall.lta.gov.sg/content/datamall/en.html
2. Sign up for a free account
3. Generate an API key (instant)
4. Copy your **AccountKey**

#### OneMap SLA (for routing & geocoding)
1. Visit https://www.onemap.gov.sg/apidocs
2. Sign up for a free account
3. Generate a token via `POST /api/auth/post/getToken` with email/password
4. Copy your **token** (valid for 3 days)

#### Anthropic Claude API
1. Visit https://console.anthropic.com
2. Sign up for a free account
3. Create an API key
4. Copy your **ANTHROPIC_API_KEY**

### 4. Configure Environment

Create `.env.local` in the project root:

```env
# .env.local
LTA_KEY=your_lta_account_key_here
ONEMAP_TOKEN=your_onemap_token_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Reference

### `/api/geocode`

Converts place names to coordinates using OneMap Search.

**Request**: `GET /api/geocode?q=Jurong East`

**Response**:
```json
{
  "results": [
    {
      "name": "Jurong East MRT Station",
      "lat": 1.3353,
      "lng": 103.7426
    }
  ]
}
```

### `/api/route`

Compares MRT/Bus, Walk, and Drive routes with carbon emissions.

**Request**: 
```bash
POST /api/route
Content-Type: application/json

{
  "origin": {"name": "Jurong East", "lat": 1.3353, "lng": 103.7426},
  "destination": {"name": "Raffles Place", "lat": 1.2855, "lng": 103.8507}
}
```

**Response**:
```json
{
  "origin": {"name": "Jurong East", "lat": 1.3353, "lng": 103.7426},
  "destination": {"name": "Raffles Place", "lat": 1.2855, "lng": 103.8507},
  "pt": {
    "mode": "PT",
    "steps": [
      {"mode": "MRT", "distance": 10.5, "duration": 25, "fare": 2.70}
    ],
    "totalDistance": 10.5,
    "totalDuration": 25,
    "totalFare": 2.70,
    "carbonEmissions": 42  // grams of CO2
  },
  "walk": null,
  "drive": {
    "mode": "DRIVE",
    "steps": [...],
    "totalDistance": 12.0,
    "totalDuration": 28,
    "totalFare": 0,
    "carbonEmissions": 1764  // grams of CO2
  },
  "bestOption": "PT",
  "carbonSavings": {
    "vsDrive": 1722  // grams saved choosing PT instead of driving
  }
}
```

### `/api/insights`

Generates personalized AI nudges using Claude.

**Request**:
```bash
POST /api/insights
Content-Type: application/json

{
  "origin": {"name": "Jurong East", "lat": 1.3353, "lng": 103.7426},
  "destination": {"name": "Raffles Place", "lat": 1.2855, "lng": 103.8507},
  "carbonSavings": 1722,
  "distance": 10.5,
  "duration": 25,
  "transportMode": "Public Transport"
}
```

**Response**:
```json
{
  "text": "By taking the MRT instead of driving, you're saving 1722 grams of CO₂—equivalent to one tree absorbing carbon for a day! Over a month of commutes, you'd spare 34.4 kg of emissions.",
  "carbonSaved": 1722
}
```

## Carbon Emission Factors (Singapore)

| Mode | gCO₂/km | Source |
|------|---------|--------|
| Walk/Cycle | 0 | N/A |
| MRT | 4 | LTA grid mix (~90% renewable) |
| Bus | 25 | Diesel average (20-30 range) |
| Private Car | 147 | LTA 2023 avg. (1.8L/100km, 80g CO₂/L) |
| Grab/Taxi | 150 | Assume ~same as private car |

Sources:
- LTA Singapore Transport Statistics 2023
- IEA Carbon Intensity Database
- OneMap Routing Documentation

## Project Structure

```
greenroute/
├── app/
│   ├── api/
│   │   ├── geocode/          # OneMap search endpoint
│   │   ├── route/            # Route comparison endpoint
│   │   └── insights/         # Claude AI endpoint
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── LocationInput.tsx     # Autocomplete location input
│   ├── RouteCard.tsx         # Individual route display
│   ├── SearchPage.tsx        # Main search component
│   ├── DashboardCard.tsx     # Impact tracking dashboard
│   ├── AiInsightCard.tsx     # AI nudge display
│   ├── HeroSection.tsx       # Landing hero
│   └── RecentLocations.tsx   # Quick access locations
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── constants.ts          # Carbon factors & config
│   └── utils.ts              # Formatting & calculations
├── public/                    # Static assets
├── .env.local                # API keys (not in git)
└── package.json
```

## Key Decisions

### Why No Backend Database?
- **One-day sprint constraint** - zero setup time
- **Client-side state** - all routing cached in React useState
- **LocalStorage persistence** - trips stored in browser
- **Zero infrastructure cost** - no Supabase, Firebase, etc.

### Why Server-Side API Routes for LTA?
- **CORS protection** - LTA API blocks direct browser requests
- **All LTA calls routed through** `/api/route`
- **Security** - API keys never exposed to browser

### Why Claude for Nudges?
- **Personalization at scale** - each journey gets custom context
- **Natural language** - more persuasive than generic tips
- **Real numbers** - cites exact CO₂ savings for THIS route

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

In Vercel dashboard:
1. Add env vars: `LTA_KEY`, `ONEMAP_TOKEN`, `ANTHROPIC_API_KEY`
2. Set Node.js version to 18+
3. Deploy

### Self-Hosted (Docker)

```bash
docker build -t greenroute .
docker run -p 3000:3000 \
  -e LTA_KEY=your_key \
  -e ONEMAP_TOKEN=your_token \
  -e ANTHROPIC_API_KEY=your_key \
  greenroute
```

## Known Limitations

- **OneMap token expires every 3 days** - refresh via `/api/auth/post/getToken`
- **No walking+PT combo visualization** - OneMap PT routes already include walk legs
- **Singapore-only** - carbon factors hardcoded for SG grid mix
- **No real-time alerts** - LTA train alerts fetched once at search time (not live updates)
- **No map visualization** - UI prioritizes text/cards, Leaflet.js installed but not yet integrated

## Future Enhancements

- [ ] Interactive Leaflet map showing all routes
- [ ] Time-based comparison ("leave now" vs "leave at 9am")
- [ ] Carpooling suggestions via Grab API
- [ ] Carbon offset marketplace integration
- [ ] Social leaderboard (neighborhood/company)
- [ ] Mobile app (React Native)

## Contributing

Pull requests welcome! Please:
1. Test with real LTA/OneMap API keys
2. Keep carbon factors updated from official sources
3. Add TypeScript types for new features

## License

MIT - Feel free to use GreenRoute as a reference or fork

## Contact

Built during Singapore's AI Hackathon 2026 🌏
For questions: [your contact info]

---

**Made with 💚 for a greener Singapore**
