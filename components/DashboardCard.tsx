'use client';

import { useEffect, useState } from 'react';
import { Trip } from '@/lib/types';
import { formatCarbon, carbonsToTreeDays } from '@/lib/utils';
import { STORAGE_KEYS } from '@/lib/constants';

interface DashboardCardProps {
  trips?: Trip[];
}

export default function DashboardCard({ trips: propTrips }: DashboardCardProps) {
  const [localTrips, setLocalTrips] = useState<Trip[]>([]);

  useEffect(() => {
    if (!propTrips || propTrips.length === 0) {
      const stored = localStorage.getItem(STORAGE_KEYS.TRIPS);
      if (stored) {
        try {
          setLocalTrips(JSON.parse(stored));
        } catch {
          // Ignore
        }
      }
    }
  }, [propTrips]);

  const trips = propTrips && propTrips.length > 0 ? propTrips : localTrips;
  const totalCarbonSaved = trips.reduce((sum, trip) => sum + (trip.carbonSaved || 0), 0);

  const treeDays = carbonsToTreeDays(totalCarbonSaved);
  const totalWalkKm = trips
    .filter((t) => t.mode === 'WALK')
    .reduce((sum, t) => sum + t.duration * 0.08, 0); // ~4.8 km/h walking speed

  // Monthly chart data (simulated from trip history)
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
  const monthData = [0, 0, 0, 0, 0, 0];
  const now = new Date();
  trips.forEach((trip) => {
    const tripDate = new Date(trip.timestamp);
    const monthsAgo = (now.getFullYear() - tripDate.getFullYear()) * 12 + now.getMonth() - tripDate.getMonth();
    if (monthsAgo >= 0 && monthsAgo < 6) {
      monthData[5 - monthsAgo] += trip.carbonSaved || 0;
    }
  });
  const maxMonthValue = Math.max(...monthData, 1);

  return (
    <div className="space-y-4">
      {/* Milestone Banner */}
      {totalCarbonSaved >= 1000 && (
        <div
          className="rounded-xl p-4 flex items-start gap-3"
          style={{
            background: 'var(--eco-success-mint-bg)',
            border: '0.5px solid var(--eco-success-mint-text)',
          }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'var(--eco-success-mint-text)', color: 'var(--eco-on-primary)' }}
          >
            <span className="material-symbols-outlined text-[18px]">celebration</span>
          </div>
          <div>
            <h3
              className="text-[14px] font-semibold font-heading"
              style={{ color: 'var(--eco-success-mint-text)' }}
            >
              Carbon Milestone!
            </h3>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--eco-success-mint-text)', opacity: 0.9 }}>
              You&apos;ve saved {formatCarbon(totalCarbonSaved)} of CO₂! Keep it up! 🌱
            </p>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="eco-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label-caps text-[10px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
              Total CO₂ Saved
            </span>
            <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--eco-primary)' }}>
              eco
            </span>
          </div>
          <div className="text-[22px] font-bold font-heading" style={{ color: 'var(--eco-on-surface)' }}>
            {totalCarbonSaved >= 1000
              ? `${(totalCarbonSaved / 1000).toFixed(1)}`
              : Math.round(totalCarbonSaved)}
            <span className="text-[12px] ml-1 font-normal" style={{ color: 'var(--eco-on-surface-variant)' }}>
              {totalCarbonSaved >= 1000 ? 'kg' : 'g'}
            </span>
          </div>
        </div>

        <div className="eco-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label-caps text-[10px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
              Trees Planted Eq.
            </span>
            <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--eco-mrt-teal)' }}>
              park
            </span>
          </div>
          <div className="text-[22px] font-bold font-heading" style={{ color: 'var(--eco-on-surface)' }}>
            {treeDays.toFixed(1)}
            <span className="text-[12px] ml-1 font-normal" style={{ color: 'var(--eco-on-surface-variant)' }}>
              trees
            </span>
          </div>
          <div
            className="w-full h-1.5 rounded-full mt-2"
            style={{ background: 'var(--eco-surface-container-highest)' }}
          >
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${Math.min(100, treeDays * 20)}%`,
                background: 'var(--eco-mrt-teal)',
              }}
            />
          </div>
        </div>

        {/* Distance Walked */}
        <div className="eco-card col-span-2 flex items-center justify-between">
          <div>
            <span className="text-label-caps text-[10px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
              KILOMETERS WALKED
            </span>
            <div className="text-[22px] font-bold font-heading mt-1" style={{ color: 'var(--eco-on-surface)' }}>
              {totalWalkKm.toFixed(1)}
              <span className="text-[12px] ml-1 font-normal" style={{ color: 'var(--eco-on-surface-variant)' }}>
                km
              </span>
            </div>
          </div>
          <div
            className="p-3 rounded-full"
            style={{ background: 'rgba(0, 97, 162, 0.1)' }}
          >
            <span className="material-symbols-outlined" style={{ color: 'var(--eco-secondary)' }}>
              directions_walk
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Savings Chart */}
      <div className="eco-card">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-[16px] font-semibold font-heading" style={{ color: 'var(--eco-on-surface)' }}>
              Monthly Savings
            </h3>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--eco-on-surface-variant)' }}>
              CO₂ reduction over 6 months
            </p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-2 h-32 pt-4">
          {months.map((month, i) => {
            const height = maxMonthValue > 0 ? (monthData[i] / maxMonthValue) * 100 : 0;
            const isCurrent = i === 5;
            return (
              <div key={month} className="flex flex-col items-center w-full group">
                <div className="relative w-full flex justify-center" style={{ height: '100%' }}>
                  <div
                    className="w-full rounded-t-sm transition-colors duration-200 self-end"
                    style={{
                      height: `${Math.max(height, 4)}%`,
                      background: isCurrent ? 'var(--eco-primary)' : 'var(--eco-surface-container)',
                    }}
                  />
                  {monthData[i] > 0 && (
                    <span
                      className="absolute -top-4 text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: isCurrent ? 'var(--eco-primary)' : 'var(--eco-on-surface-variant)' }}
                    >
                      {Math.round(monthData[i] / 1000)}
                    </span>
                  )}
                </div>
                <span
                  className="text-label-caps text-[10px] mt-2"
                  style={{
                    color: isCurrent ? 'var(--eco-primary)' : 'var(--eco-on-surface-variant)',
                    fontWeight: isCurrent ? 700 : 500,
                  }}
                >
                  {month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trip Count */}
      <div className="eco-card text-center">
        <div className="text-label-caps mb-2" style={{ color: 'var(--eco-on-surface-variant)' }}>
          ECO TRIPS COMPLETED
        </div>
        <div className="text-[28px] font-bold font-heading" style={{ color: 'var(--eco-primary)' }}>
          {trips.filter((t) => t.mode !== 'DRIVE').length}
        </div>
      </div>
    </div>
  );
}
