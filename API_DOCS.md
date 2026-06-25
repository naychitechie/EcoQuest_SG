# GreenRoute API Documentation

## Overview

GreenRoute backend consists of four main API routes that handle:
1. **Geocoding** - Convert place names to coordinates
2. **Route Comparison** - Get multi-modal route options with CO₂ estimates
3. **AI Insights** - Generate personalized nudges via Claude
4. **Health Check** - Monitor service status

All API routes are server-side only and never expose sensitive keys to the browser.

---

## API Routes

### 1. GET `/api/geocode`

Converts a place name query into geographic coordinates using OneMap Search API.

#### Request

```
GET /api/geocode?q=Jurong%20East
```

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| q | string | Yes | Search query (min 2 chars) |

#### Response (200 OK)

```json
{
  "results": [
    {
      "name": "Jurong East MRT Station",
      "lat": 1.3353,
      "lng": 103.7426
    },
    {
      "name": "Jurong East Street 12",
      "lat": 1.3348,
      "lng": 103.7432
    }
  ]
}
```

#### Error Responses

**400 Bad Request** - Query too short
```json
{
  "error": "Query must be at least 2 characters"
}
```

**500 Internal Server Error** - OneMap API failure
```json
{
  "error": "Failed to geocode location"
}
```

#### Example Usage

```typescript
const response = await fetch('/api/geocode?q=Raffles%20Place');
const { results } = await response.json();
// Use results[0] as Location object
```

---

### 2. POST `/api/route`

Compares MRT/Bus, Walk, and Drive routes with carbon emissions for a given origin/destination.

#### Request

```
POST /api/route
Content-Type: application/json
```

**Body:**
```json
{
  "origin": {
    "name": "Jurong East MRT",
    "lat": 1.3353,
    "lng": 103.7426
  },
  "destination": {
    "name": "Raffles Place MRT",
    "lat": 1.2855,
    "lng": 103.8507
  }
}
```

#### Response (200 OK)

```json
{
  "origin": {
    "name": "Jurong East MRT",
    "lat": 1.3353,
    "lng": 103.7426
  },
  "destination": {
    "name": "Raffles Place MRT",
    "lat": 1.2855,
    "lng": 103.8507
  },
  "pt": {
    "mode": "PT",
    "steps": [
      {
        "mode": "MRT",
        "distance": 10.5,
        "duration": 25,
        "fare": 2.70
      },
      {
        "mode": "WALK",
        "distance": 0.2,
        "duration": 2,
        "fare": 0
      }
    ],
    "totalDistance": 10.7,
    "totalDuration": 27,
    "totalFare": 2.70,
    "carbonEmissions": 42
  },
  "walk": null,
  "drive": {
    "mode": "DRIVE",
    "steps": [
      {
        "mode": "DRIVE",
        "distance": 12.0,
        "duration": 28,
        "fare": 0
      }
    ],
    "totalDistance": 12.0,
    "totalDuration": 28,
    "totalFare": 0,
    "carbonEmissions": 1764
  },
  "bestOption": "PT",
  "carbonSavings": {
    "vsDrive": 1722
  }
}
```

**Field Descriptions:**
- `pt` / `walk` / `drive` - Route object for each mode, or null if unavailable
- `steps` - Array of route segments (WALK, BUS, MRT, DRIVE)
- `carbonEmissions` - Total CO₂ in grams (calculated from distance × factor)
- `bestOption` - Lowest-emission mode
- `carbonSavings.vsDrive` - Grams of CO₂ saved vs driving

#### Error Responses

**400 Bad Request** - Missing required fields
```json
{
  "error": "Origin and destination required"
}
```

**500 Internal Server Error** - OneMap API failure
```json
{
  "error": "Failed to compare routes"
}
```

#### Carbon Calculation

```
carbonEmissions = sum(distance_km × factor_gCO2_per_km)

Factors by mode:
- Walk: 0 gCO₂/km
- MRT: 4 gCO₂/km
- Bus: 25 gCO₂/km  
- Drive: 147 gCO₂/km
```

#### Example Usage

```typescript
const response = await fetch('/api/route', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    origin: { name: 'Jurong East', lat: 1.3353, lng: 103.7426 },
    destination: { name: 'Raffles Place', lat: 1.2855, lng: 103.8507 },
  }),
});

const comparison = await response.json();
console.log(`Save ${comparison.carbonSavings.vsDrive}g by using PT`);
```

---

### 3. POST `/api/insights`

Generates personalized AI-powered nudges using Claude API.

#### Request

```
POST /api/insights
Content-Type: application/json
```

