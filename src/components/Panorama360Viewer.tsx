import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCw, Compass, ZoomIn, ZoomOut, ArrowRight, Eye } from 'lucide-react';
import { getWhatsAppUrl } from '../types.ts';

interface Hotspot {
  id: string;
  name: string;
  angle: number; // in degrees 0-360
  pitch: number; // vertical -30 to 30
  description: string;
  badge: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'stage',
    name: 'Main Stage & Keynote Space',
    angle: 45,
    pitch: 0,
    description: 'Dynamic focal position capturing main presentations, keynote speakers, and audience reaction in one continuous 360° canvas.',
    badge: 'Stage Coverage',
  },
  {
    id: 'vip',
    name: 'Executive & Private Lounge',
    angle: 155,
    pitch: 5,
    description: 'Ambient spatial lighting and intimate networking coverage for distinguished corporate gatherings and VIPs.',
    badge: 'Ambient Lounge',
  },
  {
    id: 'deck',
    name: 'Optical & Sound Control Deck',
    angle: 265,
    pitch: -5,
    description: 'Master multi-angle synchronization point ensuring frame-accurate audio and visual calibration.',
    badge: 'Master Sync',
  },
  {
    id: 'atrium',
    name: 'Grand Architectural Atrium',
    angle: 335,
    pitch: -2,
    description: 'Full-height spatial sweep documenting guest arrival momentum and grand venue architecture.',
    badge: 'Spatial Sweep',
  },
];

