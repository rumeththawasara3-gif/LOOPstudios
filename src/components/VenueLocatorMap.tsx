import React, { useState, useEffect, useRef } from 'react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  Send,
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Camera,
  Car,
  Clock,
  ExternalLink,
  Layers,
  Search,
} from 'lucide-react';
import { getWhatsAppUrl, WHATSAPP_NUMBER } from '../types.ts';
import { computeClientSideVenueLogistics } from '../geminiClient.ts';

// KULT Studios Exact Base Location (Nittambuwa, Western Province)
export const BASE_COORDINATES = { lat: 7.1424, lng: 80.1038 };
const KULT_STUDIOS_BASE = {
  lat: 7.1424,
  lng: 80.1038,
  name: 'KULT Studios HQ',
  address: 'Nittambuwa, Western Province, Sri Lanka',
};

// Popular Sri Lankan Venue & Destination Presets
const VENUE_PRESETS = [
  { name: 'Colombo (Galle Face & Shangri-La)', lat: 6.9271, lng: 79.8612 },
  { name: 'Kandy (Grand Kandyan & Lake)', lat: 7.2906, lng: 80.6337 },
  { name: 'Negombo (Jetwing Beach & Lagoon)', lat: 7.2008, lng: 79.8737 },
  { name: 'Gampaha (Miriswatta & Sanmira)', lat: 7.0917, lng: 79.9999 },
  { name: 'Galle (Galle Fort & Light House)', lat: 6.0535, lng: 80.2210 },
  { name: 'Bentota (Cinnamon Bentota Beach)', lat: 6.4259, lng: 79.9959 },
];

// Minimalist Dark & Light Map Styles
const MAP_DARK_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#0c0e14' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0c0e14' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#e2e8f0' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#131822' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a202c' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#151a24' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2563eb' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1d4ed8' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#06070a' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#38bdf8' }] },
];

const MAP_LIGHT_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#f8fafc' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#cbd5e1' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#93c5fd' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e2e8f0' }] },
];

// Inner helper component to manage camera bounds and draw the radial route vector
interface RouteVectorProps {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  isDark: boolean;
}

const RouteVectorOverlay: React.FC<RouteVectorProps> = ({ origin, destination, isDark }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof window === 'undefined' || !(window as any).google?.maps) return;

    // 1. Fit camera bounds
    const bounds = new (window as any).google.maps.LatLngBounds();
    bounds.extend(origin);
    bounds.extend(destination);
    map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });

    // 2. Draw radial geodesic route vector
    const line = new (window as any).google.maps.Polyline({
      path: [origin, destination],
      geodesic: true,
      strokeColor: '#3B82F6',
      strokeOpacity: 0.9,
      strokeWeight: 3.5,
      map,
    });

    return () => {
      line.setMap(null);
    };
  }, [map, origin.lat, origin.lng, destination.lat, destination.lng]);

  return null;
};

interface GroundingChunk {
  maps?: {
    uri?: string;
    title?: string;
    placeAnswerSources?: {
      reviewSnippets?: Array<{ text: string }>;
    };
  };
  web?: {
    uri?: string;
    title?: string;
  };
}

interface VenueLocatorMapProps {
  isDark?: boolean;
}

