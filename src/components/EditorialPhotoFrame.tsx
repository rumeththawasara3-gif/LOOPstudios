import React, { useState } from 'react';
import { Eye, Layers } from 'lucide-react';

interface EditorialPhotoFrameProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  badge: string;
  aspectRatio?: 'cinema' | 'vertical';
  className?: string;
  gearCutoutSrc?: string;
  gearName?: string;
}

export const EditorialPhotoFrame: React.FC<EditorialPhotoFrameProps> = ({
  src,
  fallbackSrc,
  alt,
  badge,
  aspectRatio = 'cinema',
  className = '',
  gearCutoutSrc,
  gearName,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showGear, setShowGear] = useState(false);

  // Use primary src unless it fails, then switch to fallback
  const currentSrc = hasError && fallbackSrc ? fallbackSrc : src;

  return (
    <div
      className={`relative rounded-2xl md:rounded-3xl border border-white/10 dark:border-white/10 overflow-hidden group bg-neutral-900/80 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 ${
        aspectRatio === 'vertical'
          ? 'aspect-[4/5]'
          : 'aspect-[4/5] md:aspect-[16/10]'
      } ${className}`}
    >
      {/* -----------------------------------------------------------------
          MODE A: EDITORIAL PHOTO VIEW
      ------------------------------------------------------------------ */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          showGear ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Loading Shimmer State */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-neutral-900/80 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
          </div>
        )}

        {/* Main Showcase Image */}
        <img
          src={currentSrc}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            if (!hasError && fallbackSrc) {
              setHasError(true);
            } else {
              setIsLoaded(true);
            }
          }}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Subtle Dark Vignette at the Bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

        {/* Floating Gear Micro-Preview Pill (Bottom Left) */}
        {gearCutoutSrc && (
          <div className="absolute bottom-3.5 left-3.5 sm:bottom-4 sm:left-4 z-10 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
            <img
              src={gearCutoutSrc}
              alt=""
              className="w-4 h-4 object-contain filter drop-shadow"
            />
            <span className="hidden sm:inline text-cyan-300 font-semibold">{gearName || 'Studio Rig'}</span>
          </div>
        )}
      </div>

      {/* -----------------------------------------------------------------
          MODE B: STUDIO HARDWARE CUTOUT VIEW (Radial Spotlight Pedestal)
      ------------------------------------------------------------------ */}
      {gearCutoutSrc && (
        <div
          className={`absolute inset-0 bg-[#060709] flex flex-col items-center justify-center p-6 transition-all duration-500 overflow-hidden ${
            showGear ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Luminous Center Spotlight */}
          <div className="absolute w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-purple-500/20 blur-[65px] pointer-events-none" />

          {/* Concentric Subtle Rings */}
          <div className="absolute w-48 sm:w-64 h-48 sm:h-64 rounded-full border border-cyan-500/10 pointer-events-none" />
          <div className="absolute w-64 sm:w-80 h-64 sm:h-80 rounded-full border border-purple-500/5 pointer-events-none" />

          {/* Radial Pedestal Shadow Base */}
          <div className="absolute bottom-6 sm:bottom-8 w-44 sm:w-56 h-6 bg-cyan-400/15 rounded-[100%] blur-md pointer-events-none" />

          {/* Floating Transparent Studio Hardware Cutout */}
          <div className="relative z-10 w-full h-[72%] flex items-center justify-center">
            <img
              src={gearCutoutSrc}
              alt={gearName || badge}
              className="max-h-full max-w-[85%] object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] animate-gear-float transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Hardware Specs Eyebrow */}
          <div className="relative z-10 mt-2 flex flex-col items-center gap-1 text-center">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-cyan-400 font-semibold">
              Official Production Gear
            </span>
            <span className="text-xs sm:text-sm font-display font-bold text-white tracking-wide">
              {gearName || badge}
            </span>
          </div>
        </div>
      )}

      {/* Floating Corner Badge (Top Left) */}
      <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-20 font-mono text-[10px] sm:text-[11px] tracking-widest uppercase bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-neutral-300 border border-white/10 flex items-center gap-1.5 shadow-lg select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>{showGear ? 'HARDWARE RIG' : badge}</span>
      </div>

      {/* Floating Toggle: View Scene vs View Studio Rig (Top Right or Bottom Right) */}
      {gearCutoutSrc && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowGear(!showGear);
          }}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 font-mono text-[10px] tracking-wider uppercase bg-black/75 hover:bg-black/95 backdrop-blur-md px-3 py-1.5 rounded-full text-white border border-white/20 hover:border-cyan-400/70 flex items-center gap-1.5 shadow-xl transition-all cursor-pointer active:scale-95 group/btn"
          title={showGear ? 'Switch to scene photograph' : 'Inspect studio hardware rig'}
        >
          {showGear ? (
            <>
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scene</span>
            </>
          ) : (
            <>
              <Layers className="w-3.5 h-3.5 text-cyan-400 group-hover/btn:rotate-12 transition-transform" />
              <span>Rig</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

