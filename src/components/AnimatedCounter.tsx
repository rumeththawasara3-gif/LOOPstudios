import React, { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  duration = 750,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const prevValueRef = useRef<number>(0);
  const hasAnimatedInRef = useRef<boolean>(false);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const startValue = prevValueRef.current;
    const targetValue = value;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Quartic ease out
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(startValue + (targetValue - startValue) * ease);

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        prevValueRef.current = targetValue;
      }
    };

    // IntersectionObserver to only roll on first viewport entry or value update
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimatedInRef.current) {
          hasAnimatedInRef.current = true;
          animationFrameId = requestAnimationFrame(animate);
        } else if (hasAnimatedInRef.current && startValue !== targetValue) {
          animationFrameId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [value, duration]);

  return (
    <span ref={containerRef} className={`tabular-nums ${className}`}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};
