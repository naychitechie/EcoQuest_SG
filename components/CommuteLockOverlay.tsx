'use client';

interface CommuteLockOverlayProps {
  destination: string;
  etaMinutes: number;
  onFastForward: () => void;
}

export default function CommuteLockOverlay({
  destination,
  etaMinutes,
  onFastForward,
}: CommuteLockOverlayProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121824]/95 backdrop-blur-sm px-6">
      <div className="w-full max-w-[340px] rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-[#1a2332] to-[#0d1117] p-6 text-center shadow-2xl">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px] text-emerald-400 animate-pulse">
            directions_transit
          </span>
        </div>

        <div className="text-[10px] uppercase tracking-[0.15em] font-bold text-emerald-400/70 mb-2">
          Transit Lock Active
        </div>

        <h2 className="text-[15px] font-bold text-white leading-snug mb-3">
          COMMUTE IN PROGRESS: Arriving at {destination} in {etaMinutes} minutes.
        </h2>

        <p className="text-[12px] text-white/60 mb-4">
          Verifying Schedule&hellip;
        </p>

        <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 mb-6">
          <span className="material-symbols-outlined text-[14px] text-red-400">lock</span>
          <span className="text-[10px] text-red-300/80 font-medium">Early rewards disabled during transit</span>
        </div>

        <button
          onClick={onFastForward}
          className="text-[9px] text-white/25 hover:text-white/50 transition-colors font-mono tracking-wide"
        >
          [DEBUG: FAST FORWARD]
        </button>
      </div>
    </div>
  );
}
