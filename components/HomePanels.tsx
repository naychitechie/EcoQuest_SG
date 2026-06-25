'use client';

import { RecentRoute, UserStats } from '@/lib/constants';
import { carbonsToTreeDays } from '@/lib/utils';

interface HomePanelsProps {
  recentRoutes: RecentRoute[];
  userStats: UserStats;
  onRouteSelect: (route: RecentRoute) => void;
}

function modeIcon(mode: RecentRoute['mode']) {
  if (mode === 'WALK') return 'directions_walk';
  if (mode === 'BUS') return 'directions_bus';
  return 'directions_transit';
}

export default function HomePanels({ recentRoutes, userStats, onRouteSelect }: HomePanelsProps) {
  const recent = recentRoutes.slice(0, 4);
  const totalCarbon = userStats.co2SavedKg * 1000;
  const treeDays = carbonsToTreeDays(totalCarbon);

  return (
    <div className="mt-4 space-y-3 pb-2">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white">Recent Routes</h3>
          <span className="text-[11px] text-slate-400">{recentRoutes.length} total</span>
        </div>

        {recent.length === 0 ? (
          <p className="text-[12px] text-slate-400">No recent routes — plan a trip to get started.</p>
        ) : (
          <div className="space-y-2">
            {recent.map((route) => (
              <button
                key={route.id}
                type="button"
                onClick={() => onRouteSelect(route)}
                className="w-full flex items-center gap-3 py-2 border-b border-slate-800 last:border-0 text-left hover:bg-slate-800/40 rounded-lg px-1 -mx-1 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-slate-800 text-emerald-400 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">{modeIcon(route.mode)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {route.origin.name} → {route.destination.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(route.timestamp).toLocaleDateString()} · {route.mode}
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

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
          Community Spotlight
        </div>
        <div className="text-sm font-bold text-emerald-400 mb-1">SG Daily Impact</div>
        <div className="text-2xl font-bold text-white">
          {userStats.co2SavedKg.toFixed(1)}
          <span className="text-sm font-normal text-slate-400 ml-1">kg CO₂ Saved</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Together, EcoQuest SG users have saved the equivalent of planting{' '}
          {Math.round(treeDays * 450)} trees today.
        </p>
        <div className="w-full h-1.5 rounded-full mt-2 bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${Math.min(100, (userStats.co2SavedKg / 20) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
