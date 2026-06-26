import {
  STORAGE_KEYS,
  DEFAULT_USER_STATS,
  UserStats,
  RecentRoute,
  DailyQuestClaims,
  DEFAULT_QUEST_CLAIMS,
  QUEST_CLAIMS_VERSION,
  CommuteMode,
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

export function readQuestClaims(): DailyQuestClaims {
  if (typeof window === 'undefined') return DEFAULT_QUEST_CLAIMS;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.QUEST_CLAIMS);
    if (!stored) return DEFAULT_QUEST_CLAIMS;

    const parsed = JSON.parse(stored) as DailyQuestClaims;
    if (parsed.v !== QUEST_CLAIMS_VERSION) {
      writeQuestClaims(DEFAULT_QUEST_CLAIMS);
      return DEFAULT_QUEST_CLAIMS;
    }

    return {
      ...DEFAULT_QUEST_CLAIMS,
      ...parsed,
      v: QUEST_CLAIMS_VERSION,
    };
  } catch {
    return DEFAULT_QUEST_CLAIMS;
  }
}

export function writeQuestClaims(claims: DailyQuestClaims): void {
  localStorage.setItem(
    STORAGE_KEYS.QUEST_CLAIMS,
    JSON.stringify({ ...claims, v: QUEST_CLAIMS_VERSION })
  );
}

/** Calibrated XP / Streak Coin / CO₂ rewards by transit mode */
export const MODE_REWARDS: Record<
  CommuteMode,
  { xp: number; coins: number; co2Kg: number }
> = {
  MRT: { xp: 60, coins: 60, co2Kg: 1.2 },
  BUS: { xp: 50, coins: 50, co2Kg: 1.0 },
  WALK: { xp: 40, coins: 40, co2Kg: 0.8 },
};

export const QUEST_REWARDS = {
  food: { xp: 50, coins: 50 },
  energy: { xp: 40, coins: 40 },
} as const;

export function getModeReward(mode: CommuteMode) {
  return MODE_REWARDS[mode];
}

/** @deprecated use getModeReward — kept for MRT default backward compat */
export const COMMUTE_REWARD = MODE_REWARDS.MRT;
