import React from 'react';
import { Trip } from '@/lib/types';
import { formatCarbon, carbonsToTreeDays } from '@/lib/utils';

export default function HomePanels({ trips = [] }: { trips?: Trip[] }) {
  const recent = [...trips].slice(-4).reverse();
  const totalCarbon = trips.reduce((s, t) => s + (t.carbonSaved || 0), 0);
  const treeDays = carbonsToTreeDays(totalCarbon);

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <div
            className="eco-card"
            style={{ padding: '24px 26px', boxShadow: '0 8px 24px rgba(17,24,20,0.06)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[17px] font-semibold" style={{ color: 'var(--eco-on-surface)', letterSpacing: '-0.01em' }}>
                Recent Routes
              </h3>
              <div className="text-[12px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
                View all
              </div>
            </div>

            {recent.length === 0 ? (
              <div className="text-body-md text-[13px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
                No recent routes — plan a trip to get started.
              </div>
            ) : (
              <div className="space-y-2">
                {recent.map((trip) => (
                  <div key={trip.id} className="flex items-center gap-3 py-3" style={{ borderBottom: '0.5px solid var(--eco-surface-dim)' }}>
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center" style={{ background: 'var(--eco-surface-container)', color: 'var(--eco-primary)' }}>
                      <span className="material-symbols-outlined text-[18px]">{trip.mode === 'PT' ? 'directions_transit' : trip.mode === 'WALK' ? 'directions_walk' : 'directions_car'}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-data-value" style={{ color: 'var(--eco-on-surface)' }}>
                        {trip.origin.name} → {trip.destination.name}
                      </div>
                      <div className="text-[12px] mt-0.5" style={{ color: 'var(--eco-on-surface-variant)' }}>
                        {new Date(trip.timestamp).toLocaleDateString()} · Saved {Math.round(trip.carbonSaved || 0)}g CO₂
                      </div>
                    </div>
                    <div className="text-[12px] font-semibold" style={{ color: 'var(--eco-primary)' }}>
                      {((trip.carbonSaved || 0) >= 1000 ? `${(trip.carbonSaved || 0) / 1000}kg` : `${Math.round(trip.carbonSaved || 0)}g`)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'linear-gradient(180deg, #f3fbf8, #effbf8)',
              border: '1px solid rgba(55, 120, 74, 0.08)',
              transform: 'translateY(14%)',
              boxShadow: '0 18px 40px rgba(17,24,20,0.06)'
            }}
          >
            <div className="text-[11px] font-semibold mb-2" style={{ color: 'var(--eco-on-surface-variant)' }}>
              COMMUNITY SPOTLIGHT
            </div>
            <div className="text-[18px] font-bold mb-1 font-heading" style={{ color: 'var(--eco-primary)' }}>
              SG Daily Impact
            </div>
            <div className="text-[34px] font-bold" style={{ color: 'var(--eco-on-surface)' }}>
              {totalCarbon >= 1000 ? (totalCarbon / 1000).toFixed(1) : Math.round(totalCarbon)}
            </div>
            <div className="text-[12px] mt-1 mb-4" style={{ color: 'var(--eco-on-surface-variant)' }}>
              kg CO₂ Saved
            </div>

            <p className="text-[13px]" style={{ color: 'var(--eco-on-surface-variant)', marginBottom: '10px' }}>
              Together, EcoCommute users have saved the equivalent of planting {Math.round(treeDays * 450)} trees today.
            </p>

            <div className="w-full h-3 rounded-full mt-2" style={{ background: 'rgba(34,197,94,0.12)' }}>
              <div className="h-3 rounded-full" style={{ width: `${Math.min(100, (totalCarbon / 20000) * 100)}%`, background: 'var(--eco-primary)' }} />
            </div>
            <div className="text-[11px] mt-2" style={{ color: 'var(--eco-on-surface-variant)', fontWeight: 600 }}>
              Target: 20,000 kg
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
