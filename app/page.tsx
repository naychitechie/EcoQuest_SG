'use client';

import { useState, useCallback, useEffect } from 'react';
import DashboardCard from '@/components/DashboardCard';
import HomePanels from '@/components/HomePanels';
import DailyQuestsSection from '@/components/DailyQuestsSection';
import TrainAlertBanner from '@/components/TrainAlertBanner';
import RewardsPage from '@/components/RewardsPage';
import SettingsPage from '@/components/SettingsPage';
import EcoQuestDashboardHeader from '@/components/EcoQuestDashboardHeader';
import LocationInput from '@/components/LocationInput';
import { Trip, Location, RoutesComparison } from '@/lib/types';
import {
  STORAGE_KEYS,
  DEFAULT_COMMUTE_LOCK,
  CommuteLockData,
  UserStats,
  RecentRoute,
  CommuteMode,
  DEFAULT_USER_STATS,
  DEFAULT_QUEST_CLAIMS,
  DailyQuestClaims,
} from '@/lib/constants';
import {
  readUserStats,
  writeUserStats,
  readRecentRoutes,
  writeRecentRoutes,
  readQuestClaims,
  writeQuestClaims,
  getModeReward,
  QUEST_REWARDS,
} from '@/lib/userStats';
import {
  AppPreferences,
  DEFAULT_APP_PREFERENCES,
  readAppPreferences,
  writeAppPreferences,
  resolveTheme,
  applyDocumentTheme,
} from '@/lib/appPreferences';

// ─── Commute lock localStorage helpers ───────────────────────────────────────

function readCommuteLock(): CommuteLockData {
  if (typeof window === 'undefined') return DEFAULT_COMMUTE_LOCK;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COMMUTE_LOCK);
    return stored ? { ...DEFAULT_COMMUTE_LOCK, ...JSON.parse(stored) } : DEFAULT_COMMUTE_LOCK;
  } catch {
    return DEFAULT_COMMUTE_LOCK;
  }
}

function formatDestLabel(name: string): string {
  return name.replace(/\s+MRT Station$/i, ' Stn').replace(/\s+Station$/i, ' Stn');
}

function formatFare(val: number): string {
  return val === 0 ? '$0.00' : `$${val.toFixed(2)}`;
}

// ─── Route option builder (uses live OneMap /api/route data) ─────────────────

type RouteOptionKey = 'MRT' | 'BUS' | 'WALK';

interface RouteOption {
  key: RouteOptionKey;
  label: string;
  icon: string;
  badge: string;
  badgeText: string;
  timeStr: string;
  distance: number;
  fare: number;
  emissionsPerKm: number;
  isRecommended: boolean;
  xpReward: number;
  co2RewardKg: number;
}

function buildRouteOptions(comparison: RoutesComparison, preferredMode?: RouteOptionKey): RouteOption[] {
  const ptRoute = comparison.pt;
  const walkRoute = comparison.walk;
  const driveRoute = comparison.drive;
  const carDistance = driveRoute ? driveRoute.totalDistance : 15.8;
  const carDuration = driveRoute ? driveRoute.totalDuration : 25;

  const options: RouteOption[] = [
    {
      key: 'MRT',
      label: 'MRT',
      icon: 'directions_transit',
      badge: 'EWL',
      badgeText: 'Greenest · LTA verified',
      timeStr: `${Math.round(ptRoute ? ptRoute.totalDuration : carDuration * 1.3)} min`,
      distance: Number((ptRoute ? ptRoute.totalDistance : carDistance * 1.05).toFixed(1)),
      fare: ptRoute && ptRoute.totalFare > 0 ? ptRoute.totalFare : 1.84,
      emissionsPerKm: 4,
      isRecommended: preferredMode ? preferredMode === 'MRT' : true,
      xpReward: 60,
      co2RewardKg: 1.2,
    },
    {
      key: 'BUS',
      label: 'Bus',
      icon: 'directions_bus',
      badge: '197',
      badgeText: 'Direct route',
      timeStr: `${Math.round(ptRoute ? ptRoute.totalDuration * 1.4 : carDuration * 2.0)} min`,
      distance: Number((ptRoute ? ptRoute.totalDistance * 1.02 : carDistance * 1.1).toFixed(1)),
      fare: ptRoute && ptRoute.totalFare > 0 ? ptRoute.totalFare + 0.26 : 2.1,
      emissionsPerKm: 25,
      isRecommended: preferredMode === 'BUS',
      xpReward: 50,
      co2RewardKg: 1.0,
    },
    {
      key: 'WALK',
      label: 'Walking',
      icon: 'directions_walk',
      badge: '',
      badgeText: 'Via PCN',
      timeStr: walkRoute
        ? walkRoute.totalDuration > 60
          ? `${Math.floor(walkRoute.totalDuration / 60)}h ${Math.round(walkRoute.totalDuration % 60)}m`
          : `${Math.round(walkRoute.totalDuration)} min`
        : '3h 15m',
      distance: Number((walkRoute ? walkRoute.totalDistance : carDistance).toFixed(1)),
      fare: 0,
      emissionsPerKm: 0,
      isRecommended: preferredMode === 'WALK',
      xpReward: 40,
      co2RewardKg: 0.8,
    },
  ];

  if (!preferredMode) {
    options[0].isRecommended = true;
    options[1].isRecommended = false;
    options[2].isRecommended = false;
  }

  return options;
}

