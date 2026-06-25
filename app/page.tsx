'use client';

import SearchPage from '@/components/SearchPage';
import DashboardCard from '@/components/DashboardCard';
import HomePanels from '@/components/HomePanels';
import TrainAlertBanner from '@/components/TrainAlertBanner';
import RewardsPage from '@/components/RewardsPage';
import SettingsPage from '@/components/SettingsPage';
import { useState } from 'react';
import { Trip, Location } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>(() => {
    // Initialize from localStorage on first render
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

  const handleTripSelect = (
    mode: 'PT' | 'WALK' | 'DRIVE',
    origin: Location,
    destination: Location,
    duration: number,
    carbonSavings: number
  ) => {
    const newTrip: Trip = {
      id: Math.random().toString(36).substr(2, 9),
      origin,
      destination,
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
    { key: 'home' as const, icon: 'home', label: 'Home' },
    { key: 'routes' as const, icon: 'bookmarks', label: 'Saved Routes' },
    { key: 'impact' as const, icon: 'leaderboard', label: 'Impact Stats' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: 'var(--eco-surface)' }}>
      {/* ─── Desktop Sidebar ──────────────────────────────────────────── */}
      <nav
        className="hidden md:flex fixed left-0 top-0 h-full w-60 flex-col py-6 px-4 z-40"
        style={{
          background: 'var(--eco-surface-container-low)',
          borderRight: '0.5px solid var(--eco-outline-variant)',
        }}
      >
        {/* Brand/Logo */}
        <div className="flex items-center gap-2 px-3 mb-6">
          <span className="material-symbols-outlined text-[26px]" style={{ color: 'var(--eco-primary)', fontVariationSettings: "'FILL' 1" }}>
            eco
          </span>
          <span className="text-[18px] font-bold font-heading" style={{ color: 'var(--eco-primary)', letterSpacing: '-0.02em' }}>
            GreenRoute
          </span>
        </div>

        {/* User Profile */}
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-2xl mb-5 cursor-pointer transition-all hover:bg-[var(--eco-surface-container)]"
          style={{ background: 'var(--eco-surface-container-lowest)', border: '0.5px solid var(--eco-outline-variant)' }}
          onClick={() => setActiveNav('settings')}
        >
          {/* Avatar with photo-style background */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0 overflow-hidden"
            style={{
              background: 'var(--eco-surface-container-high)',
              border: '1px solid var(--eco-outline-variant)',
            }}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ color: 'var(--eco-on-surface-variant)', fontVariationSettings: "'FILL' 1" }}
            >
              person
            </span>
          </div>
          <div>
            <div className="text-[13px] font-bold font-heading" style={{ color: 'var(--eco-on-surface)' }}>
              Commuter Profile
            </div>
            <div className="text-[10px] tracking-wider" style={{ color: 'var(--eco-on-surface-variant)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Elite Carbon Saver
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <ul className="flex-1 space-y-1">
          {navItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => setActiveNav(item.key)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left"
                style={{
                  background: activeNav === item.key ? 'var(--eco-secondary-container)' : 'transparent',
                  color: activeNav === item.key ? 'var(--eco-on-secondary-container)' : 'var(--eco-on-surface-variant)',
                  fontWeight: activeNav === item.key ? 600 : 400,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings: activeNav === item.key ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {item.icon}
                </span>
                <span className="text-body-md">{item.label}</span>
              </button>
            </li>
          ))}
          {/* Rewards & Milestones */}
          <li>
            <button
              onClick={() => setActiveNav('rewards')}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left"
              style={{
                background: activeNav === 'rewards' ? 'var(--eco-secondary-container)' : 'transparent',
                color: activeNav === 'rewards' ? 'var(--eco-on-secondary-container)' : 'var(--eco-on-surface-variant)',
                fontWeight: activeNav === 'rewards' ? 600 : 400,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings: activeNav === 'rewards' ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                emoji_events
              </span>
              <span className="text-body-md">Rewards &amp; Milestones</span>
            </button>
          </li>
          {/* Settings — last item */}
          <li>
            <button
              onClick={() => setActiveNav('settings')}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left"
              style={{
                background: activeNav === 'settings' ? 'var(--eco-secondary-container)' : 'transparent',
                color: activeNav === 'settings' ? 'var(--eco-on-secondary-container)' : 'var(--eco-on-surface-variant)',
                fontWeight: activeNav === 'settings' ? 600 : 400,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings: activeNav === 'settings' ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                settings
              </span>
              <span className="text-body-md">Settings</span>
            </button>
          </li>
        </ul>

        {/* Plan New Route Button */}
        {/* <div style={{ borderTop: '0.5px solid var(--eco-outline-variant)', paddingTop: '16px', marginTop: '8px' }}>
          <button
            onClick={() => setActiveNav('home')}
            className="w-full text-label-caps py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mb-3 font-bold"
            style={{
              background: 'var(--eco-primary)',
              color: 'var(--eco-on-primary)',
            }}
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Plan New Route
          </button>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200"
            style={{ color: 'var(--eco-tertiary)' }}
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-body-md">Logout</span>
          </a>
        </div> */}
      </nav>

      {/* ─── Mobile Header ──────────────────────────────────────────── */}
      <header
        className="fixed top-0 w-full z-50 md:hidden flex items-center justify-between px-5 h-14"
        style={{
          background: 'var(--eco-surface)',
          borderBottom: '0.5px solid var(--eco-outline-variant)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[22px]" style={{ color: 'var(--eco-primary)', fontVariationSettings: "'FILL' 1" }}>
            eco
          </span>
          <span className="text-[17px] font-bold font-heading" style={{ color: 'var(--eco-primary)' }}>
            GreenRoute
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[12px] font-bold" style={{ borderColor: 'var(--eco-outline-variant)', background: 'var(--eco-surface-container-lowest)' }}>
            <span className="material-symbols-outlined text-[15px]" style={{ color: 'var(--eco-primary)', fontVariationSettings: "'FILL' 1" }}>
              eco
            </span>
            <span style={{ color: 'var(--eco-on-surface)' }}>1,240 pts</span>
          </div>
        </div>
      </header>

      {/* ─── Main Column Wrapper (Offsets for Desktop Sidebar) ────────── */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-60">
        {/* Desktop Header */}
        <header
          className="hidden md:flex items-center justify-between px-8 h-14 border-b shrink-0 bg-[var(--eco-surface)]"
          style={{ borderColor: 'var(--eco-outline-variant)' }}
        >
          <div className="flex items-center gap-6">
            <span className="text-[16px] font-bold font-heading" style={{ color: 'var(--eco-primary)' }}>
              GreenRoute
            </span>
            <div className="h-5 w-px" style={{ background: 'var(--eco-outline-variant)' }} />
            <div className="relative">
              <span className="text-[12px] font-bold tracking-wider text-label-caps" style={{ color: 'var(--eco-primary)' }}>
                {activeNav === 'home' ? 'PLAN' : activeNav === 'routes' ? 'SAVED ROUTES' : activeNav === 'rewards' ? 'REWARDS' : activeNav === 'impact' ? 'IMPACT STATS' : 'SETTINGS'}
              </span>
              <div className="absolute -bottom-[21px] left-0 right-0 h-[2px]" style={{ background: 'var(--eco-primary)' }} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[16px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
                search
              </span>
              <input
                type="text"
                placeholder={activeNav === 'rewards' ? 'Search rewards...' : 'Search...'}
                className="pl-9 pr-4 py-1.5 rounded-lg border text-[12px] focus:outline-none w-52 transition-all"
                style={{
                  background: 'var(--eco-surface-container-low)',
                  borderColor: 'var(--eco-outline-variant)',
                  color: 'var(--eco-on-surface)',
                }}
              />
            </div>

            {/* Points balance */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-bold" style={{ borderColor: 'var(--eco-outline-variant)', background: 'var(--eco-surface-container-lowest)' }}>
              <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--eco-primary)', fontVariationSettings: "'FILL' 1" }}>
                eco
              </span>
              <span style={{ color: 'var(--eco-on-surface)' }}>1,240 pts</span>
            </div>
          </div>
        </header>

        {/* ─── Main Content ───────────────────────────────────────────── */}
        <main className="flex-1 w-full pt-16 pb-24 md:pt-8 md:pb-8 px-5 md:px-8 max-w-5xl mx-auto">
          {/* Train Alert Banner */}
          <div className="mb-4">
            <TrainAlertBanner />
          </div>

          {activeNav === 'home' && (
            <div className="max-w-4xl mx-auto">
              <div className="w-full">
                <SearchPage onTripSelect={handleTripSelect} />
              </div>

              <HomePanels trips={trips} />
            </div>
          )}

          {activeNav === 'impact' && (
            <div className="max-w-xl mx-auto">
              <h1 className="text-headline-lg mb-6" style={{ color: 'var(--eco-on-surface)' }}>
                Impact Stats
              </h1>
              <DashboardCard trips={trips} />
            </div>
          )}

          {activeNav === 'rewards' && (
            <RewardsPage />
          )}

          {activeNav === 'routes' && (
            <div className="max-w-xl mx-auto">
              <h1 className="text-headline-lg mb-6" style={{ color: 'var(--eco-on-surface)' }}>
                Saved Routes
              </h1>
              {trips.length === 0 ? (
                <div className="eco-card text-center py-12">
                  <span
                    className="material-symbols-outlined text-[48px] mb-4"
                    style={{ color: 'var(--eco-outline)' }}
                  >
                    bookmarks
                  </span>
                  <p className="text-body-lg" style={{ color: 'var(--eco-on-surface-variant)' }}>
                    No saved routes yet. Plan a commute to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {trips.map((trip) => (
                    <div key={trip.id} className="eco-card flex items-center gap-3">
                      <span className="material-symbols-outlined" style={{ color: 'var(--eco-primary)' }}>
                        {trip.mode === 'PT' ? 'directions_transit' : trip.mode === 'WALK' ? 'directions_walk' : 'directions_car'}
                      </span>
                      <div className="flex-1">
                        <div className="text-data-value" style={{ color: 'var(--eco-on-surface)' }}>
                          {trip.origin.name} → {trip.destination.name}
                        </div>
                        <div className="text-[11px] mt-0.5" style={{ color: 'var(--eco-on-surface-variant)' }}>
                          {new Date(trip.timestamp).toLocaleDateString()} · Saved {Math.round(trip.carbonSaved)}g CO₂
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeNav === 'settings' && (
            <SettingsPage />
          )}
        </main>

        {/* ─── Footer (Desktop only) ──────────────────────────────────── */}
        <footer
          className="hidden md:block"
          style={{
            background: 'var(--eco-surface)',
            borderTop: '0.5px solid var(--eco-outline-variant)',
          }}
        >
          <div className="max-w-5xl mx-auto px-8 py-5 text-center text-[12px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
            <p>🌱 Every journey matters. Choose the greener route.</p>
            <p className="mt-1">
              Data from{' '}
              <a href="https://datamall.lta.gov.sg" style={{ color: 'var(--eco-primary)' }}>
                LTA Datamall
              </a>{' '}
              &amp;{' '}
              <a href="https://www.onemap.gov.sg" style={{ color: 'var(--eco-primary)' }}>
                OneMap SLA
              </a>
            </p>
          </div>
        </footer>
      </div>

      {/* ─── Mobile Bottom Nav ──────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 w-full z-50 md:hidden flex justify-around items-center h-16 px-2 pb-safe"
        style={{
          background: 'var(--eco-surface)',
          borderTop: '0.5px solid var(--eco-outline-variant)',
        }}
      >
        {[
          { key: 'home' as const, icon: 'directions_transit', label: 'Plan' },
          { key: 'routes' as const, icon: 'map', label: 'Routes' },
          { key: 'rewards' as const, icon: 'emoji_events', label: 'Rewards' },
          { key: 'impact' as const, icon: 'analytics', label: 'Impact' },
          { key: 'settings' as const, icon: 'person', label: 'Account' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveNav(item.key)}
            className="flex flex-col items-center justify-center transition-transform active:scale-95"
            style={{
              color:
                activeNav === item.key
                  ? 'var(--eco-on-primary-container)'
                  : 'var(--eco-on-surface-variant)',
              ...(activeNav === item.key
                ? {
                  background: 'var(--eco-primary-container)',
                  borderRadius: '999px',
                  padding: '4px 16px',
                }
                : { width: '64px' }),
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: activeNav === item.key ? "'FILL' 1" : "'FILL' 0",
                fontSize: '22px',
              }}
            >
              {item.icon}
            </span>
            <span className="text-label-caps text-[10px] mt-0.5">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
