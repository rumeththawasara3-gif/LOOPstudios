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
    <div className="relative z-10 pt-24 sm:pt-28 pb-24 overflow-hidden">
      {/* Header */}
      <section className="relative px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-16">
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Services & Pricing
          </div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#0A0A0C] dark:text-white leading-[1.05]">
            Bespoke Production. <br />
            <span className="text-slate-500 dark:text-slate-400 font-normal">
              Transparent Rate Cards.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-light max-w-xl leading-relaxed">
            From multi-crew event coverage available by bespoke custom quote to transparent per-video rate cards and turnkey social management retainers.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION A: EVENT VISUAL PRODUCTION (CUSTOM QUOTES ONLY)
          (NO Camera Brand Names, NO Public Shooting Prices)
          Featuring the 4 Contextual Bidirectional Animations on scroll!
      ========================================================================= */}
      <section id="event-visuals" className="relative px-6 lg:px-8 max-w-7xl mx-auto py-16 sm:py-20 border-t border-black/10 dark:border-white/10">
        <div className="mb-14 max-w-3xl space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Section A · Bespoke Event Media
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#0A0A0C] dark:text-white tracking-tight">
            Event Visual Production
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed max-w-2xl">
            Framed as an exclusive bespoke service where clients request custom event quotes based on venue scale and production requirements. No public shooting prices, no camera brand name clutter.
          </p>
        </div>

        {/* 1. Full-Crew Deployment with Drone & Aerial Animation */}
        <div className="space-y-8 mb-12">
          {/* Contextual Animation 1: Drone & Aerial */}
          <DroneAnimationBlock />

          <div className="p-8 sm:p-9 rounded-2xl editorial-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                01 · UNIFIED DEPLOYMENT
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0A0A0C] dark:text-white">
                Full-Crew Event Coverage
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Unified deployment: Videographers, Photographers, and Drone operators working in unison. Complete event documentation with aerial coverage and fine-art candids.
              </p>
            </div>
            <a
              href={getWhatsAppUrl(`Hi Loop Studios, I'd like to check event availability for Full-Crew Event Coverage (Videographers + Photographers + Drones).`)}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold rounded-full bg-[#0A0A0C] text-white dark:bg-white dark:text-black hover:opacity-90 transition-all shadow-md whitespace-nowrap"
            >
              <span>Check Event Availability</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 2. Cinematic Videography with Gimbal & Cinema Motion Animation */}
        <div className="space-y-8 mb-12">
          <CinemaGimbalAnimationBlock />

          <div className="p-8 sm:p-9 rounded-2xl editorial-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                02 · NARRATIVE CAPTURE
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0A0A0C] dark:text-white">
                Cinematic Videography & Recap Films
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Narrative event storytelling, highlight reels, and aerial coverage. Dynamic pacing paired with master color grading and licensed scores.
              </p>
            </div>
            <a
              href={getWhatsAppUrl(`Hi Loop Studios, I'd like to request a bespoke quote for Cinematic Videography & Recap Films.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold rounded-full bg-[#0A0A0C] text-white dark:bg-white dark:text-black hover:opacity-90 transition-all shadow-md whitespace-nowrap"
            >
              <span>Request Cinema Quote</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 3. Signature Event Photography with Optics Snap Animation */}
        <div className="space-y-8 mb-12">
          <OpticsSnapAnimationBlock />

          <div className="p-8 sm:p-9 rounded-2xl editorial-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                03 · EDITORIAL STILLS
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0A0A0C] dark:text-white">
                Signature Event Photography
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                High-detail candids, stage moments, and advanced editorial retouching. Private proofing galleries delivered with rapid social press teasers.
              </p>
            </div>
            <a
              href={getWhatsAppUrl(`Hi Loop Studios, I'd like to request a bespoke quote for Signature Event Photography.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold rounded-full bg-[#0A0A0C] text-white dark:bg-white dark:text-black hover:opacity-90 transition-all shadow-md whitespace-nowrap"
            >
              <span>Request Stills Quote</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 4. 360° Immersive Capture with VR Headset Animation */}
        <div className="space-y-8 mb-6">
          <VRHeadsetAnimationBlock />

          <div className="p-8 sm:p-9 rounded-2xl editorial-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                04 · EXCLUSIVE NEW UPGRADE
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0A0A0C] dark:text-white">
                360° Immersive Capture
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Full-sphere event documentation playable across mobile devices, web browsers, and VR headsets. Viewers control their perspective anywhere in the room.
              </p>
            </div>
            <a
              href={getWhatsAppUrl(`Hi Loop Studios, I'd like to add 360° Immersive Capture to our upcoming event.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold rounded-full bg-[#0A0A0C] text-white dark:bg-white dark:text-black hover:opacity-90 transition-all shadow-md whitespace-nowrap"
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
      <section id="rates" className="relative px-6 lg:px-8 max-w-7xl mx-auto py-16 sm:py-20 border-t border-black/10 dark:border-white/10">
        <div className="mb-12">
          {/* Contextual Animation 5: Editing & Post-Production Timeline Slices */}
          <EditingTimelineAnimationBlock />
        </div>

        <div className="mb-14 max-w-3xl space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Section B · Transparent Rate Card
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#0A0A0C] dark:text-white tracking-tight">
            Short-Form Video Editing
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed max-w-xl">
            Clean 3-tier grid for short-form edits up to 60s runtime for TikTok, Instagram Reels, and YouTube Shorts. Transparent pricing with clear deliverables.
          </p>
        </div>

        {/* 3-Tier Rate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
          {SHORT_FORM_TIERS.map((tier) => (
            <TiltCard key={tier.id} className="h-full">
              <div
                className={`h-full p-8 rounded-2xl flex flex-col justify-between transition-all ${
                  tier.isPopular
                    ? 'editorial-glass border-2 border-black/30 dark:border-white/40 shadow-xl'
                    : 'editorial-glass'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      {tier.level}
                    </span>
                    {tier.badge && (
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#0A0A0C] text-white dark:bg-white dark:text-black font-bold">
                        {tier.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-[#0A0A0C] dark:text-white mb-2">{tier.title}</h3>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl sm:text-4xl font-bold text-[#0A0A0C] dark:text-white font-display tabular-nums">
                      LKR {tier.priceLKR.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">/ video</span>
                  </div>

                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-6">
                    {tier.runtime}
                  </div>

                  <div className="space-y-3 pt-6 border-t border-black/10 dark:border-white/10">
                    {tier.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-light">
                        <Check className="w-3.5 h-3.5 text-current shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-black/10 dark:border-white/10">
                  <a
                    href={getWhatsAppUrl(
                      `Hi Loop Studios, I'd like to order "${tier.title}" (${tier.level}) for short-form video editing at LKR ${tier.priceLKR.toLocaleString()} / video.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 text-xs font-semibold rounded-full flex items-center justify-center gap-2 transition-all ${
                      tier.isPopular
                        ? 'bg-[#0A0A0C] text-white dark:bg-white dark:text-black hover:opacity-90'
                        : 'bg-black/5 dark:bg-white/10 text-[#0A0A0C] dark:text-white hover:bg-black/10 dark:hover:bg-white/20'
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
        <div className="p-7 sm:p-9 rounded-2xl editorial-glass">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Batch Content Calculator</span>
          </div>
          <h3 className="text-xl font-bold text-[#0A0A0C] dark:text-white mb-2">
            Estimate Your Monthly Video Batch
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 max-w-xl font-light">
            Select editing level and video volume. Master files delivered in cloud drive folders ready for distribution.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 space-y-2">
              <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400">
                Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SHORT_FORM_TIERS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTierId(t.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      selectedTierId === t.id
                        ? 'bg-[#0A0A0C] text-white dark:bg-white dark:text-black border-transparent'
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
              <div className="flex justify-between items-center text-xs font-mono uppercase text-slate-500 dark:text-slate-400">
                <span>Quantity</span>
                <span className="text-[#0A0A0C] dark:text-white font-bold">{batchCount} Videos</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={batchCount}
                onChange={(e) => setBatchCount(Number(e.target.value))}
                className="w-full accent-black dark:accent-white bg-black/10 dark:bg-white/10 rounded-lg cursor-pointer h-1.5"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>1 video</span>
                <span>15 videos</span>
                <span>30 videos</span>
              </div>
            </div>

            <div className="md:col-span-3 p-4 rounded-xl bg-black/5 dark:bg-white/[0.02] border border-black/10 dark:border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">Total Investment</span>
                <div className="text-2xl font-bold text-[#0A0A0C] dark:text-white font-display tabular-nums">
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
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-full bg-[#0A0A0C] text-white dark:bg-white dark:text-black hover:opacity-90 transition-colors"
                >
                  <span>Book Batch</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION C: DIGITAL MARKETING & SOCIAL RETAINERS
      ========================================================================= */}
      <section id="retainers" className="relative px-6 lg:px-8 max-w-7xl mx-auto py-16 sm:py-20 border-t border-black/10 dark:border-white/10">
        <div className="mb-14 max-w-3xl space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Section C · Growth Retainers
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#0A0A0C] dark:text-white tracking-tight">
            Digital Marketing & Social Retainers
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed max-w-2xl">
            Structured monthly management packages tailored for tuition classes and growing brands. We handle shooting, editing, branded posts, and WhatsApp group management.
          </p>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full editorial-glass text-[#0A0A0C] dark:text-white text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Partnership Offer: 5% discount on continuous 3-month commitments.</span>
          </div>
        </div>

        {/* 2 Retainer Packages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-12">
          {RETAINER_PACKAGES.map((pkg) => (
            <TiltCard key={pkg.id} className="h-full">
              <div
                className={`h-full p-8 sm:p-9 rounded-2xl flex flex-col justify-between transition-all ${
                  pkg.isPopular
                    ? 'editorial-glass border-2 border-black/30 dark:border-white/40 shadow-xl'
                    : 'editorial-glass'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Monthly Package
                    </span>
                    {pkg.isPopular && (
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#0A0A0C] text-white dark:bg-white dark:text-black font-bold">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-[#0A0A0C] dark:text-white mb-2">{pkg.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-6 font-light leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl sm:text-4xl font-bold text-[#0A0A0C] dark:text-white font-display tabular-nums">
                      LKR {pkg.priceLKR.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">/ month</span>
                  </div>

                  <div className="mb-6">
                    <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-2">
                      Platforms Included:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.channels.map((ch, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300"
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-black/10 dark:border-white/10">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-light">
                        <Check className="w-3.5 h-3.5 text-current shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-black/10 dark:border-white/10">
                  <a
                    href={getWhatsAppUrl(
                      `Hi Loop Studios, I'd like to book the "${pkg.title}" (LKR ${pkg.priceLKR.toLocaleString()} / month) for our brand/classes.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3.5 text-xs font-semibold rounded-full flex items-center justify-center gap-2 transition-all ${
                      pkg.isPopular
                        ? 'bg-[#0A0A0C] text-white dark:bg-white dark:text-black hover:opacity-90'
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
        <div className="p-7 rounded-2xl editorial-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Modular Scaling
            </div>
            <h4 className="text-base font-bold text-[#0A0A0C] dark:text-white">
              Available Add-Ons Upon Request
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-light">
              Additional video edits, extra on-site shoots, extra presenter bookings, and bulk WhatsApp outreach campaigns can be added to any package seamlessly.
            </p>
          </div>

          <a
            href={getWhatsAppUrl(`Hi Loop Studios, I'm interested in adding custom modular add-ons to our retainer.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-full bg-black/5 dark:bg-white/10 text-[#0A0A0C] dark:text-white hover:bg-black/10 dark:hover:bg-white/20 border border-black/10 dark:border-white/15 transition-all"
          >
            <span>Inquire for Add-On Rates</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
};
