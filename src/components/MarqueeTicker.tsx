import React from 'react';

export const MarqueeTicker: React.FC = () => {
  const items = [
    'CINEMATIC EVENT PRODUCTION',
    '360° SPATIAL VR',
    'VIRAL RETENTION EDITING',
    'MULTI-CAM DISPATCH',
    'BESPOKE OPTICS',
  ];

  return (
    <div className="relative w-full overflow-hidden py-4 border-y border-white/10 bg-black/40 backdrop-blur-xl select-none">
      {/* Luminous Edge Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#060709] via-[#060709]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#060709] via-[#060709]/80 to-transparent z-10 pointer-events-none" />

      {/* Endless Horizontal Drifting Tape */}
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {/* Repeating list to loop seamlessly */}
        {[...items, ...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-8 font-mono text-xs sm:text-sm tracking-[0.25em] uppercase font-semibold">
            <span className="text-white hover:text-cyan-400 transition-colors drop-shadow-[0_0_12px_rgba(0,242,254,0.35)]">
              {text}
            </span>
            <span className="text-cyan-400 opacity-90 drop-shadow-[0_0_8px_rgba(0,242,254,0.6)]" aria-hidden="true">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};
