'use client';

const REWARDS = [
  {
    icon: 'credit_card',
    title: '$5 SimplyGo Rebate',
    cost: '200 Coins',
    locked: false,
  },
  {
    icon: 'local_cafe',
    title: 'Gong Cha Eco-Cup Discount',
    cost: '150 Coins',
    locked: false,
  },
  {
    icon: 'directions_transit',
    title: 'Free MRT Off-Peak Ride',
    cost: '300 Coins',
    locked: false,
  },
  {
    icon: 'park',
    title: 'Gardens by the Bay Entry',
    cost: '500 Coins',
    locked: false,
  },
  {
    icon: 'help',
    title: 'Mystery Eco Box',
    cost: 'Level 15',
    locked: true,
  },
];

const MILESTONES = [
  { icon: 'local_fire_department', label: '4-Day Streak', earned: true },
  { icon: 'directions_transit', label: 'MRT Master', earned: true },
  { icon: 'restaurant', label: 'Plant Pioneer', earned: false },
];

export default function RewardsPage({ streakCoins }: { streakCoins: number }) {
  return (
    <div className="w-full min-w-0 h-full overflow-y-auto pb-2">
      {/* Hero header */}
      <div className="relative pt-4 pb-2 px-4">
        <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-sm font-semibold">
          {streakCoins} Coins
        </div>
        <h1 className="text-base font-bold text-white pr-28">Rewards &amp; Milestones</h1>
        <p className="text-[11px] text-slate-400 mt-1">Redeem Streak Coins for local perks.</p>
      </div>

      {/* Milestones row */}
      <div className="px-4 mb-4">
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
          Milestones
        </div>
        <div className="flex gap-2">
          {MILESTONES.map((m) => (
            <div
              key={m.label}
              className={`flex-1 flex flex-col items-center p-2 rounded-xl border ${
                m.earned
                  ? 'bg-emerald-500/10 border-emerald-500/25'
                  : 'bg-slate-900/60 border-slate-800 opacity-50'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px] text-emerald-400"
                style={{ fontVariationSettings: m.earned ? "'FILL' 1" : "'FILL' 0" }}
              >
                {m.icon}
              </span>
              <span className="text-[9px] text-center text-slate-300 mt-1 font-medium leading-tight">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Vouchers — single-column stack */}
      <div className="px-4 mb-2">
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
          Vouchers &amp; Rewards
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-4 pb-4">
        {REWARDS.map((reward) => (
          <div
            key={reward.title}
            className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-emerald-400">
                  {reward.icon}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white truncate">{reward.title}</div>
                <div className="text-xs text-slate-400">{reward.cost}</div>
              </div>
            </div>
            <button
              disabled={reward.locked}
              className={`shrink-0 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                reward.locked ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              {reward.locked ? 'Locked' : 'Redeem'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
