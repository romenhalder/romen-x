import { useState, useEffect, useRef } from 'react';

/**
 * useCountUp — animates a number from 0 to `end` using requestAnimationFrame
 * @param {number} end - Target value
 * @param {number} duration - Animation duration in ms (default 2000)
 * @param {boolean} trigger - Start animation when true
 */
export function useCountUp(end, duration = 2000, trigger = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;

    startTimeRef.current = null;

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, trigger]);

  return count;
}
