import { NextRequest, NextResponse } from 'next/server';
import { CARBON_FACTORS } from '@/lib/constants';
import { Route, RouteStep, RoutesComparison, Location } from '@/lib/types';
import { getOneMapToken } from '@/lib/onemap';

const ONEMAP_ROUTE_API = 'https://www.onemap.gov.sg/api/public/routingsvc/route';

// ─── OneMap PT Response Types ──────────────────────────────────────────────────
interface OneMapPTResponse {
  plan?: {
    itineraries: Array<{
      duration: number; // seconds
      startTime: number;
      endTime: number;
      walkTime: number; // seconds
      transitTime: number; // seconds
      waitingTime: number; // seconds
      walkDistance: number; // metres
      transfers: number;
      fare?: string; // SGD as string
      legs: Array<{
        startTime: number;
        endTime: number;
        mode: string; // "WALK", "BUS", "SUBWAY", "RAIL"
        route?: string; // bus number or MRT line code
        agencyName?: string;
        distance: number; // metres
        from: { name: string; lat: number; lon: number };
        to: { name: string; lat: number; lon: number };
        legGeometry?: { points: string; length: number };
        numIntermediateStops?: number;
      }>;
    }>;
  };
}

// ─── OneMap Walk/Drive Response Types ──────────────────────────────────────────
interface OneMapSimpleResponse {
  status: number; // 0 = success
  status_message: string;
  route_geometry?: string; // encoded polyline
  route_summary?: {
    start_point: string;
    end_point: string;
    total_time: number; // seconds
    total_distance: number; // metres
  };
  route_instructions?: Array<unknown[]>;
}

// ─── Parse PT Route (MRT/Bus) ──────────────────────────────────────────────────
function parsePTRoute(data: OneMapPTResponse): Route | null {
  if (!data.plan?.itineraries?.length) return null;

  const itinerary = data.plan.itineraries[0];
  const legGeometries: string[] = [];

  const steps: RouteStep[] = itinerary.legs.map((leg) => {
    if (leg.legGeometry?.points) {
      legGeometries.push(leg.legGeometry.points);
    }

    return {
      mode: leg.mode as RouteStep['mode'],
      distance: leg.distance / 1000, // metres → km
      duration: (leg.endTime - leg.startTime) / 60000, // ms → minutes
      route: leg.route,
      agencyName: leg.agencyName,
      numIntermediateStops: leg.numIntermediateStops,
      from: leg.from ? { name: leg.from.name, lat: leg.from.lat, lng: leg.from.lon } : undefined,
      to: leg.to ? { name: leg.to.name, lat: leg.to.lat, lng: leg.to.lon } : undefined,
    };
  });

  const totalDistance = itinerary.walkDistance / 1000 +
    itinerary.legs
      .filter((l) => l.mode !== 'WALK')
      .reduce((sum, l) => sum + l.distance / 1000, 0);

  const totalDuration = itinerary.duration / 60; // seconds → minutes

  // Calculate carbon emissions per step
  let carbonEmissions = 0;
  steps.forEach((step) => {
    const factor = CARBON_FACTORS[step.mode] || 0;
    carbonEmissions += factor * step.distance;
  });

  return {
    mode: 'PT',
    steps,
    totalDistance,
    totalDuration,
    totalFare: itinerary.fare ? parseFloat(itinerary.fare) : 0,
    carbonEmissions,
    legGeometries,
  };
}

// ─── Parse Walk / Drive Route ──────────────────────────────────────────────────
function parseSimpleRoute(
  data: OneMapSimpleResponse,
  routeType: 'walk' | 'drive'
): Route | null {
  if (data.status !== 0 || !data.route_summary) return null;

  const totalDistance = data.route_summary.total_distance / 1000; // metres → km
  const totalDuration = data.route_summary.total_time / 60; // seconds → minutes
  const mode: Route['mode'] = routeType === 'walk' ? 'WALK' : 'DRIVE';
  const stepMode = routeType === 'walk' ? 'WALK' : 'DRIVE';

  const factor = CARBON_FACTORS[stepMode] || 0;
  const carbonEmissions = factor * totalDistance;

  return {
    mode,
    steps: [
      {
        mode: stepMode as RouteStep['mode'],
        distance: totalDistance,
        duration: totalDuration,
      },
    ],
    totalDistance,
    totalDuration,
    totalFare: 0,
    carbonEmissions,
    routeGeometry: data.route_geometry,
  };
}

// ─── Fetch Route from OneMap ───────────────────────────────────────────────────
async function fetchRoute(
  start: string,
  end: string,
  routeType: 'pt' | 'walk' | 'drive'
): Promise<Route | null> {
  const token = await getOneMapToken();

  try {
    let url = `${ONEMAP_ROUTE_API}?start=${start}&end=${end}&routeType=${routeType}`;

    // PT routing requires additional params
    if (routeType === 'pt') {
      const now = new Date();
      const date = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${now.getFullYear()}`;
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;
      url += `&date=${date}&time=${time}&mode=TRANSIT&numItineraries=1`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      console.error(`OneMap route error for ${routeType}: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    if (routeType === 'pt') {
      return parsePTRoute(data as OneMapPTResponse);
    } else {
      return parseSimpleRoute(data as OneMapSimpleResponse, routeType);
    }
  } catch (error) {
    console.error(`Route fetch error for ${routeType}:`, error);
    return null;
  }
}

// ─── POST Handler ──────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      origin,
      destination,
    }: { origin: Location; destination: Location } = body;

    if (!origin || !destination) {
      return NextResponse.json(
        { error: 'Origin and destination required' },
        { status: 400 }
      );
    }

    const startCoords = `${origin.lat},${origin.lng}`;
    const endCoords = `${destination.lat},${destination.lng}`;

    // Fetch all route types in parallel
    const [ptRoute, walkRoute, driveRoute] = await Promise.all([
      fetchRoute(startCoords, endCoords, 'pt'),
      fetchRoute(startCoords, endCoords, 'walk'),
      fetchRoute(startCoords, endCoords, 'drive'),
    ]);

    // Determine best option (lowest emissions, excluding null routes)
    const candidates: Array<{ key: 'PT' | 'WALK' | 'DRIVE'; emissions: number }> = [];
    if (ptRoute) candidates.push({ key: 'PT', emissions: ptRoute.carbonEmissions });
    if (walkRoute) candidates.push({ key: 'WALK', emissions: walkRoute.carbonEmissions });
    if (driveRoute) candidates.push({ key: 'DRIVE', emissions: driveRoute.carbonEmissions });

    candidates.sort((a, b) => a.emissions - b.emissions);
    const bestOption = candidates.length > 0 ? candidates[0].key : 'PT';

    // Calculate savings vs driving
    const drivingEmissions = driveRoute ? driveRoute.carbonEmissions : 0;

    const comparison: RoutesComparison = {
      origin,
      destination,
      pt: ptRoute,
      walk: walkRoute,
      drive: driveRoute,
      bestOption,
      carbonSavings: {
        vsDrive: Math.max(0, drivingEmissions - (ptRoute?.carbonEmissions || 0)),
        walkVsDrive: Math.max(0, drivingEmissions - (walkRoute?.carbonEmissions || 0)),
      },
    };

    return NextResponse.json(comparison);
  } catch (error) {
    console.error('Route comparison error:', error);
    return NextResponse.json(
      { error: 'Failed to compare routes' },
      { status: 500 }
    );
  }
}
