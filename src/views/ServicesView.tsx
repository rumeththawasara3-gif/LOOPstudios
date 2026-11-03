import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Sparkles, Calculator, Plus, Eye, MessageSquare } from 'lucide-react';
import { RateCardTier, RetainerTier, getWhatsAppUrl, DISPLAY_PHONE } from '../types.ts';
import { TiltCard } from '../components/TiltCard.tsx';
import { Magnetic } from '../components/Magnetic.tsx';
import {
  DroneAnimationBlock,
  VRHeadsetAnimationBlock,
  CinemaGimbalAnimationBlock,
  OpticsSnapAnimationBlock,
  EditingTimelineAnimationBlock,
} from '../components/ContextualAnimations.tsx';
import { VenueLocatorMap } from '../components/VenueLocatorMap.tsx';

interface ServicesViewProps {
  onOpenQuoteModal: (serviceId?: string) => void;
  isDark?: boolean;
}

const SHORT_FORM_TIERS: RateCardTier[] = [
  {
    id: 'raw-cut',
    level: 'Level 01',
    title: 'The Raw Cut',
    priceLKR: 1000,
    period: 'per video',
    runtime: 'Up to 60s runtime',
    deliverables: [
      'Clean jump-cut assembly & audio synchronization',
      'Basic pacing & framing',
      'Audio leveling',
      'Fast 24-hour turnaround',
    ],
  },
  {
    id: 'social-edit',
    level: 'Level 02',
    title: 'The Social Edit',
    priceLKR: 3000,
    period: 'per video',
    badge: 'Most Popular',
    isPopular: true,
    runtime: 'Up to 60s runtime',
    deliverables: [
      'Dynamic retention pacing',
      'Custom animated kinetic typography & subtitles',
      'Impact sound design & SFX hits',
      'Full color correction',
      '48-hour standard turnaround',
    ],
  },
  {
    id: 'viral-polish',
    level: 'Level 03',
    title: 'The Viral Polish',
    priceLKR: 5000,
    period: 'per video',
    badge: 'Max Retention',
    runtime: 'Up to 60s runtime',
    deliverables: [
      'Engineered frame-by-frame retention hooks',
      'Custom motion graphics & VFX',
      'Advanced cinematic color grading',
      'Dynamic B-roll overlays & atmospheric soundscapes',
      'Seamless loop ending for replay multiplier',
    ],
  },
];

