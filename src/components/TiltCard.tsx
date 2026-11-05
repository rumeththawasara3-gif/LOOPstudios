import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  onClick?: () => void;
  spotlightColor?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 4,
  onClick,
  spotlightColor = 'rgba(0, 242, 254, 0.16)',
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50, pxX: 0, pxY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    const tiltX = (y / rect.height - 0.5) * -maxTilt;
    const tiltY = (x / rect.width - 0.5) * maxTilt;

    setTilt({ x: tiltX, y: tiltY });
    setMousePos({ x: percentX, y: percentY, pxX: x, pxY: y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={
        {
          perspective: '1200px',
          '--mouse-x': `${mousePos.pxX}px`,
          '--mouse-y': `${mousePos.pxY}px`,
        } as React.CSSProperties
      }
      className={`relative group ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div
        className={`relative transition-all duration-300 ease-out will-change-transform rounded-2xl md:rounded-3xl backdrop-blur-2xl bg-white/[0.025] border-t border-white/20 border-x border-white/5 border-b-transparent ${className}`}
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px) scale(1.01)`
            : 'rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)',
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? '0 25px 50px -15px rgba(0, 0, 0, 0.7), 0 0 30px -5px rgba(0, 242, 254, 0.15)'
            : '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Interactive Mouse Spotlight Radial Glow (smoothly follows --mouse-x and --mouse-y) */}
        <div
          className={`pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: `radial-gradient(450px circle at ${mousePos.pxX}px ${mousePos.pxY}px, ${spotlightColor}, rgba(127, 0, 255, 0.04) 40%, transparent 70%)`,
          }}
          aria-hidden="true"
        />

        {/* Luminous Top-Lit Specular Edge */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent rounded-t-[inherit] z-20"
          aria-hidden="true"
        />

        {children}
      </div>
    </div>
  );
};
