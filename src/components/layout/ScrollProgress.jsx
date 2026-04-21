import { useEffect, useRef } from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress';

export function ScrollProgress() {
  const progress = useScrollProgress();
  const barRef = useRef(null);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = `${progress * 100}%`;
    }
  }, [progress]);

  return (
    <div
      id="scroll-progress"
      ref={barRef}
      aria-hidden="true"
      style={{ width: '0%' }}
    />
  );
}
