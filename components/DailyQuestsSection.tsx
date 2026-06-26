'use client';

import { useState } from 'react';
import { DailyQuestClaims } from '@/lib/constants';

interface DailyQuestsSectionProps {
  questClaims: DailyQuestClaims;
  onClaimFood: () => void;
  onVerifyEnergy: () => Promise<void>;
}

export default function DailyQuestsSection({
  questClaims,
  onClaimFood,
  onVerifyEnergy,
}: DailyQuestsSectionProps) {
  const [energyVerifying, setEnergyVerifying] = useState(false);

  const handleVerifyEnergy = async () => {
    setEnergyVerifying(true);
    await onVerifyEnergy();
    setEnergyVerifying(false);
  };

  return (
    <section className="w-full pb-4">
      <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-3 px-4">
        Today&apos;s Quests
      </h2>
      <div className="flex flex-col gap-3 px-4">
        {/* Transit — MRT (static, calibrated) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl border flex items-center justify-center text-xl shrink-0 bg-emerald-500/15 border-emerald-500/30">
            🚇
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white truncate">Take MRT to work</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              EcoQuest SG · save ~1.8kg CO₂ vs Grab
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
              +60 XP
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
              +1.2 kg
            </span>
          </div>
        </div>

        {/* Food quest */}
        <div
          className={`bg-slate-900/80 border rounded-xl p-3 flex items-center gap-3 ${
            questClaims.food ? 'border-emerald-500/30 opacity-70' : 'border-slate-800'
          }`}
        >
          <div className="w-11 h-11 rounded-xl border flex items-center justify-center text-xl shrink-0 bg-amber-500/15 border-amber-500/30">
            🥗
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white truncate">Plant-based lunch</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              Food · skip meat once today
            </p>
          </div>
          <div className="shrink-0">
            {questClaims.food ? (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                ✅ Claimed
              </span>
            ) : (
              <button
                type="button"
                onClick={onClaimFood}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold px-3 py-1 rounded-lg transition-colors"
              >
                Claim
              </button>
            )}
          </div>
        </div>

        {/* Energy quest */}
        <div
          className={`bg-slate-900/80 border rounded-xl p-3 flex items-center gap-3 ${
            questClaims.energy ? 'border-emerald-500/30 opacity-70' : 'border-slate-800'
          }`}
        >
          <div className="w-11 h-11 rounded-xl border flex items-center justify-center text-xl shrink-0 bg-blue-500/15 border-blue-500/30">
            ⚡
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white truncate">Cut standby power</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {energyVerifying
                ? 'Simulating Smart-Meter Sync…'
                : 'Energy · unplug 3 idle devices'}
            </p>
          </div>
          <div className="shrink-0">
            {questClaims.energy ? (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                ✅ Claimed
              </span>
            ) : energyVerifying ? (
              <span className="material-symbols-outlined text-[20px] text-emerald-400 animate-spin">
                progress_activity
              </span>
            ) : (
              <button
                type="button"
                onClick={() => void handleVerifyEnergy()}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold px-3 py-1 rounded-lg transition-colors"
              >
                Verify
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
