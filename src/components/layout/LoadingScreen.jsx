import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Simulate loading with progress
    const steps = [20, 40, 60, 80, 100];
    let i = 0;
    const timer = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setVisible(false);
          onComplete?.();
        }, 400);
      }
    }, 300);

    // Force complete after 3s max
    const maxTimer = setTimeout(() => {
      clearInterval(timer);
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 400);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(maxTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loading-screen"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated RH logo */}
          <motion.div
            className="mb-10 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <svg width="100" height="100" viewBox="0 0 100 100" aria-label="Romen Halder logo">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'var(--color-accent1)' }} />
                  <stop offset="100%" style={{ stopColor: 'var(--color-accent2)' }} />
                </linearGradient>
              </defs>
              {/* Background circle */}
              <circle cx="50" cy="50" r="46" fill="none" stroke="url(#logoGrad)" strokeWidth="2" opacity="0.3" />
              {/* Animated ring */}
              <circle
                cx="50" cy="50" r="46"
                fill="none"
                stroke="url(#logoGrad)"
                strokeWidth="2"
                className="avatar-ring-svg"
                style={{ strokeDasharray: 289, strokeDashoffset: 289 }}
              />
              {/* RH text */}
              <text x="50" y="57" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="28" fill="url(#logoGrad)">
                RH
              </text>
            </svg>
          </motion.div>

          <motion.p
            className="text-sm font-mono mb-8"
            style={{ color: 'var(--color-text-secondary)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading portfolio...
          </motion.p>

          {/* Progress bar */}
          <div
            className="w-48 h-1 rounded-full overflow-hidden"
            style={{ background: 'var(--color-surface)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--gradient-accent)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <motion.p
            className="text-xs mt-3 font-mono"
            style={{ color: 'var(--color-accent1)' }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {progress}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
