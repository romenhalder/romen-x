import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useTypewriter — cycles through an array of strings with typewriter effect
 * @param {string[]} texts - Array of strings to cycle through
 * @param {number} typeSpeed - ms per character (default 80)
 * @param {number} pauseTime - ms to pause at end of each string (default 2000)
 * @param {number} deleteSpeed - ms per character when deleting (default 40)
 */
export function useTypewriter(texts = [], typeSpeed = 80, pauseTime = 2000, deleteSpeed = 40) {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);

  const tick = useCallback(() => {
    if (texts.length === 0) return;
    const currentText = texts[textIndex];

    if (isPaused) {
      setIsPaused(false);
      setIsDeleting(true);
      return;
    }

    if (isDeleting) {
      setDisplayText((prev) => prev.slice(0, -1));
      if (displayText.length === 0) {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    } else {
      setDisplayText(currentText.slice(0, displayText.length + 1));
      if (displayText.length === currentText.length) {
        setIsPaused(true);
      }
    }
  }, [texts, textIndex, displayText, isDeleting, isPaused]);

  useEffect(() => {
    const speed = isPaused ? pauseTime : isDeleting ? deleteSpeed : typeSpeed;
    timeoutRef.current = setTimeout(tick, speed);
    return () => clearTimeout(timeoutRef.current);
  }, [tick, isPaused, isDeleting, typeSpeed, deleteSpeed, pauseTime]);

  return displayText;
}
