import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  onClick?: () => void;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 6,
  onClick,
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
      className={`relative select-none ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div
        className={`relative transition-transform duration-300 ease-out will-change-transform ${className}`}
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-3px)`
            : 'rotateX(0deg) rotateY(0deg) translateY(0px)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Subtle white frosted specular reflection */}
        {isHovered && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-10"
            style={{
              background: `radial-gradient(circle 320px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.06), transparent 70%)`,
            }}
            aria-hidden="true"
          />
        )}
        {children}
      </div>
    </div>
  );
};