**Body:**
```json
{
  "origin": {
    "name": "Jurong East MRT",
    "lat": 1.3353,
    "lng": 103.7426
  },
  "destination": {
    "name": "Raffles Place MRT",
    "lat": 1.2855,
    "lng": 103.8507
  },
  "carbonSavings": 1722,
  "distance": 10.5,
  "duration": 25,
  "transportMode": "Public Transport"
}
```

#### Response (200 OK)

Streams response from Claude:

```json
{
  "text": "By taking the MRT instead of driving, you're saving 1722 grams of CO₂—that's equivalent to one tree absorbing carbon for an entire day! If you make this choice every weekday, you'd offset 8.6 kg of emissions monthly.",
  "carbonSaved": 1722
}
```

#### Error Responses

**400 Bad Request** - Missing fields
```json
{
  "error": "Missing required fields"
}
```

**500 Internal Server Error** - Claude API failure or timeout
```json
{
  "error": "Failed to generate insights"
}
```

#### Response Time

- **Typical**: 1-2 seconds (Claude streaming)
- **Max timeout**: 10 seconds

#### Example Usage

```typescript
const response = await fetch('/api/insights', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    origin: { name: 'Jurong East', lat: 1.3353, lng: 103.7426 },
    destination: { name: 'Raffles Place', lat: 1.2855, lng: 103.8507 },
    carbonSavings: 1722,
    distance: 10.5,
    duration: 25,
    transportMode: 'Public Transport',
  }),
});

const insight = await response.json();
console.log(insight.text);
```

---

### 4. GET `/api/health`

Health check endpoint for deployment monitoring.

#### Request

```
GET /api/health
```

#### Response (200 OK)

```json
{
  "status": "healthy",
  "timestamp": "2026-06-24T02:45:00.000Z",
  "uptime": 1234.56,
  "environment": {
    "nodeEnv": "production",
    "hasLtaKey": true,
    "hasOneMapToken": true,
    "hasAnthropicKey": true
  }
}
```

#### Purpose

Used by:
- Docker/Kubernetes health checks
- Vercel monitoring
- Uptime monitoring services (Pingdom, etc.)

#### Example Usage

```bash
curl http://localhost:3000/api/health
```

---

## Error Handling

All endpoints follow standard HTTP status codes:

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | Success | Route comparison returned |
| 400 | Bad Request | Missing required fields |
| 500 | Server Error | API integration failure |

Error response format:
```json
{
  "error": "Human-readable error message"
}
```

---

## Rate Limiting

Currently **no rate limiting** implemented (suitable for MVP).

For production, consider:
- Vercel Edge Middleware for IP-based limiting
- OneMap API quota (high for free tier)
- Claude API usage quotas

---

## CORS & Security

- **CORS**: Enabled for front-end requests (localhost in dev, production domain in prod)
- **API Keys**: Never exposed in response bodies
- **Validation**: All inputs validated server-side
- **Timeouts**: Routes time out after 30 seconds

---

## Integration Timeline

```
Client (SearchPage.tsx)
    ↓
    ├─→ GET /api/geocode (300ms debounce)
    ├─→ POST /api/route (after search button)
    └─→ POST /api/insights (after routes load)
    ↓
Server Routes
    ├─→ OneMap API (via proxy)
    ├─→ LTA Datamall API (if needed)
    └─→ Anthropic Claude API
    ↓
Client (RouteCard, DashboardCard components)
```

---

## Testing API Endpoints

### Using cURL

```bash
# Test geocode
curl "http://localhost:3000/api/geocode?q=Jurong%20East"

# Test route comparison
curl -X POST http://localhost:3000/api/route \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"name": "Jurong East", "lat": 1.3353, "lng": 103.7426},
    "destination": {"name": "Raffles Place", "lat": 1.2855, "lng": 103.8507}
  }'

# Test health
curl http://localhost:3000/api/health
```

### Using Postman

1. Import collection from `/docs/greenroute.postman_collection.json`
2. Set `{{base_url}}` to `http://localhost:3000`
3. Run tests

### Using TypeScript

```typescript
// lib/apiClient.ts
async function getRoutes(origin, destination) {
  const res = await fetch('/api/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination }),
  });
  if (!res.ok) throw new Error('Route API failed');
  return res.json();
}
```

---

## Monitoring & Debugging

### View Logs in Vercel

```bash
vercel logs --follow
```

### Check API Response Times

Chrome DevTools → Network tab → Click request → Timing

### Monitor Claude API Usage

https://console.anthropic.com/account/usage

---

## Changelog

**v0.1.0** (June 2026)
- Initial release
- Geocode, route, insights, health endpoints
- OneMap + LTA integration
- Claude streaming responses

---

**Last Updated**: June 2026
**Maintainer**: GreenRoute Team
