import React from 'react';

interface AmbientAuraAndGrainProps {
  isDark?: boolean;
}

export const AmbientAuraAndGrain: React.FC<AmbientAuraAndGrainProps> = ({ isDark = true }) => {
  return (
    <>
      {/* =========================================================================
          1. ANIMATED AMBIENT AURA BACKDROPS (LUMINESCENT DRIFTING ORBS)
          Physical luminosity and cinematic depth without layout disruption
      ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-Right Luminous Electric Cyan / Cobalt Orb */}
        <div
          className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[140px] will-change-transform animate-aura-1 transition-opacity duration-700 ${
            isDark ? 'bg-gradient-to-br from-[#00F2FE]/25 via-[#4FACFE]/20 to-transparent opacity-80' : 'bg-gradient-to-br from-[#0284C7]/15 to-transparent opacity-40'
          }`}
          aria-hidden="true"
        />

        {/* Mid-Left Neon Violet / Magenta Cinema Flare Orb */}
        <div
          className={`absolute top-[40%] -left-48 w-[650px] h-[650px] rounded-full blur-[160px] will-change-transform animate-aura-2 transition-opacity duration-700 ${
            isDark ? 'bg-gradient-to-tr from-[#7F00FF]/25 via-[#E100FF]/15 to-transparent opacity-70' : 'bg-gradient-to-tr from-[#8B5CF6]/10 to-transparent opacity-30'
          }`}
          aria-hidden="true"
        />

        {/* Bottom-Center Deep Cobalt / Cyan Resonance Orb */}
        <div
          className={`absolute -bottom-40 left-[25%] w-[700px] h-[700px] rounded-full blur-[150px] will-change-transform animate-aura-3 transition-opacity duration-700 ${
            isDark ? 'bg-gradient-to-t from-[#4FACFE]/20 via-[#00F2FE]/10 to-transparent opacity-75' : 'bg-gradient-to-t from-[#38BDF8]/12 to-transparent opacity-35'
          }`}
          aria-hidden="true"
        />
      </div>

      {/* =========================================================================
          2. 35MM FILM EMULSION GRAIN OVERLAY (TACTILE CINEMA TEXTURE)
          Ultra-fine grain texture using procedural SVG turbulence
      ========================================================================= */}
      <div
        className="fixed inset-0 pointer-events-none z-40 opacity-[0.035] mix-blend-overlay"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
};
