import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Check,
  Plus,
  Minus,
  Sparkles,
  ArrowUpRight,
  Video,
  Film,
  Zap,
  Camera,
  Glasses,
} from 'lucide-react';
import { WHATSAPP_NUMBER } from '../types.ts';
import { AnimatedCounter } from './AnimatedCounter.tsx';

interface PackageItem {
  id: string;
  name: string;
  tier: string;
  priceLKR: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isBespoke?: boolean;
}

const PRICING_ITEMS: PackageItem[] = [
  {
    id: 'raw-cut',
    tier: 'Level 01',
    name: 'Raw Cut',
    priceLKR: 1000,
    description: 'Clean jump cuts & audio sync up to 60s runtime.',
    icon: Video,
  },
  {
    id: 'social-edit',
    tier: 'Level 02',
    name: 'Social Edit',
    priceLKR: 3000,
    description: 'Dynamic retention pacing, kinetic captions & SFX.',
    icon: Film,
  },
  {
    id: 'viral-polish',
    tier: 'Level 03',
    name: 'Viral Polish',
    priceLKR: 5000,
    description: 'Sub-second hooks, motion graphics, and master color grade.',
    icon: Zap,
  },
  {
    id: 'full-crew',
    tier: 'On-Site',
    name: 'Full-Crew Event Capture',
    priceLKR: 0,
    description: 'Videographers, portrait photographers & 4K drone operators.',
    icon: Camera,
    isBespoke: true,
  },
  {
    id: 'spatial-vr',
    tier: 'Spatial',
    name: '360° Spatial VR Recorded Reel',
    priceLKR: 0,
    description: 'Spherical recorded video hosted online for any phone or VR headset.',
    icon: Glasses,
    isBespoke: true,
  },
];

