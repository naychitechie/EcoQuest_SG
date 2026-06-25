'use client';

import { Route } from '@/lib/types';
import {
  formatCarbon,
  formatDistance,
  formatDuration,
  formatFare,
  getCarbonBarPercent,
} from '@/lib/utils';

interface RouteCardProps {
  route: Route | null;
  mode: 'PT' | 'WALK' | 'DRIVE';
  isSelected: boolean;
  isBest: boolean;
  onClick: () => void;
  carbonSavings?: number;
  carBaselineEmissions?: number;
  onSelect?: () => void;
}

const MODE_CONFIG: Record<string, {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  barColor: string;
}> = {
  PT: {
    label: 'Public Transport',
    icon: 'directions_transit',
    color: '#1D9E75',
    bgColor: 'rgba(29, 158, 117, 0.08)',
    barColor: '#1D9E75',
  },
  WALK: {
    label: 'Walking',
    icon: 'directions_walk',
    color: '#275300',
    bgColor: 'rgba(39, 83, 0, 0.08)',
    barColor: '#085041',
  },
  DRIVE: {
    label: 'Drive / Grab',
    icon: 'directions_car',
    color: '#993C1D',
    bgColor: 'rgba(153, 60, 29, 0.08)',
    barColor: '#993C1D',
  },
};

export default function RouteCard({
  route,
  mode,
  isSelected,
  isBest,
  onClick,
  carbonSavings,
  carBaselineEmissions = 0,
  onSelect,
}: RouteCardProps) {
  if (!route) {
    return (
      <div
        className="p-4 rounded-xl opacity-50 cursor-not-allowed"
        style={{
          border: '0.5px solid var(--eco-outline-variant)',
          background: 'var(--eco-surface-container)',
        }}
      >
        <div className="text-body-md" style={{ color: 'var(--eco-on-surface-variant)' }}>
          Route not available
        </div>
      </div>
    );
  }

  const config = MODE_CONFIG[mode] || MODE_CONFIG.PT;
  const carbonBarPercent = getCarbonBarPercent(route.carbonEmissions, carBaselineEmissions);

  // Determine step summary for PT (e.g., "EWL · Bus 197")
  const stepSummary = route.steps
    .filter((s) => s.mode !== 'WALK')
    .map((s) => {
      if (s.mode === 'SUBWAY' || s.mode === 'MRT' || s.mode === 'RAIL') {
        return s.route ? s.route : 'MRT';
      }
      if (s.mode === 'BUS') {
        return s.route ? `Bus ${s.route}` : 'Bus';
      }
      return s.mode;
    })
    .join(' → ');

  return (
    <div
      className="col-span-1 md:col-span-4 rounded-xl transition-all duration-200 relative overflow-hidden group flex flex-col h-full"
      style={{
        padding: '12px 16px',
        border: isSelected
          ? `1.5px solid ${config.color}`
          : isBest
            ? `1px solid ${config.color}40`
            : '0.5px solid var(--eco-outline-variant)',
        background: isSelected
          ? config.bgColor
          : 'var(--eco-surface-container-lowest)',
        boxShadow: isBest ? `0 0 15px ${config.color}15` : 'none',
      }}
    >
      {/* Greenest Badge */}
      {isBest && (
        <div
          className="absolute top-0 right-0 text-label-caps text-[10px] px-2 py-0.5 rounded-bl-lg flex items-center gap-1"
          style={{
            background: 'var(--eco-success-mint-bg)',
            color: 'var(--eco-success-mint-text)',
            borderLeft: `0.5px solid ${config.color}30`,
            borderBottom: `0.5px solid ${config.color}30`,
          }}
        >
          <span className="material-symbols-outlined text-[12px]">eco</span>
          Greenest
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-3" style={{ marginTop: isBest ? '8px' : '0' }}>
        <div
          className="w-8 h-8 flex items-center justify-center text-white"
          style={{
            backgroundColor: config.color,
            borderRadius: mode === 'WALK' ? '50%' : '0.5rem',
          }}
        >
          <span className="material-symbols-outlined text-[18px]">{config.icon}</span>
        </div>
        <div>
          <h3
            className="text-[14px] font-semibold font-heading"
            style={{ color: 'var(--eco-on-surface)' }}
          >
            {config.label}
          </h3>
          {stepSummary && (
            <div className="flex items-center gap-1 mt-0.5">
              {route.steps
                .filter((s) => s.mode !== 'WALK')
                .map((s, i) => {
                  const isMRT = s.mode === 'SUBWAY' || s.mode === 'MRT' || s.mode === 'RAIL';
                  return (
                    <span
                      key={i}
                      className="px-1.5 py-0 text-white text-[9px] font-bold"
                      style={{
                        backgroundColor: isMRT ? '#00953A' : 'var(--eco-secondary)',
                        borderRadius: isMRT ? '999px' : '4px',
                      }}
                    >
                      {s.route || s.mode}
                    </span>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="space-y-2">
        <div
          className="flex justify-between items-end pb-1"
          style={{ borderBottom: '0.5px solid var(--eco-outline-variant)' }}
        >
          <span className="text-label-caps text-[10px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
            TIME
          </span>
          <span className="text-data-value text-[14px]" style={{ color: config.color }}>
            {formatDuration(route.totalDuration)}
          </span>
        </div>
        <div
          className="flex justify-between items-end pb-1"
          style={{ borderBottom: '0.5px solid var(--eco-outline-variant)' }}
        >
          <span className="text-label-caps text-[10px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
            DIST
          </span>
          <span className="text-data-value text-[12px]" style={{ color: 'var(--eco-on-surface)' }}>
            {formatDistance(route.totalDistance)}
          </span>
        </div>
        {route.totalFare > 0 && (
          <div
            className="flex justify-between items-end pb-1"
            style={{ borderBottom: '0.5px solid var(--eco-outline-variant)' }}
          >
            <span className="text-label-caps text-[10px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
              FARE
            </span>
            <span className="text-data-value text-[12px]" style={{ color: 'var(--eco-on-surface)' }}>
              {formatFare(route.totalFare)}
            </span>
          </div>
        )}

        {/* CO₂ Row + Bar */}
        <div className="flex justify-between items-center pt-1">
          <span className="text-label-caps text-[10px]" style={{ color: 'var(--eco-on-surface-variant)' }}>
            CO₂
          </span>
          <span className="text-data-value text-[11px]" style={{ color: config.color }}>
            {formatCarbon(route.carbonEmissions)}
          </span>
        </div>
        <div
          className="w-full h-1 rounded-full"
          style={{ background: 'var(--eco-surface-container)' }}
        >
          <div
            className="h-1 rounded-full transition-all duration-500"
            style={{
              width: `${carbonBarPercent}%`,
              backgroundColor: config.barColor,
            }}
          />
        </div>

        {/* Savings callout */}
        {mode !== 'DRIVE' && carbonSavings !== undefined && carbonSavings > 0 && (
          <div
            className="text-[11px] mt-1 font-medium"
            style={{ color: 'var(--eco-success-mint-text)' }}
          >
            Save {formatCarbon(carbonSavings)} vs driving
          </div>
        )}
      </div>
      
      {/* SELECT Button */}
      <button
        onClick={onSelect || onClick}
        className="mt-auto pt-3 w-full text-label-caps py-2.5 px-3 rounded-lg transition-all duration-200 font-bold"
        style={{
          background: config.color,
          color: 'var(--eco-on-primary)',
          fontSize: '12px',
        }}
      >
        SELECT {mode === 'PT' ? 'MRT' : mode === 'WALK' ? 'WALKING' : 'DRIVE'} ROUTE
      </button>
    </div>
  );
}
