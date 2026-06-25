// Carbon emission factors (grams of CO2 per km)
export const CARBON_FACTORS: Record<string, number> = {
  MRT: 4, // g CO2/km
  SUBWAY: 4, // OneMap returns "SUBWAY" for MRT
  RAIL: 4, // alias
  BUS: 25, // g CO2/km (average of 20-30)
  WALK: 0, // g CO2/km
  CYCLE: 0, // g CO2/km
  CAR: 147, // g CO2/km (Singapore average 2023)
  DRIVE: 147, // alias for CAR
  GRAB: 150, // g CO2/km (estimate)
};

// Conversion factors
export const CARBON_CONVERSIONS = {
  gToKg: 1000,
  treeAbsorptionPerYear: 20000, // grams per year
  treeAbsorptionPerDay: 54.8, // grams per day (20000/365)
};

// Routes storage key for localStorage
export const STORAGE_KEYS = {
  TRIPS: 'greenroute_trips',
  CARBON_SAVED: 'greenroute_carbon_saved',
  RECENT_LOCATIONS: 'greenroute_recent_locations',
  COMMUTE_LOCK: 'ecoquest_commute_lock',
  USER_STATS: 'ecoquest_user_stats',
  RECENT_ROUTES: 'ecoquest_recent_routes',
};

export type CommuteLockState = 'idle' | 'in_transit' | 'complete';

export type CommuteMode = 'MRT' | 'BUS' | 'WALK';

export interface CommuteLockData {
  state: CommuteLockState;
  destination: string;
  etaMinutes: number;
  origin?: { name: string; lat: number; lng: number };
  destinationLocation?: { name: string; lat: number; lng: number };
  mode?: CommuteMode;
}

export const DEFAULT_COMMUTE_LOCK: CommuteLockData = {
  state: 'idle',
  destination: 'Raffles Place Stn',
  etaMinutes: 18,
};

export interface UserStats {
  co2SavedKg: number;
  co2SavedTodayKg: number;
  greenCommutes: number;
  greenCommutesTarget: number;
  streakCoins: number;
}

export const DEFAULT_USER_STATS: UserStats = {
  co2SavedKg: 4.8,
  co2SavedTodayKg: 1.2,
  greenCommutes: 12,
  greenCommutesTarget: 15,
  streakCoins: 340,
};

export interface RecentRoute {
  id: string;
  origin: { name: string; lat: number; lng: number };
  destination: { name: string; lat: number; lng: number };
  mode: CommuteMode;
  timestamp: number;
}