export const Panorama360Viewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [yaw, setYaw] = useState<number>(35);
  const [pitch, setPitch] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const drawPanorama = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Pure obsidian luxury background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#050507');
    bgGrad.addColorStop(0.5, '#0B0C10');
    bgGrad.addColorStop(1, '#050507');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const horizon = h / 2 + pitch * 3.2;

    // Floor architectural grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      const startX = w / 2 + i * 90;
      ctx.beginPath();
      ctx.moveTo(startX, horizon);
      ctx.lineTo((startX - w / 2) * 3 + w / 2, h);
      ctx.stroke();
    }

    // Ceiling trusses
    for (let i = -8; i <= 8; i++) {
      const startX = w / 2 + i * 110;
      ctx.beginPath();
      ctx.moveTo(startX, horizon);
      ctx.lineTo((startX - w / 2) * 2.6 + w / 2, 0);
      ctx.stroke();
    }

    // Venue landmarks across 360 space
    const renderVenueAnchor = (
      angleOffset: number,
      title: string,
      structures: { xOffset: number; height: number; width: number }[]
    ) => {
      let diff = (angleOffset - yaw) % 360;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      const screenX = w / 2 + (diff / 90) * (w / 2) * zoom;

      if (screenX > -250 && screenX < w + 250) {
        // Soft white ambient light cone
        const glow = ctx.createRadialGradient(
          screenX,
          horizon - 40,
          10,
          screenX,
          horizon - 40,
          200 * zoom
        );
        glow.addColorStop(0, 'rgba(255, 255, 255, 0.07)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(screenX - 250, 0, 500, h);

        structures.forEach((s) => {
          const sx = screenX + s.xOffset * zoom;
          const sy = horizon - s.height * zoom;
          const sw = s.width * zoom;
          const sh = s.height * zoom;

          ctx.fillStyle = 'rgba(20, 22, 28, 0.9)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(sx - sw / 2, sy, sw, sh, [2, 2, 0, 0]);
          ctx.fill();
          ctx.stroke();
        });

        ctx.font = '500 11px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.textAlign = 'center';
        ctx.fillText(title, screenX, horizon - 150 * zoom);
      }
    };

    renderVenueAnchor(45, 'ZONE 01 · KEYNOTE STAGE', [
      { xOffset: -50, height: 100, width: 60 },
      { xOffset: 0, height: 130, width: 110 },
      { xOffset: 50, height: 100, width: 60 },
    ]);

    renderVenueAnchor(155, 'ZONE 02 · EXECUTIVE MEZZANINE', [
      { xOffset: -70, height: 75, width: 120 },
      { xOffset: 60, height: 90, width: 80 },
    ]);

    renderVenueAnchor(265, 'ZONE 03 · OPTICAL & SOUND CONTROL', [
      { xOffset: -30, height: 55, width: 70 },
      { xOffset: 30, height: 65, width: 70 },
    ]);

    renderVenueAnchor(335, 'ZONE 04 · GRAND ATRIUM', [
      { xOffset: 0, height: 110, width: 140 },
    ]);

    // Hotspots rendering
    HOTSPOTS.forEach((spot) => {
      let diff = (spot.angle - yaw) % 360;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      const spotX = w / 2 + (diff / 90) * (w / 2) * zoom;
      const spotY = horizon + spot.pitch * 3.2 - 25;

      if (spotX > 30 && spotX < w - 30) {
        const time = Date.now() / 800;
        const pulse = (Math.sin(time) + 1) / 2;

        ctx.beginPath();
        ctx.arc(spotX, spotY, 12 + pulse * 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(spotX, spotY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(spot.name, spotX, spotY - 14);
      }
    });

    // Outer subtle cinematic vignette
    const vigGrad = ctx.createRadialGradient(w / 2, h / 2, h * 0.45, w / 2, h / 2, w * 0.75);
    vigGrad.addColorStop(0, 'transparent');
    vigGrad.addColorStop(1, 'rgba(7, 7, 9, 0.9)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, w, h);

    // Minimalist crosshair reticle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 20, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w / 2 - 24, h / 2);
    ctx.lineTo(w / 2 - 8, h / 2);
    ctx.moveTo(w / 2 + 8, h / 2);
    ctx.lineTo(w / 2 + 24, h / 2);
    ctx.moveTo(w / 2, h / 2 - 24);
    ctx.lineTo(w / 2, h / 2 - 8);
    ctx.moveTo(w / 2, h / 2 + 8);
    ctx.lineTo(w / 2, h / 2 + 24);
    ctx.stroke();
  }, [yaw, pitch, zoom]);

  useEffect(() => {
    let animId: number;
    const loop = () => {
      if (autoRotate && !isDragging) {
        setYaw((prev) => (prev + 0.1) % 360);
      }
      drawPanorama();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [autoRotate, isDragging, drawPanorama]);

  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      canvasRef.current.width = containerRef.current.clientWidth;
      canvasRef.current.height = containerRef.current.clientHeight;
      drawPanorama();
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawPanorama]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setYaw((prev) => (prev - dx * 0.35 + 360) % 360);
    setPitch((prev) => Math.max(-25, Math.min(25, prev - dy * 0.25)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    setYaw((prev) => (prev - dx * 0.45 + 360) % 360);
    setPitch((prev) => Math.max(-25, Math.min(25, prev - dy * 0.35)));
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => setIsDragging(false);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const w = canvas.width;
    const h = canvas.height;
    const horizon = h / 2 + pitch * 3.2;

    let found: Hotspot | null = null;
    HOTSPOTS.forEach((spot) => {
      let diff = (spot.angle - yaw) % 360;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      const spotX = w / 2 + (diff / 90) * (w / 2) * zoom;
      const spotY = horizon + spot.pitch * 3.2 - 25;
      const dist = Math.sqrt((clickX - spotX) ** 2 + (clickY - spotY) ** 2);
      if (dist < 26) found = spot;
    });

    if (found) {
      setActiveHotspot(found);
      setAutoRotate(false);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#070709] shadow-2xl">
      {/* Minimalist Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-[#090A0E]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/5 border border-white/10 text-white">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-white">
              360° Spherical Event Capture Simulator
            </div>
            <div className="text-[11px] text-slate-400">
              Interactive panoramic navigation · Drag to rotate space
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-full border transition-all ${
              autoRotate
                ? 'bg-white text-black border-white'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>{autoRotate ? 'Orbit: Auto' : 'Orbit: Paused'}</span>
          </button>

          <button
            onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))}
            className="p-1.5 rounded-full bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}
            className="p-1.5 rounded-full bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Panoramic Viewport Canvas */}
      <div
        ref={containerRef}
        className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas ref={canvasRef} onClick={handleCanvasClick} className="w-full h-full block" />

        <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-3 text-[11px] font-mono text-slate-400 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <span>YAW: {Math.round(yaw)}°</span>
          <span>·</span>
          <span>PITCH: {Math.round(pitch)}°</span>
          <span>·</span>
          <span>ZOOM: {zoom.toFixed(1)}x</span>
        </div>

        {!isDragging && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-2 text-xs text-slate-300 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            <Eye className="w-3.5 h-3.5 text-white" />
            <span>Click & drag to explore · Select nodes for optics detail</span>
          </div>
        )}

        {/* Hotspot detail modal */}
        {activeHotspot && (
          <div className="absolute bottom-6 right-6 max-w-sm w-full bg-[#0B0C10]/95 border border-white/20 rounded-xl p-5 shadow-2xl backdrop-blur-xl animate-in fade-in duration-200">
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white">
                {activeHotspot.badge}
              </span>
              <button
                onClick={() => setActiveHotspot(null)}
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            </div>
            <h4 className="text-base font-semibold text-white mb-1">{activeHotspot.name}</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">{activeHotspot.description}</p>
            <a
              href={getWhatsAppUrl(`Hi Loop Studios, I'd like to book 360° VR Spatial Capture for: ${activeHotspot.name}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white text-black hover:bg-slate-200 transition-colors"
            >
              <span>Inquire for 360° Booking</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* Teaser Footer Bar */}
      <div className="p-6 bg-[#070709] border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
            Step Inside the Venue from Any Device or VR Headset.
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Record complete spherical video permitting clients, attendees, and sponsors to relive your event in interactive 360° via mobile pan, touch, or VR box.
          </p>
        </div>

        <a
          href={getWhatsAppUrl(`Hi Loop Studios, I'd like to add 360° Immersive Event Capture to our upcoming event.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-full bg-white text-black hover:bg-slate-200 transition-all active:scale-95 whitespace-nowrap"
        >
          <span>Add 360° VR to Your Event</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
