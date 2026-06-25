// Route types and interfaces

export interface Location {
  name: string;
  lat: number;
  lng: number;
}

export interface RouteStep {
  mode: 'WALK' | 'BUS' | 'MRT' | 'SUBWAY' | 'DRIVE' | 'RAIL';
  distance: number; // in km
  duration: number; // in minutes
  fare?: number; // in SGD
  route?: string; // bus number or MRT line code (e.g., "197", "EW")
  agencyName?: string; // e.g., "SBS Transit", "SMRT"
  numIntermediateStops?: number;
  from?: { name: string; lat: number; lng: number };
  to?: { name: string; lat: number; lng: number };
}

export interface Route {
  mode: 'PT' | 'WALK' | 'DRIVE';
  steps: RouteStep[];
  totalDistance: number; // in km
  totalDuration: number; // in minutes
  totalFare: number; // in SGD
  carbonEmissions: number; // in grams CO₂
  routeGeometry?: string; // encoded polyline for map rendering
  legGeometries?: string[]; // individual leg polylines for PT routes
}

export interface RoutesComparison {
  origin: Location;
  destination: Location;
  pt: Route | null;
  walk: Route | null;
  drive: Route | null;
  bestOption: 'PT' | 'WALK' | 'DRIVE';
  carbonSavings: {
    vsDrive: number; // grams saved by PT vs driving
    walkVsDrive: number; // grams saved by walking vs driving
  };
}

export interface Trip {
  id: string;
  origin: Location;
  destination: Location;
  mode: 'PT' | 'WALK' | 'DRIVE';
  carbonSaved: number; // in grams (savings vs driving)
  timestamp: number;
  duration: number; // in minutes
}

export interface TrainAlert {
  status: number; // 1 = Normal, 2 = Disrupted
  disruptions: TrainDisruption[];
}

export interface TrainDisruption {
  line: string;
  direction: string;
  stations: string;
  freePublicBus: boolean;
  freeMRTShuttle: boolean;
  message: string;
  createdDate: string;
}

export interface BusArrivalInfo {
  serviceNo: string;
  operator: string;
  nextBus: BusTimingInfo;
  nextBus2: BusTimingInfo;
}

export interface BusTimingInfo {
  estimatedArrival: string;
  minutesAway: number | null;
  load: 'SEA' | 'SDA' | 'LSD' | '';
  type: string;
  feature: string;
}
