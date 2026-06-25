'use client';

import { useState } from 'react';
import { Trip } from '@/lib/types';
import { formatCarbon } from '@/lib/utils';
import { STORAGE_KEYS } from '@/lib/constants';

interface DashboardCardProps {
  trips?: Trip[];
  extended?: boolean;
}

function ImpactStatsGrid() {
  const metrics = [
    {
      label: 'CO₂ Saved',
      value: '4.8 kg',
      subtext: '+1.2 kg today',
      subtextClass: 'text-emerald-400',
    },
    {
      label: 'Green Commutes',
      value: '12 / 15',
      subtext: 'Target: Tier 2',
      subtextClass: 'text-slate-400',
    },
    {
      label: 'Streak Coins',
      value: '340',
      subtext: '+50 Pending',
      subtextClass: 'text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
      {metrics.map((m) => (
        <div key={m.label} className="min-w-0 text-center">
          <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold truncate">
            {m.label}
          </div>
          <div className="text-sm font-bold text-white mt-0.5">{m.value}</div>
          <div className={`text-[10px] mt-0.5 font-medium ${m.subtextClass}`}>{m.subtext}</div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardCard({ trips: propTrips, extended = false }: DashboardCardProps) {
  const [localTrips] = useState<Trip[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRIPS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const trips = propTrips && propTrips.length > 0 ? propTrips : localTrips;
  const totalCarbonSaved = trips.reduce((sum, trip) => sum + (trip.carbonSaved || 0), 0);
  const totalWalkKm = trips
    .filter((t) => t.mode === 'WALK')
    .reduce((sum, t) => sum + t.duration * 0.08, 0);

  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
  const monthData = [0, 0, 0, 0, 0, 0];
  const now = new Date();
  trips.forEach((trip) => {
    const tripDate = new Date(trip.timestamp);
    const monthsAgo =
      (now.getFullYear() - tripDate.getFullYear()) * 12 + now.getMonth() - tripDate.getMonth();
    if (monthsAgo >= 0 && monthsAgo < 6) {
      monthData[5 - monthsAgo] += trip.carbonSaved || 0;
    }
  });
  const maxMonthValue = Math.max(...monthData, 1);

  return (
    <div className="space-y-4">
      <ImpactStatsGrid />

      {extended && (
        <>
          {totalCarbonSaved >= 1000 && (
            <div className="rounded-xl p-4 flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/25">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-emerald-500/30">
                <span className="material-symbols-outlined text-[18px] text-emerald-400">celebration</span>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-emerald-400">Carbon Milestone!</h3>
                <p className="text-[12px] mt-0.5 text-emerald-300/80">
                  You&apos;ve saved {formatCarbon(totalCarbonSaved)} of CO₂! Keep it up!
                </p>
              </div>
            </div>
          )}

          <div className="rounded-2xl p-4 border border-slate-800 bg-slate-900/60">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Monthly Savings</h3>
                <p className="text-[11px] mt-0.5 text-slate-400">CO₂ reduction over 6 months</p>
              </div>
            </div>
            <div className="flex items-end justify-between gap-2 h-24 pt-2">
              {months.map((month, i) => {
                const height = maxMonthValue > 0 ? (monthData[i] / maxMonthValue) * 100 : 0;
                const isCurrent = i === 5;
                return (
                  <div key={month} className="flex flex-col items-center w-full">
                    <div className="relative w-full flex justify-center" style={{ height: '64px' }}>
                      <div
                        className="w-full rounded-t-sm self-end"
                        style={{
                          height: `${Math.max(height, 4)}%`,
                          background: isCurrent ? '#10b981' : 'rgba(255,255,255,0.1)',
                        }}
                      />
                    </div>
                    <span
                      className="text-[9px] mt-1 uppercase font-semibold"
                      style={{ color: isCurrent ? '#10b981' : 'rgba(255,255,255,0.4)' }}
                    >
                      {month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl p-3 border border-slate-800 bg-slate-900/60">
              <span className="text-[9px] uppercase text-slate-400">Km Walked</span>
              <div className="text-lg font-bold text-white mt-1">{totalWalkKm.toFixed(1)} km</div>
            </div>
            <div className="rounded-xl p-3 border border-slate-800 bg-slate-900/60 text-center">
              <span className="text-[9px] uppercase text-slate-400">Eco Trips</span>
              <div className="text-lg font-bold text-emerald-400 mt-1">
                {trips.filter((t) => t.mode !== 'DRIVE').length}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