export const PackagePricingCalculator: React.FC = () => {
  // Quantities for fixed price tiers
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'raw-cut': 0,
    'social-edit': 2, // default 2 social edits
    'viral-polish': 0,
  });

  // Toggles for bespoke items
  const [bespokeSelected, setBespokeSelected] = useState<Record<string, boolean>>({
    'full-crew': false,
    'spatial-vr': false,
  });

  // Calculate live subtotal
  const subtotal = useMemo(() => {
    let total = 0;
    PRICING_ITEMS.forEach((item) => {
      if (!item.isBespoke) {
        total += (quantities[item.id] || 0) * item.priceLKR;
      }
    });
    return total;
  }, [quantities]);

  const totalVideos = useMemo(() => {
    return (
      (quantities['raw-cut'] || 0) +
      (quantities['social-edit'] || 0) +
      (quantities['viral-polish'] || 0)
    );
  }, [quantities]);

  const hasBespoke = bespokeSelected['full-crew'] || bespokeSelected['spatial-vr'];

  const handleIncrement = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrement = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1),
    }));
  };

  const toggleBespoke = (id: string) => {
    setBespokeSelected((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Generate customized WhatsApp dispatch URL
  const whatsAppUrl = useMemo(() => {
    const lines: string[] = [
      `Hi Loop Studios! I configured a custom package quote on your website:`,
      ``,
      `📦 SELECTED SCOPE:`,
    ];

    if (quantities['raw-cut'] > 0) {
      lines.push(
        `• ${quantities['raw-cut']}x Level 01: Raw Cut (LKR 1,000 ea) = LKR ${(
          quantities['raw-cut'] * 1000
        ).toLocaleString()}`
      );
    }
    if (quantities['social-edit'] > 0) {
      lines.push(
        `• ${quantities['social-edit']}x Level 02: Social Edit (LKR 3,000 ea) = LKR ${(
          quantities['social-edit'] * 3000
        ).toLocaleString()}`
      );
    }
    if (quantities['viral-polish'] > 0) {
      lines.push(
        `• ${quantities['viral-polish']}x Level 03: Viral Polish (LKR 5,000 ea) = LKR ${(
          quantities['viral-polish'] * 5000
        ).toLocaleString()}`
      );
    }

    if (bespokeSelected['full-crew']) {
      lines.push(`• On-Site: Full-Crew Event Capture (Videographers + Photographers + Drones)`);
    }
    if (bespokeSelected['spatial-vr']) {
      lines.push(`• Spatial: 360° Spatial VR Recorded Reel (Hosted Online)`);
    }

    lines.push(``);
    if (subtotal > 0 && hasBespoke) {
      lines.push(`💰 ESTIMATED EDITING SUBTOTAL: LKR ${subtotal.toLocaleString()} (+ Bespoke Event Scope)`);
    } else if (subtotal > 0) {
      lines.push(`💰 ESTIMATED EDITING TOTAL: LKR ${subtotal.toLocaleString()}`);
    } else if (hasBespoke) {
      lines.push(`💰 SCOPE: Bespoke Event Production Package`);
    } else {
      lines.push(`💰 SCOPE: Custom Project Discussion`);
    }

    lines.push(``);
    lines.push(`Can you confirm crew availability and onboarding timelines for this scope?`);

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
  }, [quantities, bespokeSelected, subtotal, hasBespoke]);

  return (
    <div className="relative rounded-2xl md:rounded-3xl editorial-glass p-6 sm:p-10 border border-white/10 overflow-hidden shadow-2xl transition-all duration-300">
      {/* Background Radial Aurora Bloom */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[110px] bg-cyan-500/10 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-[120px] bg-purple-500/10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 font-semibold mb-2">
            <Calculator className="w-4 h-4" />
            <span>Interactive Quote Builder</span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Build Your Custom Production Package
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-light mt-1 max-w-xl">
            Toggle your required editing tiers and bespoke event capabilities. Calculate instant totals and export directly to WhatsApp.
          </p>
        </div>

        {/* Live Subtotal Pill on Desktop */}
        <div className="shrink-0 text-left md:text-right bg-white/[0.03] border border-white/10 p-4 rounded-2xl">
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
            Estimated Scope Total
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white flex items-baseline gap-1 mt-0.5">
            <AnimatedCounter value={subtotal} prefix="LKR " />
            {hasBespoke && (
              <span className="text-xs font-mono text-cyan-400 font-medium">+ Bespoke</span>
            )}
          </div>
          <div className="text-[11px] font-mono text-cyan-400 mt-1">
            {totalVideos} {totalVideos === 1 ? 'Video Edit' : 'Video Edits'} Selected
          </div>
        </div>
      </div>

      {/* Interactive Selectable Chips & Controls */}
      <div className="relative z-10 space-y-4 mb-8">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
          1. Select Short-Form Editing Volume:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PRICING_ITEMS.filter((item) => !item.isBespoke).map((item) => {
            const count = quantities[item.id] || 0;
            const isSelected = count > 0;
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-500/[0.08] border-cyan-400/50 shadow-lg shadow-cyan-500/10'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      {item.tier}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>

                  <h4 className="font-bold text-white text-base mb-1">{item.name}</h4>
                  <p className="text-xs text-slate-400 font-light mb-3 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="font-mono text-sm sm:text-base font-bold text-white mb-4">
                    LKR {item.priceLKR.toLocaleString()}{' '}
                    <span className="text-xs font-normal text-slate-400">/ video</span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-xs font-mono text-slate-300">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDecrement(item.id)}
                      disabled={count === 0}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer active:scale-95"
                      aria-label={`Decrease ${item.name}`}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-mono font-bold text-sm text-cyan-300">
                      {count}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleIncrement(item.id)}
                      className="w-7 h-7 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 transition-all cursor-pointer active:scale-95"
                      aria-label={`Increase ${item.name}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bespoke Production Addon Chips */}
        <div className="pt-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
            2. Add Bespoke Event Capabilities (Optional):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRICING_ITEMS.filter((item) => item.isBespoke).map((item) => {
              const isSelected = bespokeSelected[item.id] || false;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleBespoke(item.id)}
                  className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-4 active:scale-95 ${
                    isSelected
                      ? 'bg-purple-500/[0.12] border-purple-400/60 shadow-lg shadow-purple-500/15'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-white text-sm sm:text-base">
                        {item.name}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                          isSelected
                            ? 'bg-purple-500/30 text-purple-200 border-purple-400/50'
                            : 'bg-white/5 text-slate-400 border-white/10'
                        }`}
                      >
                        {isSelected ? '✓ Added' : '+ Add'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scope Summary & Direct Dispatch CTA Button */}
      <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for Direct Dispatch</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-300 font-light">
            Selected scope includes cloud drive delivery, source project archive, and revision cycles.
          </div>
        </div>

        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-black font-bold text-sm shadow-[0_0_30px_rgba(0,242,254,0.35)] hover:shadow-[0_0_45px_rgba(0,242,254,0.6)] transition-all active:scale-95 whitespace-nowrap cursor-pointer"
        >
          <span>Send This Exact Scope to WhatsApp</span>
          <ArrowUpRight className="w-4 h-4 text-black" />
        </a>
      </div>
    </div>
  );
};
