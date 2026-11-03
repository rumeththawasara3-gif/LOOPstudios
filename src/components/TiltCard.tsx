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
  maxTilt = 5,
  onClick,
  spotlightColor = 'rgba(0, 242, 254, 0.12)',
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
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
    setMousePos({ x: percentX, y: percentY });
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
      style={{ perspective: '1200px' }}
      className={`relative group ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div
        className={`relative transition-all duration-300 ease-out will-change-transform rounded-2xl ${className}`}
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px) scale(1.01)`
            : 'rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)',
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? '0 20px 45px -15px rgba(0, 242, 254, 0.18), 0 0 25px -5px rgba(127, 0, 255, 0.12)'
            : 'none',
        }}
      >
        {/* Interactive Mouse Spotlight Radial Glow */}
        <div
          className={`pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}% ${mousePos.y}%, ${spotlightColor}, rgba(127, 0, 255, 0.05) 30%, transparent 60%)`,
          }}
          aria-hidden="true"
        />

        {/* Luminous Top-Lit Specular Edge */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent rounded-t-[inherit] z-20"
          aria-hidden="true"
        />

        {children}
      </div>
    </div>
  );
};
