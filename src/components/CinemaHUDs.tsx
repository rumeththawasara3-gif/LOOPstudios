import React, { useState, useEffect } from 'react';

// =========================================================================
// 1. AERIAL & DRONE FLIGHT RADAR HUD
// Flight telemetry: Altitude, 4K 60FPS, active radar sweep, coordinate grid
// =========================================================================
export const DroneRadarHUD: React.FC<{ scrollRotation?: number }> = ({ scrollRotation = 0 }) => {
  return (
    <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden bg-[#06080D]/90 border border-cyan-500/20 shadow-[0_0_30px_rgba(0,242,254,0.12)] p-3 sm:p-4 select-none font-mono">
      {/* Background Radar Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,242,254,0.3) 1px, transparent 1px), linear-gradient(to right, rgba(0,242,254,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,242,254,0.08) 1px, transparent 1px)`,
          backgroundSize: '24px 24px, 48px 48px, 48px 48px',
        }}
      />

      {/* Top Telemetry Header */}
      <div className="relative z-10 flex items-center justify-between text-[10px] sm:text-xs text-cyan-400 border-b border-cyan-500/20 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold tracking-wider">AERIAL RECON // DRONE UNIT 01</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span className="text-emerald-400">● GPS LOCK [18 SATS]</span>
          <span>BAT 94%</span>
        </div>
      </div>

      {/* Center Radar Sweep & Target Reticle */}
      <div className="relative h-[calc(100%-48px)] flex items-center justify-center">
        {/* Rotating Compass Outer Ring with GSAP Scrub reaction */}
        <div
          className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-dashed border-cyan-400/30 transition-transform duration-200"
          style={{ transform: `rotate(${scrollRotation * 1.5}deg)` }}
        >
          {/* Compass cardinal points */}
          <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] text-cyan-300 font-bold">N 000°</span>
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-slate-500">S 180°</span>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-slate-500">E 090°</span>
          <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] text-slate-500">W 270°</span>
        </div>

        {/* Inner Radar Range Ring */}
        <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-cyan-500/20" />

        {/* Animated Radar Scanning Line */}
        <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full pointer-events-none animate-radar">
          <div className="w-1/2 h-full border-r border-cyan-400/80 bg-gradient-to-l from-cyan-400/20 to-transparent" />
        </div>

        {/* Target Reticle Crosshair */}
        <div className="relative z-10 w-12 h-12 flex items-center justify-center">
          <div className="absolute w-full h-[1px] bg-cyan-400/60" />
          <div className="absolute h-full w-[1px] bg-cyan-400/60" />
          <div className="w-4 h-4 border border-cyan-400 rounded-sm" />
          <span className="absolute -bottom-5 text-[9px] text-cyan-300 tracking-wider">TARGET LOCK</span>
        </div>

        {/* Left Side Altitude Ladder */}
        <div className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 flex flex-col items-start gap-1 text-[9px] sm:text-[10px] text-cyan-400/80">
          <span className="text-[8px] text-slate-500 uppercase">Elevation</span>
          <div className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 font-bold">
            ALT: 120M
          </div>
          <span className="text-slate-400 text-[9px]">V/S: +2.4 m/s</span>
          <span className="text-slate-400 text-[9px]">WIND: 4 KTS</span>
        </div>

        {/* Right Side Sensor Telemetry */}
        <div className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 flex flex-col items-end gap-1 text-[9px] sm:text-[10px] text-cyan-400/80">
          <span className="text-[8px] text-slate-500 uppercase">Optical Rig</span>
          <div className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 font-bold text-white">
            4K 60FPS
          </div>
          <span className="text-emerald-400 text-[9px]">GYRO: ACTIVE</span>
          <span className="text-slate-400 text-[9px]">TILT: -18.4°</span>
        </div>
      </div>

      {/* Bottom Coordinates Status Bar */}
      <div className="relative z-10 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 border-t border-cyan-500/20 pt-1.5">
        <span>LAT: 06°54'25"N // LON: 79°51'59"E</span>
        <span className="text-cyan-400 font-semibold tracking-wider">SIGMA 24MM CINE MASTER</span>
      </div>
    </div>
  );
};

