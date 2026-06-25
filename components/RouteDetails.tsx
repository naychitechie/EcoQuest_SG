'use client';

import { useState } from 'react';
import { RoutesComparison, Route } from '@/lib/types';
import dynamic from 'next/dynamic';

// Dynamically import RouteMap to avoid SSR Leaflet window errors
const RouteMap = dynamic(() => import('./RouteMap'), { ssr: false });

interface RouteDetailsProps {
  comparison: RoutesComparison;
  onBack: () => void;
  onSelectRoute?: (
    mode: 'MRT' | 'BUS' | 'WALK' | 'CYCLE' | 'COMBO',
    duration: number,
    carbonSavings: number
  ) => void;
  onStartCommute?: (destination: string, etaMinutes: number) => void;
  commuteLocked?: boolean;
}

type ModeType = 'MRT' | 'BUS' | 'WALK' | 'CYCLE' | 'COMBO';

export default function RouteDetails({ comparison, onBack, onSelectRoute, onStartCommute, commuteLocked }: RouteDetailsProps) {
  const [selectedMode, setSelectedMode] = useState<ModeType>('MRT');
  const [showMap, setShowMap] = useState(false);

  // Extract base routes
  const ptRoute = comparison.pt;
  const walkRoute = comparison.walk;
  const driveRoute = comparison.drive;

  const carDistance = driveRoute ? driveRoute.totalDistance : 15.8;
  const carDuration = driveRoute ? driveRoute.totalDuration : 25;
  const carEmissions = driveRoute ? driveRoute.carbonEmissions : 147 * carDistance;

  // Helper helper function to construct clean Google Maps Universal Links
  const getGoogleMapsUrl = (mode: ModeType) => {
    const originEnc = encodeURIComponent(comparison.origin.name);
    const destEnc = encodeURIComponent(comparison.destination.name);

    // Map application internal modes to Google Maps travelmode parameters
    // transit (r), walking (w), bicycling (b)
    let travelMode = 'transit';
    if (mode === 'WALK') travelMode = 'walking';
    if (mode === 'CYCLE') travelMode = 'bicycling';
    if (mode === 'BUS' || mode === 'MRT' || mode === 'COMBO') travelMode = 'transit';

    return `https://www.google.com/maps/dir/?api=1&origin=${originEnc}&destination=${destEnc}&travelmode=${travelMode}`;
  };

  // Process and simulate data for the 5 options
  const options = {
    MRT: {
      mode: 'MRT' as const,
      label: 'MRT',
      badge: 'EWL',
      badgeText: 'Green Line',
      badgeColor: '#00953A',
      icon: 'directions_transit',
      iconBg: '#E1F5EE',
      iconColor: '#085041',
      time: Math.round(ptRoute ? ptRoute.totalDuration : carDuration * 1.3),
      timeStr: `${Math.round(ptRoute ? ptRoute.totalDuration : carDuration * 1.3)} min`,
      distance: Number((ptRoute ? ptRoute.totalDistance : carDistance * 1.05).toFixed(1)),
      fare: ptRoute && ptRoute.totalFare > 0 ? ptRoute.totalFare : 1.84,
      emissionsPerKm: 4,
      isGreenest: true,
      isEcoChoice: false,
      rawRoute: ptRoute,
      mapsUrl: getGoogleMapsUrl('MRT'),
    },
    BUS: {
      mode: 'BUS' as const,
      label: 'Bus',
      badge: '197',
      badgeText: 'Direct Route',
      badgeColor: '#0061a2',
      icon: 'directions_bus',
      iconBg: '#E6F1FB',
      iconColor: '#0C447C',
      time: Math.round(ptRoute ? ptRoute.totalDuration * 1.4 : carDuration * 2.0),
      timeStr: `${Math.round(ptRoute ? ptRoute.totalDuration * 1.4 : carDuration * 2.0)} min`,
      distance: Number((ptRoute ? ptRoute.totalDistance * 1.02 : carDistance * 1.1).toFixed(1)),
      fare: ptRoute && ptRoute.totalFare > 0 ? ptRoute.totalFare + 0.26 : 2.10,
      emissionsPerKm: 25,
      isGreenest: false,
      isEcoChoice: false,
      rawRoute: ptRoute,
      mapsUrl: getGoogleMapsUrl('BUS'),
    },
    WALK: {
      mode: 'WALK' as const,
      label: 'Walking',
      badge: '',
      badgeText: 'Via PCN',
      badgeColor: 'transparent',
      icon: 'directions_walk',
      iconBg: '#E1F5EE',
      iconColor: '#085041',
      time: walkRoute ? Math.round(walkRoute.totalDuration) : 195,
      timeStr: walkRoute
        ? (walkRoute.totalDuration > 60
          ? `${Math.floor(walkRoute.totalDuration / 60)}h ${Math.round(walkRoute.totalDuration % 60)}m`
          : `${Math.round(walkRoute.totalDuration)} min`)
        : '3h 15m',
      distance: Number((walkRoute ? walkRoute.totalDistance : carDistance).toFixed(1)),
      fare: 0.00,
      emissionsPerKm: 0,
      isGreenest: false,
      isEcoChoice: false,
      rawRoute: walkRoute,
      mapsUrl: getGoogleMapsUrl('WALK'),
    },
    CYCLE: {
      mode: 'CYCLE' as const,
      label: 'Cycling',
      badge: '',
      badgeText: 'Via Park Connector',
      badgeColor: 'transparent',
      icon: 'directions_bike',
      iconBg: '#E1F5EE',
      iconColor: '#085041',
      time: walkRoute ? Math.round(walkRoute.totalDuration / 4.5) : 45,
      timeStr: walkRoute
        ? `${Math.round(walkRoute.totalDuration / 4.5)} min`
        : '45 min',
      distance: Number((walkRoute ? walkRoute.totalDistance * 0.95 : carDistance * 0.95).toFixed(1)),
      fare: 0.00,
      emissionsPerKm: 0,
      isGreenest: false,
      isEcoChoice: false,
      rawRoute: walkRoute ? {
        ...walkRoute,
        mode: 'WALK', // mapped to walk for rendering fallback
        totalDuration: walkRoute.totalDuration / 4.5,
      } as Route : null,
      mapsUrl: getGoogleMapsUrl('CYCLE'),
    },
    COMBO: {
      mode: 'COMBO' as const,
      label: 'Eco Combo',
      badge: '',
      badgeText: 'Cycle + MRT',
      badgeColor: 'transparent',
      icon: 'directions_run',
      iconBg: '#275300',
      iconColor: '#ffffff',
      time: Math.round(ptRoute ? ptRoute.totalDuration * 1.15 : carDuration * 1.5),
      timeStr: `${Math.round(ptRoute ? ptRoute.totalDuration * 1.15 : carDuration * 1.5)} min`,
      distance: Number((ptRoute ? ptRoute.totalDistance * 0.98 : carDistance * 0.98).toFixed(1)),
      fare: ptRoute && ptRoute.totalFare > 0 ? Math.max(0.80, ptRoute.totalFare - 0.34) : 1.50,
      emissionsPerKm: 2,
      isGreenest: false,
      isEcoChoice: true,
      rawRoute: ptRoute,
      mapsUrl: getGoogleMapsUrl('COMBO'),
    }
  };

  const activeOption = options[selectedMode];

  // Calculate carbon savings relative to driving
  const currentEmissions = activeOption.emissionsPerKm * activeOption.distance;
  const carbonSavings = Math.max(0, carEmissions - currentEmissions);

  // Format currency
  const formatFare = (val: number) => {
    return val === 0 ? '$0.00' : `$${val.toFixed(2)}`;
  };

  const handleSelectClick = () => {
    if (onSelectRoute) {
      onSelectRoute(activeOption.mode, activeOption.time, carbonSavings);
    } else {
      alert(`Successfully saved your ${activeOption.label} commute! Savings logged: ${Math.round(carbonSavings)}g CO₂.`);
      onBack();
    }
  };

  const allModes: ModeType[] = ['MRT', 'BUS', 'WALK', 'CYCLE', 'COMBO'];

  const renderCompactCard = (key: ModeType) => {
    const opt = options[key];
    const isSelected = selectedMode === key;

    return (
      <div
        key={key}
        onClick={() => setSelectedMode(key)}
        className={`p-3 bg-slate-900/60 border rounded-xl flex flex-col gap-2 cursor-pointer transition-all ${
          isSelected ? 'border-emerald-500/60' : 'border-slate-800/80'
        } ${opt.isGreenest ? 'ring-1 ring-emerald-500/30' : ''}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[18px] text-emerald-400 shrink-0">
              {opt.icon}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate">
                {opt.label}
                {opt.badge && (
                  <span className="ml-1.5 text-[10px] font-bold text-white/80 bg-slate-700 px-1.5 py-0.5 rounded">
                    {opt.badge}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400 truncate">{opt.badgeText}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-emerald-400 font-bold">{opt.timeStr}</div>
            <div className="text-[11px] text-slate-400">{formatFare(opt.fare)}</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{opt.distance} km · {opt.emissionsPerKm} g/km CO₂</span>
          {opt.isGreenest && (
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
              Greenest
            </span>
          )}
          {opt.isEcoChoice && (
            <span className="text-emerald-400 font-semibold">Eco Choice</span>
          )}
        </div>

        {key === 'MRT' && opt.isGreenest && onStartCommute && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!commuteLocked) {
                const destLabel = comparison.destination.name
                  .replace(/\s+MRT Station$/i, ' Stn')
                  .replace(/\s+Station$/i, ' Stn');
                onStartCommute(destLabel, 18);
              }
            }}
            disabled={commuteLocked}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold py-2 rounded-xl transition-all shadow-md mt-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            START COMMUTE
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full min-w-0 py-2">
      {/* Back + header */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-800 bg-slate-900/80 text-white"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        </button>
        <h1 className="text-sm font-bold text-white">Route Results</h1>
      </div>

      {/* Trip summary — compact */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl mb-3 space-y-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px] text-emerald-400">trip_origin</span>
          <span className="text-xs text-white truncate">{comparison.origin.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px] text-red-400">location_on</span>
          <span className="text-xs text-white truncate">{comparison.destination.name}</span>
        </div>
        <div className="flex justify-between pt-1 text-[11px] text-slate-400">
          <span>Car baseline ~{Math.round(carDuration)} min</span>
          <span>147 g/km CO₂</span>
        </div>
      </div>

      {/* Route options — vertical stack */}
      <div className="flex flex-col gap-2 py-2">
        {allModes.map(renderCompactCard)}
      </div>

      {/* Save route + map toggle */}
      <div className="flex flex-col gap-2 mt-3 pb-4">
        <button
          onClick={handleSelectClick}
          className="w-full py-2 rounded-xl text-xs font-bold uppercase bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
        >
          Save {activeOption.label} Route
        </button>
        <button
          onClick={() => setShowMap(!showMap)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border border-slate-800 bg-slate-900/60 text-slate-300"
        >
          <span className="material-symbols-outlined text-[16px]">{showMap ? 'map_off' : 'map'}</span>
          {showMap ? 'Hide Route Map' : 'Show Route Map'}
        </button>
      </div>

      {showMap && activeOption.rawRoute && (
        <div className="mb-4 animate-fadeIn">
          <RouteMap
            origin={comparison.origin}
            destination={comparison.destination}
            route={activeOption.rawRoute}
          />
        </div>
      )}
    </div>
  );
}