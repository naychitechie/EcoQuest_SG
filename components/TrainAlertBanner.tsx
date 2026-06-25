'use client';

import { useEffect, useState } from 'react';

interface TrainDisruption {
  line: string;
  direction: string;
  stations: string;
  freePublicBus: boolean;
  freeMRTShuttle: boolean;
  message: string;
}

interface TrainAlertData {
  status: number;
  disruptions: TrainDisruption[];
}

const LINE_NAMES: Record<string, string> = {
  NSL: 'North-South Line',
  EWL: 'East-West Line',
  CCL: 'Circle Line',
  DTL: 'Downtown Line',
  NEL: 'North-East Line',
  TEL: 'Thomson-East Coast Line',
  BPL: 'Bukit Panjang LRT',
  SLRT: 'Sengkang LRT',
  PLRT: 'Punggol LRT',
};

const LINE_COLORS: Record<string, string> = {
  NSL: '#D42E12',
  EWL: '#009645',
  CCL: '#FA9E0D',
  DTL: '#005EC4',
  NEL: '#9900AA',
  TEL: '#9D5B25',
  BPL: '#748477',
  SLRT: '#748477',
  PLRT: '#748477',
};

export default function TrainAlertBanner() {
  const [alerts, setAlerts] = useState<TrainAlertData | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/train-alerts');
        if (response.ok) {
          const data: TrainAlertData = await response.json();
          setAlerts(data);
        }
      } catch (error) {
        console.error('Failed to fetch train alerts:', error);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000); // Poll every 60s
    return () => clearInterval(interval);
  }, []);

  if (!alerts || alerts.status !== 2 || alerts.disruptions.length === 0) {
    return null;
  }

  const visibleDisruptions = alerts.disruptions.filter(
    (d) => !dismissed.has(d.line)
  );

  if (visibleDisruptions.length === 0) return null;

  return (
    <div className="space-y-2">
      {visibleDisruptions.map((disruption) => (
        <div
          key={disruption.line}
          className="bg-[#FAEEDA] border border-[#633806]/20 rounded-xl p-4 flex items-start gap-3"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: LINE_COLORS[disruption.line] || '#748477' }}
          >
            {disruption.line.replace('L', '')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-[#633806]">
                {LINE_NAMES[disruption.line] || disruption.line} Disruption
              </span>
            </div>
            <p className="text-xs text-[#633806]/80 leading-relaxed">
              {disruption.message}
            </p>
            {disruption.stations && (
              <p className="text-xs text-[#633806]/60 mt-1">
                Affected: {disruption.stations}
              </p>
            )}
            <div className="flex gap-2 mt-2">
              {disruption.freePublicBus && (
                <span className="text-[10px] font-medium bg-[#633806]/10 text-[#633806] px-2 py-0.5 rounded">
                  Free Bus Available
                </span>
              )}
              {disruption.freeMRTShuttle && (
                <span className="text-[10px] font-medium bg-[#633806]/10 text-[#633806] px-2 py-0.5 rounded">
                  Free MRT Shuttle
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setDismissed((prev) => new Set([...prev, disruption.line]));
            }}
            className="text-[#633806]/50 hover:text-[#633806] transition-colors shrink-0"
            aria-label="Dismiss alert"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
