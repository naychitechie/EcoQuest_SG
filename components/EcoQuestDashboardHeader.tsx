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
      <div>
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
    </div>
  );
}
