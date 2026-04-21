import { useState, useEffect, useRef } from 'react';

/**
 * useMouseParallax — tracks mouse position normalized from -1 to 1
 * @param {number} speed - Parallax strength multiplier (default 1)
 */
export function useMouseParallax(speed = 1) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      targetRef.current = {
        x: ((e.clientX / window.innerWidth) * 2 - 1) * speed,
        y: -((e.clientY / window.innerHeight) * 2 - 1) * speed,
      };
    };

    // Device orientation support for mobile
    const handleOrientation = (e) => {
      if (e.beta !== null && e.gamma !== null) {
        targetRef.current = {
          x: (e.gamma / 45) * speed,
          y: -(e.beta / 45) * speed,
        };
      }
    };

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      currentRef.current = {
        x: lerp(currentRef.current.x, targetRef.current.x, 0.05),
        y: lerp(currentRef.current.y, targetRef.current.y, 0.05),
      };
      setPosition({ ...currentRef.current });
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleOrientation);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [speed]);

  return position;
}
