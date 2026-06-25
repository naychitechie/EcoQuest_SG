'use client';

import { useState } from 'react';
import { Location, RoutesComparison } from '@/lib/types';
import LocationInput from './LocationInput';
import RouteCard from './RouteCard';
import { formatCarbon } from '@/lib/utils';

interface SearchPageProps {
  onTripSelect?: (
    mode: 'PT' | 'WALK' | 'DRIVE',
    origin: Location,
    destination: Location,
    duration: number,
    carbonSavings: number
  ) => void;
}

export default function SearchPage({ onTripSelect }: SearchPageProps) {
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [comparison, setComparison] = useState<RoutesComparison | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'PT' | 'WALK' | 'DRIVE' | null>(null);

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
      setSelectedMode(data.bestOption);
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search routes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRoute = (mode: 'PT' | 'WALK' | 'DRIVE') => {
    setSelectedMode(mode);
    if (comparison && onTripSelect) {
      const route =
        mode === 'PT' ? comparison.pt : mode === 'WALK' ? comparison.walk : comparison.drive;
      if (route) {
        let savings = 0;
        if (mode === 'PT') savings = comparison.carbonSavings.vsDrive;
        else if (mode === 'WALK') savings = comparison.carbonSavings.walkVsDrive;
        else savings = 0;

        onTripSelect(mode, comparison.origin, comparison.destination, route.totalDuration, savings);
      }
    }
  };

  // Car baseline emissions for CO₂ bar proportions
  const carBaseline = comparison?.drive?.carbonEmissions || 0;

  // Get the selected route for map
  const selectedRoute = comparison
    ? selectedMode === 'PT'
      ? comparison.pt
      : selectedMode === 'WALK'
        ? comparison.walk
        : comparison.drive
    : null;

  return (
    <div className="w-full">
      {/* Search Card */}
      <div className="eco-card mb-6" style={{ padding: '24px 26px', boxShadow: '0 18px 40px rgba(17,24,20,0.06)', borderRadius: '18px' }}>
        <h2
          className="text-headline-md mb-1"
          style={{ color: 'var(--eco-on-surface)', fontWeight: 700 }}
        >
          Where are you going?
        </h2>
        <p className="text-body-md mb-6" style={{ color: 'var(--eco-on-surface-variant)' }}>
          Find the greenest route across Singapore.
        </p>

        {/* Origin + Destination with Swap on the right */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 space-y-3">
            <LocationInput
              placeholder="Origin (e.g., One-North MRT)"
              value={origin}
              onChange={setOrigin}
              icon="origin"
            />
            <LocationInput
              placeholder="Search destination (e.g., Changi Business Park)"
              value={destination}
              onChange={setDestination}
              icon="destination"
            />
          </div>

          {/* Swap Button — right side */}
          <button
            onClick={handleSwap}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200"
            style={{
              background: 'var(--eco-surface-container)',
              border: '0.5px solid var(--eco-outline-variant)',
              color: 'var(--eco-on-surface-variant)',
            }}
            aria-label="Swap origin and destination"
          >
            <span className="material-symbols-outlined text-[18px]">swap_vert</span>
          </button>
        </div>

        {/* PREFER chips + SEARCH button — same row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-label-caps text-[11px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
              PREFER:
            </span>
            {[
              { icon: 'directions_transit', label: 'MRT' },
              { icon: 'directions_bus', label: 'Bus' },
              { icon: 'directions_walk', label: 'Active' },
            ].map((mode) => (
              <button
                key={mode.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200"
                style={{
                  border: '0.5px solid var(--eco-outline-variant)',
                  background: 'var(--eco-surface-container-lowest)',
                  color: 'var(--eco-on-surface-variant)',
                }}
              >
                <span className="material-symbols-outlined text-[16px]">{mode.icon}</span>
                {mode.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="font-heading text-label-caps py-2.5 px-6 rounded-xl transition-all duration-200 disabled:opacity-50"
            style={{
              background: isLoading ? 'var(--eco-surface-dim)' : 'var(--eco-primary)',
              color: 'var(--eco-on-primary)',
            }}
          >
            {isLoading ? 'SEARCHING...' : 'SEARCH'}
          </button>
        </div>
      </div>

      {/* Results */}
      {comparison && (
        <div className="space-y-3">
          {/* Route Header */}
          <div
            className="eco-card flex items-center gap-4"
          >
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--eco-primary)' }}>
                trip_origin
              </span>
              <div className="h-6 w-px my-1" style={{ background: 'var(--eco-outline-variant)' }} />
              <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--eco-error)' }}>
                location_on
              </span>
            </div>
            <div className="flex-1">
              <div
                className="text-data-value pb-2 mb-2"
                style={{
                  color: 'var(--eco-on-surface)',
                  borderBottom: '0.5px solid var(--eco-outline-variant)',
                }}
              >
                {comparison.origin.name}
              </div>
              <div className="text-data-value" style={{ color: 'var(--eco-on-surface)' }}>
                {comparison.destination.name}
              </div>
            </div>
          </div>

          {/* Car Baseline Card */}
          {comparison.drive && (
            <div
              className="rounded-xl p-4"
              style={{
                background: 'var(--eco-surface-container)',
                border: '0.5px solid var(--eco-outline-variant)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: 'var(--eco-on-surface-variant)' }}
                  >
                    directions_car
                  </span>
                  <span className="text-headline-sm text-[14px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
                    Car Baseline
                  </span>
                </div>
                <span className="text-data-value" style={{ color: 'var(--eco-on-surface-variant)' }}>
                  ~{Math.round(comparison.drive.totalDuration)} min
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-label-caps" style={{ color: 'var(--eco-on-surface-variant)' }}>
                    CO₂ EMISSIONS
                  </span>
                  <span className="text-data-value" style={{ color: 'var(--eco-error)' }}>
                    {formatCarbon(comparison.drive.carbonEmissions)}
                  </span>
                </div>
                <div
                  className="w-full h-2 rounded-full"
                  style={{ background: 'var(--eco-surface-dim)' }}
                >
                  <div
                    className="h-2 rounded-full"
                    style={{ width: '100%', background: 'var(--eco-error)' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Route Cards */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gap-md mb-section-divider">
            <RouteCard
              route={comparison.pt}
              mode="PT"
              isSelected={selectedMode === 'PT'}
              isBest={comparison.bestOption === 'PT'}
              onClick={() => handleSelectRoute('PT')}
              carbonSavings={comparison.carbonSavings.vsDrive}
              carBaselineEmissions={carBaseline}
              onSelect={() => handleSelectRoute('PT')}
            />
            <RouteCard
              route={comparison.walk}
              mode="WALK"
              isSelected={selectedMode === 'WALK'}
              isBest={comparison.bestOption === 'WALK'}
              onClick={() => handleSelectRoute('WALK')}
              carbonSavings={comparison.carbonSavings.walkVsDrive}
              carBaselineEmissions={carBaseline}
              onSelect={() => handleSelectRoute('WALK')}
            />
            <RouteCard
              route={comparison.drive}
              mode="DRIVE"
              isSelected={selectedMode === 'DRIVE'}
              isBest={comparison.bestOption === 'DRIVE'}
              onClick={() => handleSelectRoute('DRIVE')}
              carBaselineEmissions={carBaseline}
              onSelect={() => handleSelectRoute('DRIVE')}
            />
          </div>

          {/* Map */}
          {selectedRoute && (
            <div className="mt-4">
              <MapView
                origin={comparison.origin}
                destination={comparison.destination}
                route={selectedRoute}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Lazy-loaded map component
import dynamic from 'next/dynamic';
const RouteMapDynamic = dynamic(() => import('@/components/RouteMap'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-xl flex items-center justify-center"
      style={{
        height: '400px',
        background: 'var(--eco-surface-container)',
        border: '0.5px solid var(--eco-outline-variant)',
      }}
    >
      <span className="material-symbols-outlined animate-spin text-[24px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
        progress_activity
      </span>
    </div>
  ),
});

function MapView({
  origin,
  destination,
  route,
}: {
  origin: Location;
  destination: Location;
  route: { mode: string; routeGeometry?: string; legGeometries?: string[]; steps: Array<{ mode: string }> };
}) {
  return (
    <RouteMapDynamic
      origin={origin}
      destination={destination}
      route={route as Parameters<typeof RouteMapDynamic>[0]['route']}
    />
  );
}
