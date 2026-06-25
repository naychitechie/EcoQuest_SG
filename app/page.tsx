'use client';

import SearchPage from '@/components/SearchPage';
import DashboardCard from '@/components/DashboardCard';
import HomePanels from '@/components/HomePanels';
import TrainAlertBanner from '@/components/TrainAlertBanner';
import RewardsPage from '@/components/RewardsPage';
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
    { key: 'rewards' as const, icon: 'emoji_events', label: 'Rewards & Milestones' },
    { key: 'impact' as const, icon: 'leaderboard', label: 'Impact Stats' },
    { key: 'settings' as const, icon: 'settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: 'var(--eco-surface)' }}>
      {/* ─── Desktop Sidebar ──────────────────────────────────────────── */}
      <nav
        className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col py-6 px-4 z-40"
        style={{
          background: 'var(--eco-surface-container-low)',
          borderRight: '0.5px solid var(--eco-outline-variant)',
        }}
      >
        {/* User Profile */}
        <div className="flex items-center gap-3 px-4 mb-6">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0"
            style={{
              background: 'var(--eco-primary)',
              color: 'var(--eco-on-primary)',
            }}
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
          </div>
          <div>
            <div className="text-[14px] font-semibold font-heading" style={{ color: 'var(--eco-primary)' }}>
              Commuter Profile
            </div>
            <div className="text-[11px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
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
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left"
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
        </ul>

        {/* Plan New Route Button - at bottom like design */}
        <div className="mt-auto pt-4 space-y-2">
          <button
            onClick={() => setActiveNav('home')}
            className="w-full text-label-caps py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: 'var(--eco-primary)',
              color: 'var(--eco-on-primary)',
            }}
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Plan New Route
          </button>

          <div style={{ borderTop: '0.5px solid var(--eco-outline-variant)', paddingTop: '8px' }}>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200"
              style={{ color: 'var(--eco-on-surface-variant)' }}
            >
              <span className="material-symbols-outlined">help</span>
              <span className="text-body-md">Help</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200"
              style={{ color: 'var(--eco-on-surface-variant)' }}
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="text-body-md">Logout</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Mobile Header ──────────────────────────────────────────── */}
      <header
        className="fixed top-0 w-full z-50 md:hidden flex items-center justify-between px-5 h-16"
        style={{
          background: 'var(--eco-surface)',
          borderBottom: '0.5px solid var(--eco-outline-variant)',
        }}
      >
        <div className="text-headline-md" style={{ color: 'var(--eco-primary)', fontSize: '20px' }}>
          GreenRoute
        </div>
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined p-2 rounded-full transition-colors"
            style={{ color: 'var(--eco-primary)' }}
          >
            eco
          </span>
        </div>
      </header>

      {/* ─── Main Content ───────────────────────────────────────────── */}
      <main className="flex-1 w-full pt-20 pb-24 md:pt-8 md:pb-8 md:pl-72 px-5 max-w-5xl mx-auto">
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
          <div className="max-w-xl mx-auto">
            <h1 className="text-headline-lg mb-6" style={{ color: 'var(--eco-on-surface)' }}>
              Settings
            </h1>
            <div className="eco-card text-center py-12">
              <span
                className="material-symbols-outlined text-[48px] mb-4"
                style={{ color: 'var(--eco-outline)' }}
              >
                settings
              </span>
              <p className="text-body-lg" style={{ color: 'var(--eco-on-surface-variant)' }}>
                Settings coming soon.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ─── Footer (Desktop only) ──────────────────────────────────── */}
      <footer
        className="hidden md:block md:pl-64"
        style={{
          background: 'var(--eco-surface)',
          borderTop: '0.5px solid var(--eco-outline-variant)',
        }}
      >
        <div className="max-w-5xl mx-auto px-5 py-6 text-center text-[12px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
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