// ─── Route result card (defined in page.tsx per spec) ────────────────────────

interface RouteResultCardProps {
  option: RouteOption;
  commuteLocked: boolean;
  onStartCommute?: () => void;
}

function RouteResultCard({ option, commuteLocked, onStartCommute }: RouteResultCardProps) {
  return (
    <div
      className={`p-3 bg-slate-900/60 border rounded-xl flex flex-col gap-2 ${
        option.isRecommended
          ? 'border-emerald-500/50 ring-1 ring-emerald-500/30'
          : 'border-slate-800/80'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[18px] text-emerald-400 shrink-0">
            {option.icon}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate">
              {option.label}
              {option.badge && (
                <span className="ml-1.5 text-[10px] font-bold text-white/80 bg-slate-700 px-1.5 py-0.5 rounded">
                  {option.badge}
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-400 truncate">{option.badgeText}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-emerald-400 font-bold">{option.timeStr}</div>
          <div className="text-[11px] text-slate-400">{formatFare(option.fare)}</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>
          {option.distance} km · {option.emissionsPerKm} g/km CO₂
        </span>
        <span className="text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25">
          +{option.xpReward} XP
        </span>
      </div>

      <div className="flex items-center justify-between text-[11px]">
        {option.isRecommended ? (
          <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
            <span
              className="material-symbols-outlined text-[12px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
            Recommended
          </span>
        ) : (
          <span className="text-slate-500">+{option.co2RewardKg} kg CO₂</span>
        )}
      </div>

      {onStartCommute && (
        <button
          type="button"
          onClick={onStartCommute}
          disabled={commuteLocked}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold py-2 rounded-xl transition-all shadow-md mt-1 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          START COMMUTE
        </button>
      )}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRIPS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [activeNav, setActiveNav] = useState<
    'home' | 'plan' | 'routes' | 'rewards' | 'impact' | 'settings'
  >('home');

  const [userStats, setUserStats] = useState<UserStats>(() =>
    typeof window === 'undefined' ? DEFAULT_USER_STATS : readUserStats()
  );
  const [recentRoutes, setRecentRoutes] = useState<RecentRoute[]>(() =>
    typeof window === 'undefined' ? [] : readRecentRoutes()
  );
  const [questClaims, setQuestClaims] = useState<DailyQuestClaims>(() =>
    typeof window === 'undefined' ? DEFAULT_QUEST_CLAIMS : readQuestClaims()
  );
  const [appPreferences, setAppPreferences] = useState<AppPreferences>(() =>
    typeof window === 'undefined' ? DEFAULT_APP_PREFERENCES : readAppPreferences()
  );

  useEffect(() => {
    applyDocumentTheme(resolveTheme(appPreferences.theme));
  }, [appPreferences.theme]);

  useEffect(() => {
    if (appPreferences.theme !== 'auto') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyDocumentTheme(resolveTheme('auto'));
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [appPreferences.theme]);

  const handlePreferencesChange = useCallback((next: AppPreferences) => {
    setAppPreferences(next);
    writeAppPreferences(next);
    applyDocumentTheme(resolveTheme(next.theme));
  }, []);

  const resolvedTheme = resolveTheme(appPreferences.theme);
  const ecoDensity = appPreferences.ecoPrecision ? 'compact' : 'comfortable';

  // ── Transactional simulation state machine (localStorage) ──
  const [commuteLock, setCommuteLock] = useState<CommuteLockData>(() =>
    typeof window === 'undefined' ? DEFAULT_COMMUTE_LOCK : readCommuteLock()
  );

  const persistCommuteLock = useCallback((next: CommuteLockData) => {
    setCommuteLock(next);
    localStorage.setItem(STORAGE_KEYS.COMMUTE_LOCK, JSON.stringify(next));
  }, []);

  const startCommute = useCallback(
    (originLoc: Location, destinationLoc: Location, destination: string, mode: RouteOptionKey) => {
      const etaByMode: Record<RouteOptionKey, number> = { MRT: 18, BUS: 28, WALK: 45 };
      persistCommuteLock({
        state: 'in_transit',
        destination,
        etaMinutes: etaByMode[mode],
        origin: originLoc,
        destinationLocation: destinationLoc,
        mode,
      });
    },
    [persistCommuteLock]
  );

  const fastForwardCommute = useCallback(() => {
    setCommuteLock((prev) => {
      const next = { ...prev, state: 'complete' as const };
      localStorage.setItem(STORAGE_KEYS.COMMUTE_LOCK, JSON.stringify(next));
      return next;
    });
  }, []);

  const claimRewards = useCallback(() => {
    setCommuteLock((prev) => {
      if (prev.state !== 'complete') return prev;

      const reward = prev.mode ? getModeReward(prev.mode) : getModeReward('MRT');

      setUserStats((stats) => {
        const nextStats: UserStats = {
          ...stats,
          co2SavedKg: Number((stats.co2SavedKg + reward.co2Kg).toFixed(1)),
          co2SavedTodayKg: Number((stats.co2SavedTodayKg + reward.co2Kg).toFixed(1)),
          greenCommutes: stats.greenCommutes + 1,
          streakCoins: stats.streakCoins + reward.coins,
        };
        writeUserStats(nextStats);
        return nextStats;
      });

      if (prev.origin && prev.destinationLocation && prev.mode) {
        const entry: RecentRoute = {
          id: Math.random().toString(36).slice(2, 11),
          origin: prev.origin,
          destination: prev.destinationLocation,
          mode: prev.mode,
          timestamp: Date.now(),
        };
        setRecentRoutes((routes) => {
          const next = [entry, ...routes].slice(0, 20);
          writeRecentRoutes(next);
          return next;
        });
      }

      localStorage.setItem(STORAGE_KEYS.COMMUTE_LOCK, JSON.stringify(DEFAULT_COMMUTE_LOCK));
      return DEFAULT_COMMUTE_LOCK;
    });
  }, []);

  const isInTransit = commuteLock.state === 'in_transit';
  const isComplete = commuteLock.state === 'complete';
  const commuteLocked = isInTransit || isComplete;

  // ── Search / route state (OneMap API via /api/route) ──
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [comparison, setComparison] = useState<RoutesComparison | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [preferredRouteMode, setPreferredRouteMode] = useState<RouteOptionKey | undefined>();

  const fetchRouteComparison = useCallback(
    async (originLoc: Location, destinationLoc: Location, mode?: CommuteMode | RouteOptionKey) => {
      setOrigin(originLoc);
      setDestination(destinationLoc);
      setPreferredRouteMode(mode);
      setIsSearching(true);
      setComparison(null);
      try {
        const response = await fetch('/api/route', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ origin: originLoc, destination: destinationLoc }),
        });
        if (!response.ok) throw new Error('Failed to fetch routes');
        const data: RoutesComparison = await response.json();
        setComparison(data);
      } catch (error) {
        console.error('Search error:', error);
        alert('Failed to load route details. Please try again.');
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  const handleRecentRouteSelect = useCallback(
    (route: RecentRoute) => {
      setActiveNav('plan');
      void fetchRouteComparison(route.origin, route.destination, route.mode);
    },
    [fetchRouteComparison]
  );

  const handleSavedRouteSelect = useCallback(
    (trip: Trip) => {
      const mode: RouteOptionKey =
        trip.mode === 'WALK' ? 'WALK' : trip.mode === 'PT' ? 'MRT' : 'MRT';
      setActiveNav('plan');
      void fetchRouteComparison(trip.origin, trip.destination, mode);
    },
    [fetchRouteComparison]
  );

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = async () => {
    if (!origin || !destination) {
      alert('Please select both origin and destination');
      return;
    }
    setPreferredRouteMode(undefined);
    await fetchRouteComparison(origin, destination);
  };

  const handleTripSelect = (
    mode: 'PT' | 'WALK' | 'DRIVE',
    originLoc: Location,
    destinationLoc: Location,
    duration: number,
    carbonSavings: number
  ) => {
    const newTrip: Trip = {
      id: Math.random().toString(36).substr(2, 9),
      origin: originLoc,
      destination: destinationLoc,
      mode,
      carbonSaved: carbonSavings,
      timestamp: Date.now(),
      duration,
    };
    const updatedTrips = [...trips, newTrip];
    setTrips(updatedTrips);
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(updatedTrips));
  };

  const handleClaimFoodQuest = useCallback(() => {
    if (questClaims.food) return;
    const reward = QUEST_REWARDS.food;
    setUserStats((stats) => {
      const next = { ...stats, streakCoins: stats.streakCoins + reward.coins };
      writeUserStats(next);
      return next;
    });
    setQuestClaims((prev) => {
      const next = { ...prev, food: true };
      writeQuestClaims(next);
      return next;
    });
  }, [questClaims.food]);

  const handleVerifyEnergyQuest = useCallback(async () => {
    if (questClaims.energy) return;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const reward = QUEST_REWARDS.energy;
    setUserStats((stats) => {
      const next = { ...stats, streakCoins: stats.streakCoins + reward.coins };
      writeUserStats(next);
      return next;
    });
    setQuestClaims((prev) => {
      const next = { ...prev, energy: true };
      writeQuestClaims(next);
      return next;
    });
  }, [questClaims.energy]);

  const navItems = [
    { key: 'home' as const, icon: 'home', label: 'Home' },
    { key: 'plan' as const, icon: 'directions_transit', label: 'Plan' },
    { key: 'routes' as const, icon: 'map', label: 'Routes' },
    { key: 'rewards' as const, icon: 'emoji_events', label: 'Rewards' },
    { key: 'impact' as const, icon: 'analytics', label: 'Impact' },
    { key: 'settings' as const, icon: 'settings', label: 'Settings' },
  ];

  const routeOptions = comparison ? buildRouteOptions(comparison, preferredRouteMode) : [];
  const pendingReward =
    isComplete && commuteLock.mode ? getModeReward(commuteLock.mode) : getModeReward('MRT');
  const pendingCoins = isComplete ? pendingReward.coins : 0;

  return (
    <div
      className="ecoquest-app-shell bg-slate-950 flex items-center justify-center"
      data-theme={resolvedTheme}
    >
      <div
        className="ecoquest-phone-frame max-w-[430px] mx-auto border-[8px] rounded-[60px] shadow-2xl overflow-hidden font-sans w-full h-full"
        suppressHydrationWarning
        data-theme={resolvedTheme}
        data-eco-density={ecoDensity}
      >
        <header className="ecoquest-phone-header">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[22px] text-emerald-400"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
            <span className="text-[17px] font-bold tracking-tight text-white">EcoQuest SG</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[12px] font-bold">
            <span
              className="material-symbols-outlined text-[15px] text-emerald-400"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              monetization_on
            </span>
            <span className="text-emerald-400">{userStats.streakCoins} Coins</span>
          </div>
        </header>

        <div className="ecoquest-phone-body">
          <main className="ecoquest-phone-main">
          {activeNav === 'home' && (
            <div className="ecoquest-tab-panel">
              <EcoQuestDashboardHeader />
              <div className="mb-4">
                <DashboardCard userStats={userStats} pendingCoins={pendingCoins} />
              </div>
              <DailyQuestsSection
                questClaims={questClaims}
                onClaimFood={handleClaimFoodQuest}
                onVerifyEnergy={handleVerifyEnergyQuest}
              />
            </div>
          )}

          {activeNav === 'plan' && (
            <div className="ecoquest-tab-panel flex flex-col">
              <div className="mb-3 shrink-0">
                <TrainAlertBanner />
              </div>

              <div className="flex-1 min-h-0 overflow-x-hidden overflow-y-auto">
                {isSearching && !comparison ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <span className="material-symbols-outlined text-[32px] text-emerald-400 animate-spin mb-3">
                      progress_activity
                    </span>
                    <p className="text-sm text-slate-400">Loading route details…</p>
                  </div>
                ) : !comparison ? (
                  <>
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 mx-4 mt-3 space-y-2">
                      <div>
                        <h2 className="text-sm font-bold text-white">Where are you going?</h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Find the greenest route across Singapore.
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="flex-1 space-y-2">
                          <LocationInput
                            placeholder="Origin (e.g., One-North MRT)"
                            value={origin}
                            onChange={setOrigin}
                            icon="origin"
                            variant="dark"
                          />
                          <LocationInput
                            placeholder="Destination (e.g., Raffles Place MRT)"
                            value={destination}
                            onChange={setDestination}
                            icon="destination"
                            variant="dark"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleSwap}
                          className="w-8 h-8 mt-1 rounded-full flex items-center justify-center shrink-0 bg-slate-950 border border-slate-800 text-slate-400 hover:text-emerald-400"
                          aria-label="Swap origin and destination"
                        >
                          <span className="material-symbols-outlined text-[16px]">swap_vert</span>
                        </button>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                          Prefer
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { icon: 'directions_transit', label: 'MRT' },
                            { icon: 'directions_bus', label: 'Bus' },
                            { icon: 'directions_walk', label: 'Active' },
                          ].map((mode) => (
                            <button
                              key={mode.label}
                              type="button"
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-950 border border-slate-800 text-slate-400"
                            >
                              <span className="material-symbols-outlined text-[14px]">{mode.icon}</span>
                              {mode.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 text-xs font-bold py-2 rounded-xl transition-all shadow-md"
                      >
                        {isSearching ? 'Searching…' : 'Search Routes'}
                      </button>
                    </div>
                    <div className="mx-4">
                      <HomePanels
                        recentRoutes={recentRoutes}
                        userStats={userStats}
                        onRouteSelect={handleRecentRouteSelect}
                      />
                    </div>
                  </>
                ) : (
                  <div className="w-full min-w-0 max-w-full overflow-x-hidden px-4 py-2">
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => {
                          setComparison(null);
                          setPreferredRouteMode(undefined);
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-800 bg-slate-900/80 text-white"
                      >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                      </button>
                      <h2 className="text-sm font-bold text-white">Route Results</h2>
                    </div>

                    <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl mb-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px] text-emerald-400">
                          trip_origin
                        </span>
                        <span className="text-xs text-white truncate">{comparison.origin.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px] text-red-400">
                          location_on
                        </span>
                        <span className="text-xs text-white truncate">
                          {comparison.destination.name}
                        </span>
                      </div>
                    </div>

                    {/* Route result cards — compact vertical stack */}
                    <div className="flex flex-col ecoquest-density-stack px-0 py-2">
                      {routeOptions.map((option) => (
                        <RouteResultCard
                          key={option.key}
                          option={option}
                          commuteLocked={commuteLocked}
                          onStartCommute={() => {
                            if (!commuteLocked) {
                              startCommute(
                                comparison.origin,
                                comparison.destination,
                                formatDestLabel(comparison.destination.name),
                                option.key
                              );
                            }
                          }}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (comparison.pt) {
                          handleTripSelect(
                            'PT',
                            comparison.origin,
                            comparison.destination,
                            comparison.pt.totalDuration,
                            comparison.carbonSavings.vsDrive
                          );
                          alert('Route saved!');
                          setComparison(null);
                        }
                      }}
                      className="w-full mt-3 py-2 rounded-xl text-xs font-bold uppercase bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    >
                      Save MRT Route
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeNav === 'impact' && (
            <div className="ecoquest-tab-panel">
              <h1 className="text-base font-bold mb-4 text-white">Impact Stats</h1>
              <DashboardCard
                userStats={userStats}
                pendingCoins={pendingCoins}
                trips={trips}
                recentRoutes={recentRoutes}
                extended
              />
            </div>
          )}

          {activeNav === 'rewards' && (
            <div className="ecoquest-tab-panel">
              <RewardsPage streakCoins={userStats.streakCoins} />
            </div>
          )}

          {activeNav === 'routes' && (
            <div className="ecoquest-tab-panel">
              <h1 className="text-base font-bold mb-4 text-white">Saved Routes</h1>
              {trips.length === 0 ? (
                <div className="ecoquest-card-dark text-center py-12 px-4">
                  <span className="material-symbols-outlined text-[48px] mb-4 text-slate-500">
                    bookmarks
                  </span>
                  <p className="text-sm text-slate-400">
                    No saved routes yet. Plan a commute to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {trips.map((trip) => (
                    <button
                      key={trip.id}
                      type="button"
                      onClick={() => handleSavedRouteSelect(trip)}
                      className="ecoquest-card-dark p-3 flex items-center gap-3 w-full text-left hover:bg-slate-800/60 transition-colors"
                    >
                      <span className="material-symbols-outlined text-emerald-400">
                        {trip.mode === 'PT'
                          ? 'directions_transit'
                          : trip.mode === 'WALK'
                            ? 'directions_walk'
                            : 'directions_car'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white truncate">
                          {trip.origin.name} → {trip.destination.name}
                        </div>
                        <div className="text-[11px] mt-0.5 text-slate-400">
                          {new Date(trip.timestamp).toLocaleDateString()} · Saved{' '}
                          {Math.round(trip.carbonSaved)}g CO₂
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[16px] text-slate-500 shrink-0">
                        chevron_right
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeNav === 'settings' && (
            <div className="ecoquest-tab-panel">
              <SettingsPage
                preferences={appPreferences}
                onPreferencesChange={handlePreferencesChange}
              />
            </div>
          )}
          </main>

          {/* ── Transactional simulation overlays (localStorage-driven) ── */}
          {(isInTransit || isComplete) && (
            <div className="ecoquest-overlay-layer">
            {isInTransit && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121824]/95 backdrop-blur-sm px-6">
                <div className="w-full max-w-[340px] rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-[#1a2332] to-[#0d1117] p-6 text-center shadow-2xl">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px] text-emerald-400 animate-pulse">
                      directions_transit
                    </span>
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.15em] font-bold text-emerald-400/70 mb-2">
                    Transit Lock Active
                  </div>
                  <h2 className="text-[15px] font-bold text-white leading-snug mb-3">
                    COMMUTE IN PROGRESS: Arriving at {commuteLock.destination} in{' '}
                    {commuteLock.etaMinutes} minutes.
                  </h2>
                  <p className="text-[12px] text-white/60 mb-4">Verifying Schedule…</p>
                  <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 mb-6">
                    <span className="material-symbols-outlined text-[14px] text-red-400">lock</span>
                    <span className="text-[10px] text-red-300/80 font-medium">
                      Early rewards disabled during transit
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={fastForwardCommute}
                    className="text-[9px] text-white/25 hover:text-white/50 transition-colors font-mono tracking-wide"
                  >
                    [DEBUG: FAST FORWARD]
                  </button>
                </div>
              </div>
            )}

            {isComplete && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
                <div className="w-full max-w-[340px] rounded-2xl border border-emerald-400/40 bg-gradient-to-b from-[#1a3328] to-[#0d1117] p-6 text-center shadow-2xl">
                  <div className="text-[40px] mb-3">🎉</div>
                  <h2 className="text-[17px] font-bold text-white mb-2">COMMUTE COMPLETE!</h2>
                  <p className="text-[13px] text-emerald-300 font-semibold mb-1">Reward Verified!</p>
                  <p className="text-[12px] text-white/70 mb-6 leading-relaxed">
                    +{pendingReward.coins} Streak Coins Earned &nbsp;|&nbsp; {pendingReward.co2Kg}kg
                    CO₂ Saved
                  </p>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-6">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 w-full" />
                  </div>
                  <button
                    type="button"
                    onClick={claimRewards}
                    className="w-full py-3.5 rounded-xl text-[13px] font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:opacity-95 transition-opacity"
                  >
                    CLAIM REWARDS &amp; POST
                  </button>
                </div>
              </div>
            )}
            </div>
          )}
        </div>

        <nav className="ecoquest-phone-nav">
          {navItems.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveNav(item.key)}
                className="flex flex-col items-center justify-center transition-transform active:scale-95"
                style={{
                  color: isActive ? '#b2ed83' : 'rgba(255,255,255,0.45)',
                  background: isActive ? 'rgba(39,83,0,0.35)' : 'transparent',
                  borderRadius: isActive ? '999px' : undefined,
                  padding: isActive ? '4px 8px' : undefined,
                  width: isActive ? undefined : '100%',
                  maxWidth: isActive ? '4.75rem' : undefined,
                }}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="text-[9px] mt-0.5 uppercase tracking-wide font-semibold truncate max-w-full">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
