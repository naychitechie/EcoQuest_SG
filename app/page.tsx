'use client';

import { useState, useCallback } from 'react';
import DashboardCard from '@/components/DashboardCard';
import HomePanels from '@/components/HomePanels';
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
} from '@/lib/constants';

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
}

function buildRouteOptions(comparison: RoutesComparison): RouteOption[] {
  const ptRoute = comparison.pt;
  const walkRoute = comparison.walk;
  const driveRoute = comparison.drive;
  const carDistance = driveRoute ? driveRoute.totalDistance : 15.8;
  const carDuration = driveRoute ? driveRoute.totalDuration : 25;

  return [
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
      isRecommended: true,
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
      isRecommended: false,
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
      isRecommended: false,
    },
  ];
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
        {option.isRecommended && (
          <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
            <span
              className="material-symbols-outlined text-[12px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
            Recommended
          </span>
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
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.TRIPS);
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [activeNav, setActiveNav] = useState<'home' | 'routes' | 'rewards' | 'impact' | 'settings'>('home');

  // ── Transactional simulation state machine (localStorage) ──
  const [commuteLock, setCommuteLock] = useState<CommuteLockData>(() => readCommuteLock());

  const persistCommuteLock = useCallback((next: CommuteLockData) => {
    setCommuteLock(next);
    localStorage.setItem(STORAGE_KEYS.COMMUTE_LOCK, JSON.stringify(next));
  }, []);

  const startCommute = useCallback(
    (destination: string, mode: RouteOptionKey) => {
      const etaByMode: Record<RouteOptionKey, number> = { MRT: 18, BUS: 28, WALK: 45 };
      persistCommuteLock({
        state: 'in_transit',
        destination,
        etaMinutes: etaByMode[mode],
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
    persistCommuteLock(DEFAULT_COMMUTE_LOCK);
  }, [persistCommuteLock]);

  const isInTransit = commuteLock.state === 'in_transit';
  const isComplete = commuteLock.state === 'complete';
  const commuteLocked = isInTransit || isComplete;

  // ── Search / route state (OneMap API via /api/route) ──
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [comparison, setComparison] = useState<RoutesComparison | null>(null);
  const [isSearching, setIsSearching] = useState(false);

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
    setIsSearching(true);
    setComparison(null);
    try {
      const response = await fetch('/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination }),
      });
      if (!response.ok) throw new Error('Failed to fetch routes');
      const data: RoutesComparison = await response.json();
      setComparison(data);
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search routes. Please try again.');
    } finally {
      setIsSearching(false);
    }
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

  const navItems = [
    { key: 'home' as const, icon: 'directions_transit', label: 'Plan' },
    { key: 'routes' as const, icon: 'map', label: 'Routes' },
    { key: 'rewards' as const, icon: 'emoji_events', label: 'Rewards' },
    { key: 'impact' as const, icon: 'analytics', label: 'Impact' },
    { key: 'settings' as const, icon: 'person', label: 'Account' },
  ];

  const routeOptions = comparison ? buildRouteOptions(comparison) : [];

  return (
    <div className="ecoquest-app-shell min-h-screen bg-slate-950 flex items-start justify-center py-6 px-4">
      <div
        className="ecoquest-phone-frame max-w-[430px] min-h-[932px] mx-auto border-[8px] border-slate-800 rounded-[60px] shadow-2xl overflow-hidden bg-[#121824] text-white font-sans w-full"
        style={{ backgroundColor: '#121824', color: '#ffffff' }}
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
            <span className="text-emerald-400">340 Coins</span>
          </div>
        </header>

        <main className="ecoquest-phone-main">
          {activeNav === 'home' && (
            <>
              <EcoQuestDashboardHeader />
              <div className="mb-4">
                <DashboardCard />
              </div>
              <div className="mb-3">
                <TrainAlertBanner />
              </div>

              {/* Search panel — bounded scroll container */}
              <div className="w-full max-w-full overflow-x-hidden overflow-y-auto max-h-[calc(932px-220px)]">
                {!comparison ? (
                  <div className="ecoquest-card-dark p-3 mt-1 space-y-2">
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
                      className="ecoquest-btn-primary"
                    >
                      {isSearching ? 'Searching…' : 'Search Routes'}
                    </button>
                  </div>
                ) : (
                  <div className="w-full min-w-0 py-2">
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setComparison(null)}
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

                    {/* Route result cards — START COMMUTE on every option */}
                    <div className="flex flex-col gap-2 px-0 py-2">
                      {routeOptions.map((option) => (
                        <RouteResultCard
                          key={option.key}
                          option={option}
                          commuteLocked={commuteLocked}
                          onStartCommute={() => {
                            if (!commuteLocked) {
                              startCommute(formatDestLabel(comparison.destination.name), option.key);
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

              {!comparison && <HomePanels trips={trips} />}
            </>
          )}

          {activeNav === 'impact' && (
            <>
              <h1 className="text-base font-bold mb-4 text-white">Impact Stats</h1>
              <DashboardCard trips={trips} extended />
            </>
          )}

          {activeNav === 'rewards' && <RewardsPage />}

          {activeNav === 'routes' && (
            <>
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
                    <div key={trip.id} className="ecoquest-card-dark p-3 flex items-center gap-3">
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
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeNav === 'settings' && <SettingsPage />}
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
                    +50 Streak Coins Earned &nbsp;|&nbsp; 1.2kg CO₂ Saved
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
                  padding: isActive ? '4px 16px' : undefined,
                  width: isActive ? undefined : '64px',
                }}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="text-[10px] mt-0.5 uppercase tracking-wide font-semibold">
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
