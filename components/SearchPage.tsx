'use client';

import { useState } from 'react';
import { Location, RoutesComparison } from '@/lib/types';
import LocationInput from './LocationInput';
import RouteDetails from './RouteDetails';

interface SearchPageProps {
  onTripSelect?: (
    mode: 'PT' | 'WALK' | 'DRIVE',
    origin: Location,
    destination: Location,
    duration: number,
    carbonSavings: number
  ) => void;
  onStartCommute?: (destination: string, etaMinutes: number) => void;
  commuteLocked?: boolean;
}

export default function SearchPage({ onTripSelect, onStartCommute, commuteLocked }: SearchPageProps) {
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [comparison, setComparison] = useState<RoutesComparison | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = async () => {
    if (!origin || !destination) {
      alert('Please select both origin and destination');
      return;
    }

    setIsLoading(true);
    setComparison(null);

    try {
      const response = await fetch('/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination }),
      });

      if (!response.ok) throw new Error('Failed to fetch routes');

      const data: RoutesComparison = await response.json();
      setComparison(data);
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search routes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (comparison) {
    return (
      <RouteDetails
        comparison={comparison}
        onBack={() => setComparison(null)}
        onStartCommute={onStartCommute}
        commuteLocked={commuteLocked}
        onSelectRoute={(mode, duration, savings) => {
          if (onTripSelect) {
            const standardMode =
              mode === 'MRT' || mode === 'BUS' || mode === 'COMBO'
                ? 'PT'
                : mode === 'CYCLE' || mode === 'WALK'
                  ? 'WALK'
                  : 'DRIVE';
            onTripSelect(standardMode, comparison.origin, comparison.destination, duration, savings);
            alert(`Logged your ${mode} commute! Saved ${Math.round(savings)}g CO₂.`);
            setComparison(null);
          }
        }}
      />
    );
  }

  return (
    <div className="ecoquest-card-dark p-3 mt-1 space-y-2">
      <div>
        <h2 className="text-sm font-bold text-white">Where are you going?</h2>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Find the greenest route across Singapore.
        </p>
      </div>

      <div className="flex items-start gap-2">
        <div className="flex-1 space-y-2">
          <LocationInput
            placeholder="Origin (e.g., One-North MRT)"
            value={origin}
            onChange={setOrigin}
            icon="origin"
            variant="dark"
          />
          <LocationInput
            placeholder="Destination (e.g., Raffles Place MRT)"
            value={destination}
            onChange={setDestination}
            icon="destination"
            variant="dark"
          />
        </div>
        <button
          type="button"
          onClick={handleSwap}
          className="w-8 h-8 mt-1 rounded-full flex items-center justify-center shrink-0 bg-slate-950 border border-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
          aria-label="Swap origin and destination"
        >
          <span className="material-symbols-outlined text-[16px]">swap_vert</span>
        </button>
      </div>

      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
          Prefer
        </span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { icon: 'directions_transit', label: 'MRT' },
            { icon: 'directions_bus', label: 'Bus' },
            { icon: 'directions_walk', label: 'Active' },
          ].map((mode) => (
            <button
              key={mode.label}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-950 border border-slate-800 text-slate-400"
            >
              <span className="material-symbols-outlined text-[14px]">{mode.icon}</span>
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSearch}
        disabled={isLoading}
        className="ecoquest-btn-primary"
      >
        {isLoading ? 'Searching…' : 'Search Routes'}
      </button>
    </div>
  );
}
