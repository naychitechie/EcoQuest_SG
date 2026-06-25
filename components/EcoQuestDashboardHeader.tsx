'use client';

export default function EcoQuestDashboardHeader() {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a2332] to-[#121824] p-4 mb-4 shadow-lg">
      {/* Profile row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-[15px] font-bold text-white shadow-md ring-2 ring-emerald-400/30">
            AT
          </div>
          <div>
            <div className="text-[15px] font-bold text-white tracking-tight">Alex Tan</div>
            <div className="text-[10px] uppercase tracking-wider text-emerald-400/80 font-semibold">
              EcoQuest SG
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-400/40">
            <span className="material-symbols-outlined text-[14px] text-orange-400" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_fire_department
            </span>
            <span className="text-[11px] font-bold text-orange-300">4-Day Streak</span>
          </div>
        </div>
      </div>

      {/* Progress metric */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">
            Total Progress
          </span>
          <span className="text-[13px] font-bold text-emerald-400">72%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: '72%' }} />
        </div>
      </div>

      {/* Tracker rows */}
      <div className="space-y-2">
        {/* Transport */}
        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
          <span className="material-symbols-outlined text-[18px] text-emerald-400 shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70 mb-0.5">Transport</div>
            <div className="text-[11px] leading-snug text-white/90">
              AMK MRT Sprint Verified! <span className="text-emerald-400 font-semibold">(100%)</span>
            </div>
          </div>
        </div>

        {/* Food */}
        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25">
          <span className="material-symbols-outlined text-[18px] text-amber-400 shrink-0 mt-0.5">
            restaurant
          </span>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400/70 mb-0.5">Food</div>
            <div className="text-[11px] leading-snug text-white/90">
              Personalized Local Nudge: &lsquo;Try a plant-based acai bowl outside Raffles Place MRT.&rsquo;{' '}
              <span className="text-amber-300 font-semibold">(In Progress: 45%)</span>
            </div>
          </div>
        </div>

        {/* Energy */}
        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/25">
          <span className="material-symbols-outlined text-[18px] text-blue-400 shrink-0 mt-0.5">
            bolt
          </span>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400/70 mb-0.5">Energy</div>
            <div className="text-[11px] leading-snug text-white/90">
              AC Sleep Timer: &lsquo;Run AC for 2 hours instead of 4.&rsquo;{' '}
              <span className="text-blue-300 font-semibold">(Adaptive Logic: Difficulty Reduced)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
