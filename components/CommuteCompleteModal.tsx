'use client';

interface CommuteCompleteModalProps {
  onClaim: () => void;
}

export default function CommuteCompleteModal({ onClaim }: CommuteCompleteModalProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
      <div className="w-full max-w-[340px] rounded-2xl border border-emerald-400/40 bg-gradient-to-b from-[#1a3328] to-[#0d1117] p-6 text-center shadow-2xl animate-fadeIn">
        <div className="text-[40px] mb-3">🎉</div>

        <h2 className="text-[17px] font-bold text-white mb-2">
          COMMUTE COMPLETE!
        </h2>

        <p className="text-[13px] text-emerald-300 font-semibold mb-1">
          Reward Verified!
        </p>

        <p className="text-[12px] text-white/70 mb-6 leading-relaxed">
          +50 Streak Coins Earned &nbsp;|&nbsp; 1.2kg CO₂ Saved
        </p>

        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-6">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 w-full" />
        </div>

        <button
          onClick={onClaim}
          className="w-full py-3.5 rounded-xl text-[13px] font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:opacity-95 transition-opacity"
        >
          CLAIM REWARDS &amp; POST
        </button>
      </div>
    </div>
  );
}
