import { CARBON_FACTORS, CARBON_CONVERSIONS } from './constants';
import { Route } from './types';

/**
 * Calculate total carbon emissions for a route
 */
export function calculateCarbonEmissions(route: Route): number {
  return route.steps.reduce((total, step) => {
    const factor = CARBON_FACTORS[step.mode] || 0;
    return total + factor * step.distance;
  }, 0);
}

/**
 * Calculate CO2 savings vs driving
 */
export function calculateSavings(route: Route, driveRoute: Route): number {
  const drivingEmissions = driveRoute.carbonEmissions;
  const routeEmissions = route.carbonEmissions;
  return Math.max(0, drivingEmissions - routeEmissions);
}

/**
 * Convert grams to kg
 */
export function gramsToKg(grams: number): number {
  return grams / CARBON_CONVERSIONS.gToKg;
}

/**
 * Calculate equivalent trees for a day
 * (How many trees would absorb this CO2 in one day)
 */
export function carbonsToTreeDays(carbonGrams: number): number {
  return carbonGrams / CARBON_CONVERSIONS.treeAbsorptionPerDay;
}

/**
 * Format carbon emissions for display
 */
export function formatCarbon(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(1)} kg`;
  }
  return `${Math.round(grams)}g`;
}

/**
 * Format time duration for display
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

/**
 * Format fare for display
 */
export function formatFare(sgd: number): string {
  return `$${sgd.toFixed(2)}`;
}

/**
 * Get emoji for transport mode
 */
export function getModeEmoji(mode: string): string {
  const emojis: Record<string, string> = {
    MRT: '🚇',
    SUBWAY: '🚇',
    RAIL: '🚇',
    BUS: '🚌',
    WALK: '🚶',
    DRIVE: '🚗',
    PT: '🚌',
    CAR: '🚗',
  };
  return emojis[mode] || '📍';
}

/**
 * Get the CO₂ bar width as a percentage relative to car emissions
 */
export function getCarbonBarPercent(emissions: number, carBaseline: number): number {
  if (carBaseline <= 0) return 0;
  return Math.min(100, Math.round((emissions / carBaseline) * 100));
}

/**
 * Get the color class for a transport mode's CO₂ display
 */
export function getModeColor(mode: string): string {
  const colors: Record<string, string> = {
    MRT: '#1D9E75',
    SUBWAY: '#1D9E75',
    RAIL: '#1D9E75',
    BUS: '#633806',
    WALK: '#085041',
    DRIVE: '#993C1D',
    PT: '#1D9E75',
    CAR: '#993C1D',
  };
  return colors[mode] || '#727969';
}
