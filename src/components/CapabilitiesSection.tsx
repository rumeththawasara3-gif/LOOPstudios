import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { TiltCard } from './TiltCard.tsx';
import { EditorialPhotoFrame } from './EditorialPhotoFrame.tsx';
import { PageView, getWhatsAppUrl } from '../types.ts';

gsap.registerPlugin(ScrollTrigger);

interface CapabilitiesSectionProps {
  onNavigate: (page: PageView, sectionId?: string) => void;
  isDark?: boolean;
}

export const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({ onNavigate, isDark = true }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Staggered card entrance reveal
      const items = sectionRef.current?.querySelectorAll('.capability-alternating-row');
      if (items && items.length > 0) {
        items.forEach((item) => {
          gsap.fromTo(
            item,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                end: 'top 45%',
                scrub: 1,
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative px-5 sm:px-8 md:px-12 max-w-6xl mx-auto py-20 md:py-32 border-t border-white/10"
    >
      {/* Header with Cinema Glow */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20">
        <div className="max-w-2xl space-y-3">
          <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-cyan-400 uppercase font-semibold">
            Visual Production Systems
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white cinema-gradient-text">
            Our Capabilities.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-400 font-light leading-relaxed">
            A cohesive 4-pillar production framework unifying aerial cinematography, high-end event documentation, 360° spatial immersion, and viral retention engineering.
          </p>
        </div>

        <button
          onClick={() => onNavigate('services', 'event-visuals')}
          className="shrink-0 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-cyan-400 hover:text-white transition-colors group cursor-pointer"
        >
          <span>View Rates & Retainers</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Balanced Alternating Showcase Rows */}
      <div className="space-y-12 sm:space-y-16">
        {/* =========================================================================
            PILLAR 1: Aerial & Cinematic Perspectives (Image on Right)
        ========================================================================= */}
        <div className="capability-alternating-row">
          <TiltCard className="h-full" maxTilt={2} spotlightColor="rgba(0, 242, 254, 0.16)">
            <div className="p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column: Clean Typography */}
                <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
                  <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-cyan-400 uppercase font-semibold">
                    PILLAR 01 // CINEMATIC SCALE
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Aerial & Cinematic Perspectives
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-light">
                    Smooth high-altitude sweeps, architectural framing, and sweeping establishing shots filmed in 4K HDR. Deployed seamlessly across Sri Lanka and worldwide by licensed commercial pilots.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-cyan-400">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 font-semibold">
                      4K 60P HDR
                    </span>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                      D-LOG M 10-BIT
                    </span>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                      ISLANDWIDE DISPATCH
                    </span>
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <a
                      href={getWhatsAppUrl(`Hello KULT Studios, I would like to inquire about Aerial & Drone filming for our event/project.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cyan-400 hover:text-white transition-colors group/link"
                    >
                      <span>Check Flight Availability</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Right Column: Large Luxury Photo Card */}
                <div className="lg:col-span-6 order-1 lg:order-2">
                  <EditorialPhotoFrame
                    src="/images/service-aerial.jpg"
                    fallbackSrc="https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1600&auto=format&fit=crop"
                    alt="Aerial Cinematic Coverage"
                    badge="AERIAL CINEMA"
                    gearCutoutSrc="/drone.png"
                    gearName="4K HDR Aerial Cinema Drone"
                    aspectRatio="cinema"
                  />
                </div>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* =========================================================================
            PILLAR 2: Full-Crew Event Coverage & Film (Image on Left)
        ========================================================================= */}
        <div className="capability-alternating-row">
          <TiltCard className="h-full" maxTilt={2} spotlightColor="rgba(0, 242, 254, 0.16)">
            <div className="p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column (Desktop): Large Luxury Photo Card */}
                <div className="lg:col-span-6 order-1">
                  <EditorialPhotoFrame
                    src="/images/service-production.jpg"
                    fallbackSrc="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1600&auto=format&fit=crop"
                    alt="Cinema Event Production"
                    badge="EVENT PRODUCTION"
                    gearCutoutSrc="/gimble.png"
                    gearName="DJI RS4 Motorized Cinema Gimbal"
                    aspectRatio="cinema"
                  />
                </div>

                {/* Right Column (Desktop): Clean Typography */}
                <div className="lg:col-span-6 space-y-4 order-2">
                  <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-cyan-400 uppercase font-semibold">
                    PILLAR 02 // UNIFIED DEPLOYMENT
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Full-Crew Event Coverage & Film
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-light">
                    Unified multi-camera production uniting principal cinema operators, fine-art portrait photographers, and 32-bit float audio engineering for flawless keynote, stage, and atmosphere preservation.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-cyan-400">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 font-semibold">
                      MULTI-CREW DISPATCH
                    </span>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                      FINE-ART CANDIDS
                    </span>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                      32-BIT FLOAT AUDIO
                    </span>
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <a
                      href={getWhatsAppUrl(`Hello KULT Studios, I would like to check event availability for Full-Crew Event Coverage.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cyan-400 hover:text-white transition-colors group/link"
                    >
                      <span>Request Custom Event Quote</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* =========================================================================
            PILLAR 3: 360° Spatial & Virtual Immersion (Image on Right)
        ========================================================================= */}
        <div className="capability-alternating-row">
          <TiltCard className="h-full" maxTilt={2} spotlightColor="rgba(168, 85, 247, 0.18)">
            <div className="p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column: Clean Typography */}
                <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
                  <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-purple-400 uppercase font-semibold">
                    PILLAR 03 // 360° MEMORY CAPTURE
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    360° Memory Capture & Immersion
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-light">
                    We record your entire event or space in immersive 360° video. We deliver a ready-to-view experience so anyone can re-watch the moment back on any smartphone or with a VR headset—no complicated apps, completely hosted online.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-purple-400">
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 font-semibold">
                      PLAY ON ANY PHONE
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                      VR HEADSET READY
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                      ONLINE CLOUD HOSTED
                    </span>
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <button
                      onClick={() => onNavigate('home', '360-vr')}
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-purple-400 hover:text-white transition-colors group/link cursor-pointer"
                    >
                      <span>Open 360° Review Player</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Right Column: Large Luxury Photo Card */}
                <div className="lg:col-span-6 order-1 lg:order-2">
                  <EditorialPhotoFrame
                    src="/images/service-360.jpg"
                    fallbackSrc="https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?q=80&w=1600&auto=format&fit=crop"
                    alt="360 Spatial Immersion"
                    badge="360° SPATIAL"
                    gearCutoutSrc="/vrbox.png"
                    gearName="8K Equirectangular Spatial VR Rig"
                    aspectRatio="cinema"
                  />
                </div>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* =========================================================================
            PILLAR 4: Viral Retention & Short-Form Content (Image on Left)
        ========================================================================= */}
        <div className="capability-alternating-row">
          <TiltCard className="h-full" maxTilt={2} spotlightColor="rgba(0, 242, 254, 0.16)">
            <div className="p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column (Desktop): Large Luxury Photo Card */}
                <div className="lg:col-span-6 order-1">
                  <EditorialPhotoFrame
                    src="/images/service-editing.jpg"
                    fallbackSrc="https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1600&auto=format&fit=crop"
                    alt="Short-Form Retention Editing"
                    badge="VIRAL RETENTION"
                    gearCutoutSrc="/cam.png"
                    gearName="Canon EOS Full-Frame Optical Rig"
                    aspectRatio="cinema"
                  />
                </div>

                {/* Right Column (Desktop): Clean Typography */}
                <div className="lg:col-span-6 space-y-4 order-2">
                  <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-cyan-400 uppercase font-semibold">
                    PILLAR 04 // POST-PRODUCTION RETENTION
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Viral Retention & Short-Form Content
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-light">
                    Engineered 9:16 vertical reels with sub-second hook framing, dynamic kinetic captions, impact sound design, and color grading for TikTok, Reels, and YouTube Shorts.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-cyan-400">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 font-semibold">
                      SUB-SECOND HOOKS
                    </span>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                      KINETIC SUBTITLES
                    </span>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                      FROM LKR 1,000 / VIDEO
                    </span>
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <button
                      onClick={() => onNavigate('services', 'rates')}
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cyan-400 hover:text-white transition-colors group/link cursor-pointer"
                    >
                      <span>View Transparent Rate Cards</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
};