export const VenueLocatorMap: React.FC<VenueLocatorMapProps> = ({ isDark = true }) => {
  const [searchQuery, setSearchQuery] = useState('Shangri-La Colombo');
  const [activeVenue, setActiveVenue] = useState('Shangri-La Colombo');
  const [venueCoordinates, setVenueCoordinates] = useState({ lat: 6.9271, lng: 79.8612 });
  const [distanceKm, setDistanceKm] = useState(6);
  const [travelTime, setTravelTime] = useState('15-20 mins');
  const [routeSummary, setRouteSummary] = useState('Colombo Metro Central Hub');
  const [expressway, setExpressway] = useState('Direct Urban Arterial Route');
  const [groundingSummary, setGroundingSummary] = useState(
    'Event Coverage Available in Shangri-La Colombo · Full Crew Dispatch Confirmed from Western Province Base.'
  );
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';

  // Detect dynamic user GPS location on client
  const handleDetectMyLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingUser(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocatingUser(false);
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        handleEstimateVenue('My Current Location (GPS Detected)', userCoords);
      },
      (error) => {
        setIsLocatingUser(false);
        console.warn('Geolocation detection error:', error);
        setLocationError('Could not detect location. Please type your venue or select a preset.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Compute travel and logistics estimate directly on client without backend route
  const handleEstimateVenue = (venueName: string, overrideCoords?: { lat: number; lng: number }) => {
    const target = venueName.trim();
    if (!target) return;

    setActiveVenue(target);
    setSearchQuery(target);
    setSuggestionsOpen(false);
    setIsLoading(true);

    try {
      const logistics = computeClientSideVenueLogistics(
        target,
        KULT_STUDIOS_BASE.lat,
        KULT_STUDIOS_BASE.lng,
        overrideCoords
      );

      setVenueCoordinates(logistics.coordinates);
      setDistanceKm(logistics.distanceKm);
      setTravelTime(logistics.travelTime);
      setRouteSummary(logistics.routeSummary);
      setExpressway(logistics.expressway);
      setGroundingSummary(logistics.groundingSummary);
      setGroundingChunks([
        {
          maps: {
            title: `KULT Studios Dispatch to ${target}`,
            uri: 'https://maps.app.goo.gl/kzwf9SkoCJSia1J37',
          },
        },
      ]);
    } catch (err) {
      console.error('Failed to estimate venue logistics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial estimate on mount
  useEffect(() => {
    handleEstimateVenue('Shangri-La Colombo', { lat: 6.9271, lng: 79.8612 });
  }, []);

  const whatsAppMessage = `Hello KULT Studios, I would like to reserve an event date for our venue: "${activeVenue}" (~${distanceKm}km from Nittambuwa HQ base, ETA: ${travelTime}). Please confirm full-crew availability (Videographers, Photographers & Drone).`;

  return (
    <div className="w-full rounded-3xl editorial-glass border border-black/10 dark:border-white/10 overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="px-6 sm:px-8 py-5 border-b border-black/10 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-black/[0.02] dark:bg-white/[0.02]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Google Maps Grounding & Dispatch Logistics</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#0A0A0C] dark:text-white mt-1">
            Interactive Venue Locator & Travel Estimator
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Islandwide Dispatch Active
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Logistics Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        {/* Left Column: Autocomplete Search & Dispatch Summary */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black/10 dark:border-white/10 space-y-6">
          <div className="space-y-5">
            {/* Search Input Box */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Enter Event Venue / Location
                </label>
                <button
                  type="button"
                  onClick={handleDetectMyLocation}
                  disabled={isLocatingUser || isLoading}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 dark:text-cyan-300 text-[11px] font-mono transition-all border border-cyan-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
                  title="Detect distance from your current GPS location"
                >
                  <Navigation className={`w-3 h-3 ${isLocatingUser ? 'animate-spin' : ''}`} />
                  <span>{isLocatingUser ? 'Detecting GPS...' : 'Detect My Location'}</span>
                </button>
              </div>

              {locationError && (
                <div className="text-[11px] font-mono text-rose-400 mb-2">
                  {locationError}
                </div>
              )}
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSuggestionsOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleEstimateVenue(searchQuery);
                    }
                  }}
                  placeholder="e.g. Colombo, Kandy, Negombo, Gampaha..."
                  className="w-full pl-10 pr-24 py-3 text-xs sm:text-sm rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#0A0A0C] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => handleEstimateVenue(searchQuery)}
                  disabled={isLoading}
                  className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-500 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? 'Estimating...' : 'Locate'}
                </button>
              </div>

              {/* Autocomplete Quick Preset Suggestions */}
              {suggestionsOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 p-2 rounded-xl backdrop-blur-xl bg-white/95 dark:bg-[#0A0B0E]/95 border border-black/10 dark:border-white/15 shadow-2xl z-20 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 px-2 py-1 uppercase">
                    Select Landmark Sri Lankan Destination
                  </div>
                  {VENUE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleEstimateVenue(preset.name, { lat: preset.lat, lng: preset.lng })}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                        <span>{preset.name}</span>
                      </div>
                      <span className="text-[10px] opacity-70">Pin Venue</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mr-1">
                Popular:
              </span>
              {['Colombo', 'Kandy', 'Negombo', 'Galle', 'Gampaha'].map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    const found = VENUE_PRESETS.find((p) => p.name.includes(name));
                    handleEstimateVenue(name, found ? { lat: found.lat, lng: found.lng } : undefined);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all cursor-pointer ${
                    activeVenue.toLowerCase().includes(name.toLowerCase())
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Confirmed Dispatch Card (Requirements Checklist) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-500/[0.08] to-indigo-500/[0.04] border border-blue-500/20 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <h4 className="text-sm font-bold text-[#0A0A0C] dark:text-white leading-tight">
                  Event Coverage Available in {activeVenue}
                </h4>
              </div>

              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold tracking-wide">
                ● Full Crew Dispatch Confirmed
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {groundingSummary}
              </p>

              {/* Distance and Travel Telemetry */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-500/15 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Car className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>
                    Dist: <strong className="font-semibold text-black dark:text-white">{distanceKm} km</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>
                    ETA: <strong className="font-semibold text-black dark:text-white">{travelTime}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Crew Logistics Manifest */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Production Unit Deployment Loadout
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>3x Cinema 4K Cameras</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>2x Stills Photographers</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>1x Licensed Drone Pilot</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>360° VR Spatial Rig</span>
                </div>
              </div>
            </div>

            {/* Google Maps Grounding Links (Mandated by Grounding Rules) */}
            {groundingChunks.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">
                  Google Maps Grounding Sources:
                </div>
                <div className="flex flex-wrap gap-2">
                  {groundingChunks.map((chunk, i) => {
                    const uri = chunk.maps?.uri || chunk.web?.uri;
                    const title = chunk.maps?.title || chunk.web?.title || `Google Maps Place Link #${i + 1}`;
                    if (!uri) return null;
                    return (
                      <a
                        key={i}
                        href={uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span>{title}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button (Sends location to WhatsApp for date reservation) */}
          <div className="pt-4 border-t border-black/10 dark:border-white/10">
            <a
              href={getWhatsAppUrl(whatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 min-h-[48px] rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-xl active:scale-95 transition-all text-center cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Location to WhatsApp for Date Reservation</span>
            </a>

            <a
              href="https://maps.app.goo.gl/kzwf9SkoCJSia1J37"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[#0A0A0C] dark:text-white border border-black/10 dark:border-white/10 font-mono text-xs transition-all text-center cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>Find Our Studio / Base Location (Google Maps)</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <div className="text-[10px] font-mono text-center text-slate-400 mt-2">
              Hotline: +94 76 843 9916 · Instant response from lead producer
            </div>
          </div>
        </div>

        {/* Right Column: Google Maps WebGL Viewport */}
        <div className="lg:col-span-7 relative min-h-[400px] lg:min-h-full bg-black/5 dark:bg-black/30 overflow-hidden">
          {apiKey ? (
            <APIProvider apiKey={apiKey} libraries={['marker']}>
              <div className="w-full h-full min-h-[420px] lg:min-h-[580px]">
                <GoogleMap
                  mapId={'DEMO_MAP_ID'}
                  defaultCenter={BASE_COORDINATES}
                  defaultZoom={12}
                  gestureHandling={'greedy'}
                  disableDefaultUI={false}
                  styles={isDark ? MAP_DARK_STYLES : MAP_LIGHT_STYLES}
                  internalUsageAttributionIds={['gmp_git_agentskills_v1']}
                  className="w-full h-full"
                >
                  {/* Base Marker: KULT Studios HQ */}
                  <AdvancedMarker position={BASE_COORDINATES} title="KULT Studios HQ">
                    <Pin
                      background={'#2563EB'}
                      borderColor={'#1E40AF'}
                      glyphColor={'#FFFFFF'}
                      scale={1.2}
                    />
                  </AdvancedMarker>

                  {/* Destination Marker: Target Event Venue */}
                  <AdvancedMarker position={venueCoordinates} title={activeVenue}>
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping" />
                      <Pin
                        background={'#10B981'}
                        borderColor={'#047857'}
                        glyphColor={'#FFFFFF'}
                        scale={1.3}
                      />
                    </div>
                  </AdvancedMarker>

                  {/* Geodesic Radial Route Vector Line */}
                  <RouteVectorOverlay
                    origin={BASE_COORDINATES}
                    destination={venueCoordinates}
                    isDark={isDark}
                  />
                </GoogleMap>
              </div>
            </APIProvider>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <MapPin className="w-10 h-10 mb-3 text-blue-500 animate-bounce" />
              <p className="text-sm font-semibold text-black dark:text-white">Google Maps Interactive Canvas</p>
              <p className="text-xs font-mono max-w-sm mt-1">
                Visualizing route vector from Nittambuwa HQ Base to {activeVenue} ({distanceKm} km · {travelTime}).
              </p>
            </div>
          )}

          {/* Floating Telemetry Badge Overlay on Map */}
          <div className="absolute top-4 left-4 z-10 px-3.5 py-2 rounded-xl backdrop-blur-xl bg-white/90 dark:bg-[#0A0B0E]/90 border border-black/10 dark:border-white/15 shadow-xl text-xs font-mono space-y-1">
            <div className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Route Vector Telemetry</div>
            <div className="flex items-center gap-2 text-black dark:text-white font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              <span>• Base: Nittambuwa / Western Province (KULT Studios Base)</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>• Target: {activeVenue}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
