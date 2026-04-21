import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    // Don't show on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const handleMouseMove = (e) => {
      dotPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnterLink = () => {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    };

    const handleMouseLeaveLink = () => {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    };

    const addHoverListeners = () => {
      document.querySelectorAll('a, button, [role="button"], [tabindex]').forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnterLink);
        el.addEventListener('mouseleave', handleMouseLeaveLink);
      });
    };

    const animate = () => {
      // Dot: fast follow
      ringPos.current.x = lerp(ringPos.current.x, dotPos.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, dotPos.current.y, 0.12);

      dot.style.left = `${dotPos.current.x}px`;
      dot.style.top = `${dotPos.current.y}px`;
      ring.style.left = `${ringPos.current.x}px`;
      ring.style.top = `${ringPos.current.y}px`;

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    addHoverListeners();

    // Re-add listeners when DOM changes
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div id="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}
