'use client';

import { useState } from 'react';
import { RoutesComparison, Route, Location } from '@/lib/types';
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
}

type ModeType = 'MRT' | 'BUS' | 'WALK' | 'CYCLE' | 'COMBO';

export default function RouteDetails({ comparison, onBack, onSelectRoute }: RouteDetailsProps) {
  const [selectedMode, setSelectedMode] = useState<ModeType>('MRT');
  const [showMap, setShowMap] = useState(false);

  // Extract base routes
  const ptRoute = comparison.pt;
  const walkRoute = comparison.walk;
  const driveRoute = comparison.drive;

  const carDistance = driveRoute ? driveRoute.totalDistance : 15.8;
  const carDuration = driveRoute ? driveRoute.totalDuration : 25;
  const carEmissions = driveRoute ? driveRoute.carbonEmissions : 147 * carDistance;

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
    }
  };

  const activeOption = options[selectedMode];

  // Calculate carbon savings relative to driving
  const currentEmissions = activeOption.emissionsPerKm * activeOption.distance;
  const carbonSavings = Math.max(0, carEmissions - currentEmissions);
  const carbonSavingsKg = Number((carbonSavings / 1000).toFixed(1));

  // Phone charges equivalent (1 phone charge = 7.6g of CO2 emissions)
  const phoneCharges = Math.round(carbonSavings / 7.6);
  let impactComparisonText = `that's like charging your phone every day for ${phoneCharges} days!`;
  if (phoneCharges >= 365) {
    const years = (phoneCharges / 365).toFixed(1);
    impactComparisonText = `that's like charging your phone every day for ${years === '1.0' ? 'a whole year' : `${years} years`}!`;
  }

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

  return (
    <div className="w-full">
      {/* ── Page Header & Back Button ───────────────────────────────── */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:bg-[var(--eco-surface-container)] cursor-pointer"
          style={{ borderColor: 'var(--eco-outline-variant)', background: 'var(--eco-surface-container-lowest)' }}
        >
          <span className="material-symbols-outlined text-[20px] font-bold">arrow_back</span>
        </button>
        <h1 className="text-headline-lg" style={{ color: 'var(--eco-on-surface)' }}>
          Route Details
        </h1>
      </div>

      {/* ── Trip Overview Card ───────────────────────────────────────── */}
      <div className="eco-card mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Route visualization chain */}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-5 h-5 rounded-full border-2 border-[var(--eco-primary)] flex items-center justify-center bg-white">
              <div className="w-2 h-2 rounded-full bg-[var(--eco-primary)]" />
            </div>
            <div className="h-6 w-0.5 my-1" style={{ borderLeft: '2px dashed var(--eco-outline-variant)' }} />
            <span className="material-symbols-outlined text-[20px] font-semibold" style={{ color: 'var(--eco-error)' }}>
              location_on
            </span>
          </div>

          <div className="flex-1 space-y-3">
            <div className="text-data-value text-[14px] font-semibold" style={{ color: 'var(--eco-on-surface)' }}>
              {comparison.origin.name}
            </div>
            <div className="text-data-value text-[14px] font-semibold" style={{ color: 'var(--eco-on-surface)' }}>
              {comparison.destination.name}
            </div>
          </div>
        </div>

        {/* Departure & Date Info */}
        <div className="flex gap-6 md:text-right md:border-l md:pl-8 md:h-12 items-center" style={{ borderColor: 'var(--eco-outline-variant)' }}>
          <div>
            <div className="text-label-caps text-[9px] tracking-wider" style={{ color: 'var(--eco-on-surface-variant)', opacity: 0.8 }}>
              DEPARTURE
            </div>
            <div className="text-[14px] font-bold" style={{ color: 'var(--eco-on-surface)' }}>
              08:30 AM
            </div>
          </div>
          <div>
            <div className="text-label-caps text-[9px] tracking-wider" style={{ color: 'var(--eco-on-surface-variant)', opacity: 0.8 }}>
              DATE
            </div>
            <div className="text-[14px] font-bold" style={{ color: 'var(--eco-on-surface)' }}>
              Today
            </div>
          </div>
        </div>
      </div>

      {/* ── Car Baseline Card ────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-5 mb-6 border"
        style={{
          background: 'var(--eco-surface-container)',
          borderColor: 'var(--eco-outline-variant)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[22px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
              directions_car
            </span>
            <span className="text-[15px] font-bold" style={{ color: 'var(--eco-on-surface-variant)' }}>
              Car Baseline
            </span>
          </div>
          <span className="text-[14px] font-bold" style={{ color: 'var(--eco-on-surface-variant)' }}>
            ~{Math.round(carDuration)} min
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-label-caps tracking-wider" style={{ color: 'var(--eco-on-surface-variant)' }}>
              CO2 EMISSIONS
            </span>
            <span className="font-bold" style={{ color: 'var(--eco-error)' }}>
              147 g/km
            </span>
          </div>
          {/* Carbon Progress Bar (Red/Car baseline) */}
          <div className="w-full h-3 rounded-full bg-[var(--eco-surface-dim)] overflow-hidden">
            <div className="h-full rounded-full bg-[var(--eco-error)]" style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      {/* ── Route Options Grid ── Top Row: MRT, Bus, Walking ────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {(['MRT', 'BUS', 'WALK'] as ModeType[]).map((key) => {
          const opt = options[key];
          const isSelected = selectedMode === key;

          // Calculate emissions details
          const ems = opt.emissionsPerKm * opt.distance;
          const barWidth = Math.min(100, Math.max(2, (ems / carEmissions) * 100));

          // Set outline color based on hover/selection
          let borderStyle = '0.5px solid var(--eco-outline-variant)';
          let bgStyle = 'var(--eco-surface-container-lowest)';

          if (isSelected) {
            bgStyle = 'var(--eco-surface-container-low)';
            if (opt.isGreenest) borderStyle = '2px solid var(--eco-primary)';
            else if (opt.isEcoChoice) borderStyle = '2px solid var(--eco-primary)';
            else borderStyle = '2px solid var(--eco-secondary)';
          }

          return (
            <div
              key={key}
              onClick={() => setSelectedMode(key)}
              className="eco-card transition-all duration-200 cursor-pointer flex flex-col relative overflow-hidden h-full group hover:shadow-md"
              style={{
                border: borderStyle,
                background: bgStyle,
                padding: '16px 20px',
              }}
            >
              {/* Greenest/Eco Badge */}
              {opt.isGreenest && (
                <div
                  className="absolute top-0 right-0 text-[10px] px-3 py-1 rounded-bl-xl font-bold flex items-center gap-1"
                  style={{
                    background: 'var(--eco-success-mint-bg)',
                    color: 'var(--eco-success-mint-text)',
                  }}
                >
                  <span className="material-symbols-outlined text-[12px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                  Greenest Choice
                </div>
              )}
              {opt.isEcoChoice && (
                <div
                  className="absolute top-0 right-0 text-[10px] px-3 py-1 rounded-bl-xl font-bold flex items-center gap-1 text-white"
                  style={{
                    background: 'var(--eco-primary)',
                  }}
                >
                  <span className="material-symbols-outlined text-[12px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  Eco Choice
                </div>
              )}

              {/* Title & Icons */}
              <div className="flex items-center gap-3 mb-4" style={{ marginTop: (opt.isGreenest || opt.isEcoChoice) ? '8px' : '0' }}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: opt.iconBg, color: opt.iconColor }}
                >
                  <span className="material-symbols-outlined text-[22px]">{opt.icon}</span>
                </div>
                <div>
                  <h3 className="text-[16px] font-bold font-heading" style={{ color: 'var(--eco-on-surface)' }}>
                    {opt.label}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {opt.badge && (
                      <span
                        className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded"
                        style={{ background: opt.badgeColor }}
                      >
                        {opt.badge}
                      </span>
                    )}
                    <span className="text-[11px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
                      {opt.badgeText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Metrics */}
              <div className="space-y-2 mt-auto">
                {/* Travel Time */}
                <div className="flex justify-between items-end pb-1" style={{ borderBottom: '0.5px solid var(--eco-outline-variant)' }}>
                  <span className="text-label-caps text-[9px]" style={{ color: 'var(--eco-on-surface-variant)', opacity: 0.8 }}>
                    TRAVEL TIME
                  </span>
                  <span className="text-[15px] font-bold" style={{ color: opt.isGreenest || opt.isEcoChoice ? 'var(--eco-primary)' : 'var(--eco-on-surface)' }}>
                    {opt.timeStr}
                  </span>
                </div>

                {/* Distance */}
                <div className="flex justify-between items-end pb-1" style={{ borderBottom: '0.5px solid var(--eco-outline-variant)' }}>
                  <span className="text-label-caps text-[9px]" style={{ color: 'var(--eco-on-surface-variant)', opacity: 0.8 }}>
                    DISTANCE
                  </span>
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--eco-on-surface)' }}>
                    {opt.distance} km
                  </span>
                </div>

                {/* Est. Fare */}
                <div className="flex justify-between items-end pb-1" style={{ borderBottom: '0.5px solid var(--eco-outline-variant)' }}>
                  <span className="text-label-caps text-[9px]" style={{ color: 'var(--eco-on-surface-variant)', opacity: 0.8 }}>
                    EST. FARE
                  </span>
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--eco-on-surface)' }}>
                    {formatFare(opt.fare)}
                  </span>
                </div>

                {/* CO2 emissions row */}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-label-caps text-[9px]" style={{ color: 'var(--eco-on-surface-variant)', opacity: 0.8 }}>
                    CO2 EMISSIONS
                  </span>
                  <span className="text-[12px] font-bold" style={{ color: opt.emissionsPerKm > 0 ? 'var(--eco-on-surface)' : 'var(--eco-primary)' }}>
                    {opt.emissionsPerKm} g/km
                  </span>
                </div>

                {/* Emissions Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-[var(--eco-surface-dim)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${barWidth}%`,
                      background: opt.emissionsPerKm > 10 ? 'var(--eco-tertiary)' : 'var(--eco-primary)'
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Route Options Grid ── Bottom Row: Cycling, Eco Combo ──────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 md:max-w-[calc(66.7%_+_8px)]">
        {(['CYCLE', 'COMBO'] as ModeType[]).map((key) => {
          const opt = options[key];
          const isSelected = selectedMode === key;

          const ems = opt.emissionsPerKm * opt.distance;
          const barWidth = Math.min(100, Math.max(2, (ems / carEmissions) * 100));

          let borderStyle = '0.5px solid var(--eco-outline-variant)';
          let bgStyle = 'var(--eco-surface-container-lowest)';

          if (isSelected) {
            bgStyle = 'var(--eco-surface-container-low)';
            if (opt.isGreenest) borderStyle = '2px solid var(--eco-primary)';
            else if (opt.isEcoChoice) borderStyle = '2px solid var(--eco-primary)';
            else borderStyle = '2px solid var(--eco-secondary)';
          }

          return (
            <div
              key={key}
              onClick={() => setSelectedMode(key)}
              className="eco-card transition-all duration-200 cursor-pointer flex flex-col relative overflow-hidden h-full group hover:shadow-md"
              style={{
                border: borderStyle,
                background: bgStyle,
                padding: '16px 20px',
              }}
            >
              {opt.isGreenest && (
                <div
                  className="absolute top-0 right-0 text-[10px] px-3 py-1 rounded-bl-xl font-bold flex items-center gap-1"
                  style={{
                    background: 'var(--eco-success-mint-bg)',
                    color: 'var(--eco-success-mint-text)',
                  }}
                >
                  <span className="material-symbols-outlined text-[12px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                  Greenest Choice
                </div>
              )}
              {opt.isEcoChoice && (
                <div
                  className="absolute top-0 right-0 text-[10px] px-3 py-1 rounded-bl-xl font-bold flex items-center gap-1 text-white"
                  style={{
                    background: 'var(--eco-primary)',
                  }}
                >
                  <span className="material-symbols-outlined text-[12px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  Eco Choice
                </div>
              )}
              <div className="flex items-center gap-3 mb-4" style={{ marginTop: (opt.isGreenest || opt.isEcoChoice) ? '8px' : '0' }}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: opt.iconBg, color: opt.iconColor }}
                >
                  <span className="material-symbols-outlined text-[22px]">{opt.icon}</span>
                </div>
                <div>
                  <h3 className="text-[16px] font-bold font-heading" style={{ color: 'var(--eco-on-surface)' }}>
                    {opt.label}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {opt.badge && (
                      <span
                        className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded"
                        style={{ background: opt.badgeColor }}
                      >
                        {opt.badge}
                      </span>
                    )}
                    <span className="text-[11px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
                      {opt.badgeText}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mt-auto">
                <div className="flex justify-between items-end pb-1" style={{ borderBottom: '0.5px solid var(--eco-outline-variant)' }}>
                  <span className="text-label-caps text-[9px]" style={{ color: 'var(--eco-on-surface-variant)', opacity: 0.8 }}>TRAVEL TIME</span>
                  <span className="text-[15px] font-bold" style={{ color: opt.isGreenest || opt.isEcoChoice ? 'var(--eco-primary)' : 'var(--eco-on-surface)' }}>{opt.timeStr}</span>
                </div>
                <div className="flex justify-between items-end pb-1" style={{ borderBottom: '0.5px solid var(--eco-outline-variant)' }}>
                  <span className="text-label-caps text-[9px]" style={{ color: 'var(--eco-on-surface-variant)', opacity: 0.8 }}>DISTANCE</span>
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--eco-on-surface)' }}>{opt.distance} km</span>
                </div>
                <div className="flex justify-between items-end pb-1" style={{ borderBottom: '0.5px solid var(--eco-outline-variant)' }}>
                  <span className="text-label-caps text-[9px]" style={{ color: 'var(--eco-on-surface-variant)', opacity: 0.8 }}>EST. FARE</span>
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--eco-on-surface)' }}>{formatFare(opt.fare)}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-label-caps text-[9px]" style={{ color: 'var(--eco-on-surface-variant)', opacity: 0.8 }}>CO2 EMISSIONS</span>
                  <span className="text-[12px] font-bold" style={{ color: opt.emissionsPerKm > 0 ? 'var(--eco-on-surface)' : 'var(--eco-primary)' }}>{opt.emissionsPerKm} g/km</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[var(--eco-surface-dim)] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${barWidth}%`, background: opt.emissionsPerKm > 10 ? 'var(--eco-tertiary)' : 'var(--eco-primary)' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Select Route Button ──────────────────────────────────────── */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleSelectClick}
          className="text-label-caps text-[12px] font-bold px-6 py-3 rounded-xl shrink-0 transition-all hover:opacity-95 shadow-sm cursor-pointer"
          style={{ background: 'var(--eco-primary)', color: 'var(--eco-on-primary)' }}
        >
          Save {activeOption.label.toUpperCase()} ROUTE
        </button>
      </div>

      {/* ── Toggle Map Panel (Premium Functional Addition) ────────── */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-2 text-[12px] font-bold py-2.5 px-5 rounded-xl border transition-all hover:bg-[var(--eco-surface-container-low)] cursor-pointer"
          style={{
            borderColor: 'var(--eco-outline-variant)',
            background: 'var(--eco-surface-container-lowest)',
            color: 'var(--eco-on-surface)',
          }}
        >
          <span className="material-symbols-outlined text-[18px]">{showMap ? 'map_off' : 'map'}</span>
          {showMap ? 'HIDE ROUTE MAP' : 'SHOW ROUTE MAP'}
        </button>
      </div>

      {/* Collapsible leaflet map container */}
      {showMap && activeOption.rawRoute && (
        <div className="mb-8 animate-fadeIn">
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
