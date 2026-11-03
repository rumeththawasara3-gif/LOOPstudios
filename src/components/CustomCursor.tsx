import React, { useEffect, useState, useRef } from 'react';

interface ShimmerParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export const CustomCursor: React.FC<{ isDark?: boolean }> = ({ isDark = true }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const shimmersRef = useRef<ShimmerParticle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const updateTrail = () => {
      setTrail((prev) => ({
        x: lerp(prev.x, pos.x, 0.2),
        y: lerp(prev.y, pos.y, 0.2),
      }));
      animId = requestAnimationFrame(updateTrail);
    };
    animId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(animId);
  }, [pos]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('select') ||
          target.closest('textarea') ||
          target.closest('.interactive-item') ||
          target.closest('[role="button"]'))
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const newParticles: ShimmerParticle[] = [];
      const count = 8;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
        const speed = Math.random() * 2.2 + 0.8;
        newParticles.push({
          id: Math.random() + Date.now(),
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 1.8 + 1,
          alpha: 0.9,
        });
      }
      shimmersRef.current = [...shimmersRef.current, ...newParticles];
    };

    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isVisible]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const onResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const animateShimmer = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (shimmersRef.current.length > 0) {
        const pColor = isDark ? '255, 255, 255' : '10, 10, 12';
        shimmersRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.04;
          p.vx *= 0.93;
          p.vy *= 0.93;

          if (p.alpha > 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${pColor}, ${p.alpha})`;
            ctx.fill();
          }
        });
        shimmersRef.current = shimmersRef.current.filter((p) => p.alpha > 0);
      }

      animId = requestAnimationFrame(animateShimmer);
    };

    animId = requestAnimationFrame(animateShimmer);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, [isDark]);

  if (!isVisible) return null;

  const ringBorder = isDark
    ? isHovering
      ? 'rgba(255, 255, 255, 0.45)'
      : 'rgba(255, 255, 255, 0.18)'
    : isHovering
    ? 'rgba(10, 10, 12, 0.5)'
    : 'rgba(10, 10, 12, 0.2)';

  const ringBg = isDark
    ? isHovering
      ? 'rgba(255, 255, 255, 0.05)'
      : 'transparent'
    : isHovering
    ? 'rgba(10, 10, 12, 0.05)'
    : 'transparent';

  const dotBg = isDark ? '#FFFFFF' : '#0A0A0C';

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998] hidden lg:block"
        aria-hidden="true"
      />

      {/* Trailing Ring */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full transition-transform duration-100 ease-out hidden lg:block"
        style={{
          left: `${trail.x}px`,
          top: `${trail.y}px`,
          width: isHovering ? '48px' : '28px',
          height: isHovering ? '48px' : '28px',
          border: `1px solid ${ringBorder}`,
          backgroundColor: ringBg,
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.85 : 1})`,
          backdropFilter: isHovering ? 'blur(2px)' : 'none',
        }}
        aria-hidden="true"
      />

      {/* Core Dot */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full hidden lg:block transition-all duration-75"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isHovering ? '5px' : '3.5px',
          height: isHovering ? '5px' : '3.5px',
          backgroundColor: dotBg,
          transform: 'translate(-50%, -50%)',
          boxShadow: isDark
            ? '0 0 6px rgba(255, 255, 255, 0.8)'
            : '0 0 6px rgba(0, 0, 0, 0.3)',
        }}
        aria-hidden="true"
      />
    </>
  );
};