const RETAINER_PACKAGES: RetainerTier[] = [
  {
    id: 'essential',
    title: 'Essential Package',
    priceLKR: 25000,
    period: 'per month',
    description: 'Structured for tuition classes and growing brands building an active social acquisition engine.',
    channels: ['Facebook', 'Instagram', 'TikTok', 'WhatsApp Groups'],
    features: [
      'Complete Facebook, Instagram, TikTok & WhatsApp group management',
      '10 AI-assisted branded posts per month',
      '2 professionally edited videos per month (includes on-location shoot & presenter)',
      'Monthly content planning, scheduling & performance monitoring',
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced Package',
    priceLKR: 35000,
    period: 'per month',
    isPopular: true,
    description: 'Turnkey content scaling for educational academies, tutoring masters, and commercial brands.',
    channels: ['Facebook', 'Instagram', 'TikTok', 'WhatsApp Groups', 'Omnichannel'],
    features: [
      'Complete multi-platform management (FB, IG, TikTok, WhatsApp)',
      '15 AI-assisted branded posts per month',
      '3 professionally edited videos per month (includes on-location shoot & presenter)',
      'Advanced digital marketing strategies, audience targeting & deep analytics',
      'Priority scheduling for on-location filming sessions',
    ],
  },
];

export const ServicesView: React.FC<ServicesViewProps> = ({ onOpenQuoteModal, isDark = true }) => {
  const [selectedTierId, setSelectedTierId] = useState<string>('social-edit');
  const [batchCount, setBatchCount] = useState<number>(5);

  const activeTier = SHORT_FORM_TIERS.find((t) => t.id === selectedTierId) || SHORT_FORM_TIERS[1];
  const totalLKR = activeTier.priceLKR * batchCount;

  return (
    <div className="relative z-10 overflow-hidden">
      {/* Header with explicit top padding pt-28 md:pt-40 */}
      <section className="relative px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-28 md:pt-40 pb-16 md:pb-24">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Rate Cards & Retainers
          </div>
          <h1 className="font-display text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight cinema-gradient-text">
            Bespoke Production. <br />
            <span className="text-neutral-500 dark:text-neutral-400 font-normal">
              Transparent Rate Cards.
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400 font-light max-w-xl leading-relaxed">
            From multi-crew event coverage available by bespoke custom quote to transparent per-video rate cards and turnkey social management retainers.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION A: EVENT VISUAL PRODUCTION (CUSTOM QUOTES ONLY)
          (NO Camera Brand Names, NO Public Shooting Prices)
          Featuring the 4 Contextual Bidirectional Animations on scroll!
      ========================================================================= */}
      <section id="event-visuals" className="relative px-5 sm:px-8 md:px-12 max-w-6xl mx-auto py-16 md:py-32 border-t border-black/10 dark:border-white/10">
        <div className="mb-12 sm:mb-14 max-w-3xl space-y-3">
          <div className="text-cyan-400 font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase font-semibold">
            SECTION A // BESPOKE EVENT MEDIA
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight cinema-gradient-text">
            Event Visual Production
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-2xl">
            Framed as an exclusive bespoke service where clients request custom event quotes based on venue scale and production requirements. No public shooting prices, no camera brand name clutter.
          </p>
        </div>

        {/* 1. Full-Crew Deployment with Drone & Aerial Animation */}
        <div className="space-y-6 sm:space-y-8 mb-10 sm:mb-12">
          {/* Contextual Animation 1: Drone & Aerial */}
          <DroneAnimationBlock />

          <div className="p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                01 · UNIFIED DEPLOYMENT
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0A0A0C] dark:text-white">
                Full-Crew Event Coverage
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                Unified deployment: Videographers, Photographers, and Drone operators working in unison. Complete event documentation with aerial coverage and fine-art candids.
              </p>
            </div>
            <a
              href={getWhatsAppUrl(`Hi Loop Studios, I'd like to check event availability for Full-Crew Event Coverage (Videographers + Photographers + Drones).`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] text-xs sm:text-sm font-semibold rounded-full bg-[#0A0A0C] text-white dark:bg-white dark:text-black hover:opacity-90 transition-all shadow-md whitespace-nowrap active:scale-95"
            >
              <span>Check Event Availability</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 2. Cinematic Videography with Gimbal & Cinema Motion Animation */}
        <div className="space-y-6 sm:space-y-8 mb-10 sm:mb-12">
          <CinemaGimbalAnimationBlock />

          <div className="p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                02 · NARRATIVE CAPTURE
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0A0A0C] dark:text-white">
                Cinematic Videography & Recap Films
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                Narrative event storytelling, highlight reels, and aerial coverage. Dynamic pacing paired with master color grading and licensed scores.
              </p>
            </div>
            <a
              href={getWhatsAppUrl(`Hi Loop Studios, I'd like to request a bespoke quote for Cinematic Videography & Recap Films.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] text-xs sm:text-sm font-semibold rounded-full bg-[#0A0A0C] text-white dark:bg-white dark:text-black hover:opacity-90 transition-all shadow-md whitespace-nowrap active:scale-95"
            >
              <span>Request Cinema Quote</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 3. Signature Event Photography with Optics Snap Animation */}
        <div className="space-y-6 sm:space-y-8 mb-10 sm:mb-12">
          <OpticsSnapAnimationBlock />

          <div className="p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                03 · EDITORIAL STILLS
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0A0A0C] dark:text-white">
                Signature Event Photography
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                High-detail candids, stage moments, and advanced editorial retouching. Private proofing galleries delivered with rapid social press teasers.
              </p>
            </div>
            <a
              href={getWhatsAppUrl(`Hi Loop Studios, I'd like to request a bespoke quote for Signature Event Photography.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] text-xs sm:text-sm font-semibold rounded-full bg-[#0A0A0C] text-white dark:bg-white dark:text-black hover:opacity-90 transition-all shadow-md whitespace-nowrap active:scale-95"
            >
              <span>Request Stills Quote</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 4. 360° Immersive Capture with VR Headset Animation */}
        <div className="space-y-6 sm:space-y-8 mb-6">
          <VRHeadsetAnimationBlock />

          <div className="p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                04 · EXCLUSIVE NEW UPGRADE
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0A0A0C] dark:text-white">
                360° Immersive Capture
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                Full-sphere event documentation playable across mobile devices, web browsers, and VR headsets. Viewers control their perspective anywhere in the room.
              </p>
            </div>
            <a
              href={getWhatsAppUrl(`Hi Loop Studios, I'd like to add 360° Immersive Capture to our upcoming event.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] text-xs sm:text-sm font-semibold rounded-full bg-[#0A0A0C] text-white dark:bg-white dark:text-black hover:opacity-90 transition-all shadow-md whitespace-nowrap active:scale-95"
            >
              <span>Add 360° VR to Your Event</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: SHORT-FORM VIDEO EDITING (TRANSPARENT RATE CARD)
          Featuring the 5th Animation: Editing Timeline Slice on Scroll!
      ========================================================================= */}
      <section id="rates" className="relative px-5 sm:px-8 md:px-12 max-w-6xl mx-auto py-16 md:py-32 border-t border-black/10 dark:border-white/10">
        <div className="mb-10 sm:mb-12">
          {/* Contextual Animation 5: Editing & Post-Production Timeline Slices */}
          <EditingTimelineAnimationBlock />
        </div>

        <div className="mb-12 sm:mb-14 max-w-3xl space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
            Section B · Transparent Rate Card
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-[#0A0A0C] dark:text-white tracking-tight">
            Short-Form Video Editing
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-xl">
            Clean 3-tier grid for short-form edits up to 60s runtime for TikTok, Instagram Reels, and YouTube Shorts. Transparent pricing with clear deliverables.
          </p>
        </div>

        {/* 3-Tier Rate Cards (grid-cols-1 md:grid-cols-3 gap-6) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-12 sm:mb-16">
          {SHORT_FORM_TIERS.map((tier) => (
            <TiltCard
              key={tier.id}
              className="h-full"
              spotlightColor={tier.isPopular ? 'rgba(0, 242, 254, 0.25)' : 'rgba(255, 255, 255, 0.08)'}
            >
              <div
                className={`h-full p-6 sm:p-8 rounded-2xl flex flex-col justify-between transition-all relative ${
                  tier.isPopular
                    ? 'editorial-glass border-2 border-cyan-400/80 shadow-[0_0_40px_rgba(0,242,254,0.3)] bg-gradient-to-b from-cyan-950/20 via-black/40 to-black/60'
                    : 'editorial-glass'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                      {tier.level}
                    </span>
                    {tier.isPopular ? (
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-black font-extrabold text-[9px] font-mono tracking-wider uppercase animate-shimmer shadow-[0_0_15px_rgba(0,242,254,0.6)]">
                        MOST POPULAR CREATOR CHOICE
                      </div>
                    ) : (
                      tier.badge && (
                        <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-white font-bold border border-white/10">
                          {tier.badge}
                        </span>
                      )
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{tier.title}</h3>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span
                      className={`text-3xl sm:text-4xl font-extrabold font-mono tabular-nums ${
                        tier.isPopular
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_20px_rgba(0,242,254,0.5)]'
                          : 'text-white'
                      }`}
                    >
                      LKR {tier.priceLKR.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">/ video</span>
                  </div>

                  <div className="text-[11px] font-mono text-cyan-400/80 mb-6">
                    {tier.runtime}
                  </div>

                  <div className="space-y-3 pt-6 border-t border-white/10">
                    {tier.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 font-light">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-white/10">
                  <a
                    href={getWhatsAppUrl(
                      `Hi Loop Studios, I'd like to order "${tier.title}" (${tier.level}) for short-form video editing at LKR ${tier.priceLKR.toLocaleString()} / video.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full min-h-[46px] py-3 text-xs font-semibold rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      tier.isPopular
                        ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-black font-bold shadow-[0_0_25px_rgba(0,242,254,0.45)] hover:brightness-110'
                        : 'bg-white/10 hover:bg-white/15 text-white border border-white/15 shadow-md'
                    }`}
                  >
                    <span>Order on WhatsApp</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Batch Estimator */}
        <div className="p-6 sm:p-8 rounded-2xl editorial-glass">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Batch Content Calculator</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#0A0A0C] dark:text-white mb-2">
            Estimate Your Monthly Video Batch
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-xl font-light">
            Select editing level and video volume. Master files delivered in cloud drive folders ready for distribution.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 space-y-2">
              <label className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400">
                Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SHORT_FORM_TIERS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTierId(t.id)}
                    className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedTierId === t.id
                        ? 'bg-[#0A0A0C] text-white dark:bg-white dark:text-black border-transparent shadow-sm'
                        : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <div className="text-[10px] font-mono">{t.level}</div>
                    <div className="text-xs font-bold truncate">{t.title}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400">
                <span>Quantity</span>
                <span className="text-[#0A0A0C] dark:text-white font-bold">{batchCount} Videos</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={batchCount}
                onChange={(e) => setBatchCount(Number(e.target.value))}
                className="w-full accent-black dark:accent-white bg-black/10 dark:bg-white/10 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                <span>1 video</span>
                <span>15 videos</span>
                <span>30 videos</span>
              </div>
            </div>

            <div className="md:col-span-3 p-4 rounded-xl bg-black/5 dark:bg-white/[0.02] border border-black/10 dark:border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-600 dark:text-neutral-400">Total Investment</span>
                <div className="text-2xl sm:text-3xl font-bold text-[#0A0A0C] dark:text-white font-mono tabular-nums">
                  LKR {totalLKR.toLocaleString()}
                </div>
              </div>
              <div className="pt-3 mt-3 border-t border-black/10 dark:border-white/10">
                <a
                  href={getWhatsAppUrl(
                    `Hi Loop Studios, I'd like to book a batch of ${batchCount} videos under "${activeTier.title}" totaling LKR ${totalLKR.toLocaleString()}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-full bg-[#0A0A0C] text-white dark:bg-white dark:text-black hover:opacity-90 transition-colors active:scale-95"
                >
                  <span>Book Batch</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION C: DIGITAL MARKETING & SOCIAL RETAINERS
      ========================================================================= */}
      <section id="retainers" className="relative px-5 sm:px-8 md:px-12 max-w-6xl mx-auto py-16 md:py-32 border-t border-black/10 dark:border-white/10">
        <div className="mb-12 sm:mb-14 max-w-3xl space-y-3">
          <div className="text-cyan-400 font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase font-semibold">
            SECTION C // GROWTH RETAINERS
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight cinema-gradient-text">
            Digital Marketing & Social Retainers
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-2xl">
            Structured monthly management packages tailored for tuition classes and growing brands. We handle shooting, editing, branded posts, and WhatsApp group management.
          </p>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
            <span>Partnership Offer: 5% discount on continuous 3-month commitments.</span>
          </div>
        </div>

        {/* 2 Retainer Packages (grid-cols-1 lg:grid-cols-2 gap-6) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-10 sm:mb-12">
          {RETAINER_PACKAGES.map((pkg) => (
            <TiltCard key={pkg.id} className="h-full">
              <div
                className={`h-full p-6 sm:p-8 rounded-2xl flex flex-col justify-between transition-all relative overflow-hidden ${
                  pkg.isPopular
                    ? 'bg-[#080B11]/90 border border-cyan-400/50 shadow-[0_0_50px_rgba(0,242,254,0.15)] ring-1 ring-cyan-400/30'
                    : 'editorial-glass border border-black/10 dark:border-white/10 dark:border-t-white/20'
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
                )}

                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                      Monthly Package
                    </span>
                    {pkg.isPopular && (
                      <span className="text-[10px] font-mono uppercase px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold tracking-wider shadow-[0_0_15px_rgba(0,242,254,0.4)]">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0A0A0C] dark:text-white mb-2">{pkg.title}</h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-6 font-light leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums ${
                      pkg.isPopular
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 drop-shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                        : 'text-[#0A0A0C] dark:text-white'
                    }`}>
                      LKR {pkg.priceLKR.toLocaleString()}
                    </span>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">/ month</span>
                  </div>

                  <div className="mb-6">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
                      Platforms Included:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.channels.map((ch, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono"
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-black/10 dark:border-white/10">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 font-light">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-black/10 dark:border-white/10">
                  <a
                    href={getWhatsAppUrl(
                      `Hi Loop Studios, I'd like to book the "${pkg.title}" (LKR ${pkg.priceLKR.toLocaleString()} / month) for our brand/classes.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full min-h-[44px] py-3.5 text-xs font-semibold rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      pkg.isPopular
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold shadow-[0_0_20px_rgba(0,242,254,0.35)] hover:shadow-[0_0_30px_rgba(0,242,254,0.6)]'
                        : 'bg-black/5 dark:bg-white/10 text-[#0A0A0C] dark:text-white hover:bg-black/10 dark:hover:bg-white/20'
                    }`}
                  >
                    <span>Subscribe on WhatsApp</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Available Add-Ons Note */}
        <div className="p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
              Modular Scaling
            </div>
            <h4 className="text-sm sm:text-base font-bold text-[#0A0A0C] dark:text-white">
              Available Add-Ons Upon Request
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed font-light">
              Additional video edits, extra on-site shoots, extra presenter bookings, and bulk WhatsApp outreach campaigns can be added to any package seamlessly.
            </p>
          </div>

          <a
            href={getWhatsAppUrl(`Hi Loop Studios, I'm interested in adding custom modular add-ons to our retainer.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] text-xs font-semibold rounded-full bg-black/5 dark:bg-white/10 text-[#0A0A0C] dark:text-white hover:bg-black/10 dark:hover:bg-white/20 border border-black/10 dark:border-white/15 transition-all active:scale-95"
          >
            <span>Inquire for Add-On Rates</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* =========================================================================
          SECTION D: GOOGLE MAPS LOCATION GROUNDING & EVENT DISPATCH ESTIMATOR
      ========================================================================= */}
      <section
        id="venue-locator"
        className="relative px-5 sm:px-8 md:px-12 max-w-6xl mx-auto py-16 md:py-24 border-t border-black/10 dark:border-white/10"
      >
        <div className="mb-8 sm:mb-10 max-w-2xl space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
            Islandwide Production Logistics
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-[#0A0A0C] dark:text-white tracking-tight leading-tight">
            Event Venue Locator & Travel Estimator.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
            Pin your landmark hotel or private venue across Sri Lanka. Our Google Maps integration calculates travel vectors from our Western Province base, verifies multi-van full-crew deployment availability, and prepares your WhatsApp date reservation instant quote.
          </p>
        </div>

        <VenueLocatorMap isDark={isDark} />
      </section>
    </div>
  );
};
