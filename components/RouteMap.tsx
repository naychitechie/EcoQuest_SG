'use client';

import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { decodePolyline } from '@/lib/polyline';

// ---------------------------------------------------------------------------
// Fix Leaflet's default icon paths – they break under Next.js bundling
// because the icon images aren't resolved correctly from node_modules.
// ---------------------------------------------------------------------------
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ---------------------------------------------------------------------------
// Custom marker icons
// ---------------------------------------------------------------------------
const originIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'leaflet-marker-icon-green',
});

const destinationIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'leaflet-marker-icon-red',
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface RouteMapProps {
  origin?: { lat: number; lng: number; name: string } | null;
  destination?: { lat: number; lng: number; name: string } | null;
  route?: {
    mode: 'PT' | 'WALK' | 'DRIVE';
    routeGeometry?: string;
    legGeometries?: string[];
    steps: Array<{ mode: string }>;
  } | null;
}

// ---------------------------------------------------------------------------
// Colour mapping by transport mode
// ---------------------------------------------------------------------------
function getPolylineColor(mode: string): string {
  const upper = mode.toUpperCase();
  if (upper === 'MRT' || upper === 'SUBWAY') return '#1D9E75';
  if (upper === 'BUS') return '#0061a2';
  if (upper === 'WALK') return '#275300';
  if (upper === 'DRIVE') return '#993C1D';
  return '#1D9E75'; // default fallback
}

// ---------------------------------------------------------------------------
// FitBounds – uses useMap() to auto‑fit the map view whenever the bounds
// derived from markers / polylines change.
// ---------------------------------------------------------------------------
function FitBounds({
  origin,
  destination,
  polylinePoints,
}: {
  origin?: { lat: number; lng: number } | null;
  destination?: { lat: number; lng: number } | null;
  polylinePoints: [number, number][];
}) {
  const map = useMap();

  useEffect(() => {
    const points: L.LatLngExpression[] = [];

    if (origin) points.push([origin.lat, origin.lng]);
    if (destination) points.push([destination.lat, destination.lng]);
    polylinePoints.forEach((p) => points.push(p));

    if (points.length >= 2) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [40, 40] });
    } else if (points.length === 1) {
      map.setView(points[0], 15);
    }
  }, [map, origin, destination, polylinePoints]);

  return null;
}

// ---------------------------------------------------------------------------
// RouteMap component
// ---------------------------------------------------------------------------
export default function RouteMap({ origin, destination, route }: RouteMapProps) {
  // Build the decoded polyline data so we can render + fit bounds
  const { segments, allPoints } = useMemo(() => {
    const segs: { positions: [number, number][]; color: string }[] = [];
    const all: [number, number][] = [];

    if (!route) return { segments: segs, allPoints: all };

    if (route.mode === 'PT' && route.legGeometries && route.legGeometries.length > 0) {
      // Public transport – one polyline per leg
      route.legGeometries.forEach((geom, i) => {
        const decoded = decodePolyline(geom);
        const stepMode = route.steps[i]?.mode ?? 'WALK';
        segs.push({ positions: decoded, color: getPolylineColor(stepMode) });
        all.push(...decoded);
      });
    } else if (route.routeGeometry) {
      // Walk / Drive – single polyline
      const decoded = decodePolyline(route.routeGeometry);
      const color =
        route.mode === 'DRIVE' ? '#993C1D' : route.mode === 'WALK' ? '#275300' : '#1D9E75';
      segs.push({ positions: decoded, color });
      all.push(...decoded);
    }

    return { segments: segs, allPoints: all };
  }, [route]);

  return (
    <>
      {/* Inline styles for coloured marker icons & container */}
      <style>{`
        .leaflet-marker-icon-green {
          filter: hue-rotate(100deg) saturate(1.5);
        }
        .leaflet-marker-icon-red {
          filter: hue-rotate(-30deg) saturate(2);
        }
      `}</style>

      <div
        style={{
          height: 400,
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid #c2c9b7',
          background: '#fbf9f2',
        }}
      >
        <MapContainer
          center={[1.3521, 103.8198]}
          zoom={12}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution="&copy; OneMap &copy; SLA"
            url="https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png"
          />

          {/* Origin marker (green) */}
          {origin && (
            <Marker position={[origin.lat, origin.lng]} icon={originIcon} />
          )}

          {/* Destination marker (red) */}
          {destination && (
            <Marker position={[destination.lat, destination.lng]} icon={destinationIcon} />
          )}

          {/* Polyline segments */}
          {segments.map((seg, i) => (
            <Polyline
              key={i}
              positions={seg.positions}
              pathOptions={{ color: seg.color, weight: 5, opacity: 0.85 }}
            />
          ))}

          {/* Auto-fit map to markers + route */}
          <FitBounds origin={origin} destination={destination} polylinePoints={allPoints} />
        </MapContainer>
      </div>
    </>
  );
}
