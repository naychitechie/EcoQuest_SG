import {
  STORAGE_KEYS,
  DEFAULT_USER_STATS,
  UserStats,
  RecentRoute,
} from '@/lib/constants';

export function readUserStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_USER_STATS;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_STATS);
    return stored ? { ...DEFAULT_USER_STATS, ...JSON.parse(stored) } : DEFAULT_USER_STATS;
  } catch {
    return DEFAULT_USER_STATS;
  }
}

export function writeUserStats(stats: UserStats): void {
  localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
}

export function readRecentRoutes(): RecentRoute[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT_ROUTES);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function writeRecentRoutes(routes: RecentRoute[]): void {
  localStorage.setItem(STORAGE_KEYS.RECENT_ROUTES, JSON.stringify(routes));
}

export const COMMUTE_REWARD = {
  co2Kg: 1.2,
  coins: 50,
} as const;
