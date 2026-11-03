import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 1. DRONE / AERIAL: Drops or sweeps in gracefully from top-perspective space like a descending drone shot
export const KineticDroneText: React.FC<{
  children?: React.ReactNode;
  text?: string;
  className?: string;
}> = ({ children, text = 'AERIAL & DRONE', className = '' }) => {
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elRef.current) return;
    const el = elRef.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          y: -80,
          scale: 1.35,
          opacity: 0,
          rotateX: 35,
          transformPerspective: 800,
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 45%',
            scrub: 0.8,
            toggleActions: 'play reverse play reverse',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={elRef}
      className={`inline-block will-change-transform will-change-[opacity] select-none ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children || text}
    </div>
  );
};

// 2. EDITING / POST-PRODUCTION: Snaps and slices horizontally into frame with crisp timeline cuts
export const KineticEditingText: React.FC<{
  children?: React.ReactNode;
  text?: string;
  className?: string;
}> = ({ children, text = 'TIMELINE EDITING', className = '' }) => {
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elRef.current) return;
    const el = elRef.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          x: -120,
          skewX: -14,
          opacity: 0,
        },
        {
          x: 0,
          skewX: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            end: 'top 50%',
            scrub: 0.6,
            toggleActions: 'play reverse play reverse',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={elRef}
      className={`inline-block will-change-transform will-change-[opacity] select-none ${className}`}
    >
      {children || text}
    </div>
  );
};

// 3. CINEMA / EVENT: Glides in with an aperture/cinematic lens blur fade-in, resolving into razor clarity
export const KineticCinemaText: React.FC<{
  children?: React.ReactNode;
  text?: string;
  className?: string;
}> = ({ children, text = 'CINEMATOGRAPHY', className = '' }) => {
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elRef.current) return;
    const el = elRef.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          filter: 'blur(20px)',
          opacity: 0.1,
          scale: 0.92,
        },
        {
          filter: 'blur(0px)',
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 0.8,
            toggleActions: 'play reverse play reverse',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={elRef}
      className={`inline-block will-change-[filter,opacity,transform] select-none ${className}`}
    >
      {children || text}
    </div>
  );
};

// 4. 360° / VR: Sweeps in with a smooth rotational perspective flip
export const Kinetic360Text: React.FC<{
  children?: React.ReactNode;
  text?: string;
  className?: string;
}> = ({ children, text = '360° SPATIAL', className = '' }) => {
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elRef.current) return;
    const el = elRef.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          rotateY: 85,
          scale: 0.8,
          opacity: 0,
          transformPerspective: 1000,
        },
        {
          rotateY: 0,
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 45%',
            scrub: 0.8,
            toggleActions: 'play reverse play reverse',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={elRef}
      className={`inline-block will-change-transform will-change-[opacity] select-none ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children || text}
    </div>
  );
};