// =========================================================================
// 2. ARRI/RED CINEMA CAMERA VIEWFINDER HUD
// 2.39:1 anamorphic crop, bouncing audio VU bars, pulsing REC badge, timecode
// =========================================================================
export const CinemaCameraHUD: React.FC = () => {
  const [timecode, setTimecode] = useState('00:14:22:18');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const frames = String(Math.floor((now.getMilliseconds() / 1000) * 24)).padStart(2, '0');
      setTimecode(`${h}:${m}:${s}:${frames}`);
    }, 42); // 24 FPS ticker update
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden bg-[#06070B]/95 border border-purple-500/20 shadow-[0_0_30px_rgba(127,0,255,0.15)] p-3 sm:p-4 select-none font-mono">
      {/* 2.39:1 Anamorphic Scope Crop Marks */}
      <div className="absolute inset-x-0 top-3 bottom-3 border-y border-dashed border-white/15 pointer-events-none" />

      {/* Viewfinder Corner Framing Ticks (⌜ ⌝ ⌞ ⌟) */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

      {/* Top Status Bar: REC badge, Timecode, Format */}
      <div className="relative z-10 flex items-center justify-between text-[10px] sm:text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-500 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-rec-blink" />
            <span>REC ●</span>
          </div>
          <span className="text-white font-bold tracking-wider">{timecode}</span>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-slate-300">
          <span className="text-cyan-400 font-semibold">PRORES 4444 XQ</span>
          <span>24.000 FPS</span>
        </div>
      </div>

      {/* Center Focus Target & Reticle */}
      <div className="relative h-[calc(100%-48px)] flex items-center justify-center">
        {/* Subtle center crosshair */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute w-8 h-[1px] bg-white/40" />
          <div className="absolute h-8 w-[1px] bg-white/40" />
          <div className="w-10 h-10 border border-dashed border-white/30 rounded-full" />
        </div>

        {/* Live Audio Decibel Level VU Meter (Jumping in real-time) */}
        <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex items-end gap-1.5 h-16 p-2 rounded-lg bg-black/40 border border-white/10">
          <div className="flex flex-col justify-between text-[8px] text-slate-500 h-full font-mono mr-1">
            <span>0dB</span>
            <span>-12</span>
            <span>-24</span>
          </div>
          <div className="w-1.5 bg-slate-800 h-full rounded-sm overflow-hidden flex flex-col justify-end">
            <div className="w-full bg-gradient-to-t from-emerald-500 via-yellow-400 to-red-500 animate-vu-1 rounded-sm" />
          </div>
          <div className="w-1.5 bg-slate-800 h-full rounded-sm overflow-hidden flex flex-col justify-end">
            <div className="w-full bg-gradient-to-t from-emerald-500 via-yellow-400 to-red-500 animate-vu-2 rounded-sm" />
          </div>
          <span className="text-[9px] text-cyan-400 ml-1">L R</span>
        </div>

        {/* Exposure & False Color Indicator on Left */}
        <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 text-[9px] sm:text-[10px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">EI:</span>
            <span className="text-cyan-400 font-bold">800</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">WB:</span>
            <span className="text-white font-bold">5600K</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">SHUTTER:</span>
            <span className="text-white font-bold">180.0°</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">LUT:</span>
            <span className="text-purple-400 font-bold">A24_FILM_V2</span>
          </div>
        </div>
      </div>

      {/* Bottom Lens Metadata Bar */}
      <div className="relative z-10 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 border-t border-purple-500/20 pt-1.5">
        <span>T1.5 ANAMORPHIC // 35MM PRIME</span>
        <span className="text-purple-400 font-semibold tracking-wider">3-AXIS GIMBAL STABILIZED</span>
      </div>
    </div>
  );
};

// =========================================================================
// 3. 360° VR SPATIAL WIREFRAME GYRO-SPHERE HUD
// Rotating geometric 3D wireframe gyro-sphere with holographic coordinates
// =========================================================================
export const SpatialGyroHUD: React.FC = () => {
  return (
    <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden bg-[#070712]/95 border border-purple-500/25 shadow-[0_0_35px_rgba(225,0,255,0.14)] p-3 sm:p-4 select-none font-mono">
      {/* Subtle Starfield Coordinate Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(225,0,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between text-[10px] sm:text-xs text-purple-400 border-b border-purple-500/20 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="font-bold tracking-wider">SPATIAL FIELD: 360° EXPANDED</span>
        </div>
        <div className="text-[10px] text-cyan-400">
          <span>● STEREOSCOPIC VR READY</span>
        </div>
      </div>

      {/* Center 3D Gyro-Sphere Visualization */}
      <div className="relative h-[calc(100%-48px)] flex items-center justify-center">
        {/* Holographic Gyro Sphere in CSS 3D Transforms */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center animate-gyro">
          {/* Equator Ring */}
          <div className="absolute inset-0 rounded-full border border-cyan-400/70 shadow-[0_0_15px_rgba(0,242,254,0.3)]" />

          {/* Latitude Ellipse 1 */}
          <div
            className="absolute inset-x-0 top-3 bottom-3 rounded-full border border-purple-400/60"
            style={{ transform: 'rotateX(45deg)' }}
          />

          {/* Latitude Ellipse 2 */}
          <div
            className="absolute inset-x-0 top-3 bottom-3 rounded-full border border-purple-400/60"
            style={{ transform: 'rotateX(-45deg)' }}
          />

          {/* Longitude Ellipse 1 */}
          <div
            className="absolute inset-y-0 left-3 right-3 rounded-full border border-pink-500/60"
            style={{ transform: 'rotateY(60deg)' }}
          />

          {/* Longitude Ellipse 2 */}
          <div
            className="absolute inset-y-0 left-3 right-3 rounded-full border border-pink-500/60"
            style={{ transform: 'rotateY(-60deg)' }}
          />

          {/* Center Pulsing Sphere Core */}
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 blur-[2px] animate-ping" />
        </div>

        {/* Orbiting Axis Marks */}
        <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 space-y-1 text-[9px] sm:text-[10px] text-slate-400">
          <div>YAW: <strong className="text-cyan-400">360.0°</strong></div>
          <div>PITCH: <strong className="text-purple-400">0.0°</strong></div>
          <div>ROLL: <strong className="text-pink-400">LEVEL</strong></div>
        </div>

        <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-right space-y-1 text-[9px] sm:text-[10px] text-slate-400">
          <div>RESOLUTION: <strong className="text-white">8K 3D</strong></div>
          <div>PROJECTION: <strong className="text-cyan-400">EQUIRECT</strong></div>
          <div>FPS: <strong className="text-emerald-400">60 FPS</strong></div>
        </div>
      </div>

      {/* Bottom VR Status Bar */}
      <div className="relative z-10 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 border-t border-purple-500/20 pt-1.5">
        <span>GYROSCOPIC PANORAMA // 6-DOF TRACKING</span>
        <span className="text-cyan-300 font-semibold tracking-wider">APPLE VISION PRO · META QUEST 3</span>
      </div>
    </div>
  );
};

// =========================================================================
// 4. VIRAL SHORT-FORM RETENTION STUDIO HUD
// Animated scrubbing timeline wave, retention peak spikes (+84% HOOK), 9:16 frame
// =========================================================================
export const RetentionWaveformHUD: React.FC = () => {
  return (
    <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden bg-[#06090E]/95 border border-cyan-500/20 shadow-[0_0_30px_rgba(0,242,254,0.12)] p-3 sm:p-4 select-none font-mono">
      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between text-[10px] sm:text-xs text-cyan-400 border-b border-cyan-500/20 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold tracking-wider">RETENTION CURVE // VIRAL ENGINE</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
          <span>+84.6% HOOK RETENTION</span>
        </div>
      </div>

      {/* Center Timeline Wave & Spikes */}
      <div className="relative h-[calc(100%-48px)] flex flex-col justify-center px-2 sm:px-4">
        {/* Retention Curve Graph (SVG with gradient stroke) */}
        <div className="relative w-full h-24 sm:h-28">
          <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible" fill="none">
            <defs>
              <linearGradient id="retentionGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00F2FE" />
                <stop offset="35%" stopColor="#4FACFE" />
                <stop offset="70%" stopColor="#7F00FF" />
                <stop offset="100%" stopColor="#E100FF" />
              </linearGradient>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#00F2FE" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Filled retention area under curve */}
            <path
              d="M 0 40 Q 50 15, 100 25 T 200 45 T 300 20 T 400 35 L 400 120 L 0 120 Z"
              fill="url(#areaGrad)"
            />

            {/* Main high-velocity retention curve */}
            <path
              d="M 0 40 Q 50 15, 100 25 T 200 45 T 300 20 T 400 35"
              stroke="url(#retentionGrad)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Hook Peak Callout at 0.5s */}
            <g transform="translate(65, 18)">
              <circle r="4" fill="#00F2FE" className="animate-ping" />
              <circle r="3" fill="#FFFFFF" />
              <line x1="0" y1="0" x2="0" y2="28" stroke="#00F2FE" strokeWidth="1" strokeDasharray="2 2" />
            </g>

            {/* Secondary Peak Callout at 2.4s */}
            <g transform="translate(290, 20)">
              <circle r="3" fill="#E100FF" />
              <line x1="0" y1="0" x2="0" y2="35" stroke="#E100FF" strokeWidth="1" strokeDasharray="2 2" />
            </g>
          </svg>

          {/* Floating Hook Telemetry Badge */}
          <div className="absolute top-0 left-12 px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-[9px] text-cyan-300 font-bold shadow-lg">
            SUB-SECOND HOOK DROP: 0.2%
          </div>

          <div className="absolute top-1 right-12 px-2 py-0.5 rounded bg-purple-500/20 border border-purple-400/40 text-[9px] text-purple-300 font-bold shadow-lg">
            CTO CONVERSION SPIKE
          </div>
        </div>

        {/* Dynamic Multi-Channel Audio Waveform Bars */}
        <div className="flex items-center gap-1 mt-2 h-4">
          <span className="text-[8px] text-slate-500 uppercase mr-1">Sound FX:</span>
          {[
            'animate-vu-1',
            'animate-vu-2',
            'animate-vu-3',
            'animate-vu-4',
            'animate-vu-1',
            'animate-vu-3',
            'animate-vu-2',
            'animate-vu-4',
            'animate-vu-2',
            'animate-vu-1',
            'animate-vu-3',
            'animate-vu-4',
          ].map((anim, i) => (
            <div key={i} className="flex-1 bg-slate-800 h-full rounded-full overflow-hidden flex flex-col justify-end">
              <div className={`w-full bg-gradient-to-t from-cyan-400 to-indigo-500 ${anim}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="relative z-10 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 border-t border-cyan-500/20 pt-1.5">
        <span>PACING: 0.8S CUT CADENCE // DYNAMIC CAPTIONS</span>
        <span className="text-cyan-300 font-semibold tracking-wider">ALGORITHMIC FEED OPTIMIZED</span>
      </div>
    </div>
  );
};
