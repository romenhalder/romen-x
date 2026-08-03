import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { Sun, Contrast } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const isArtBW = theme === 'artbw';

  return (
    <motion.button
      id="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isArtBW ? 'Crimson Noir' : 'Artistic B&W'} theme`}
      className="no-transition"
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '999px',
        border: isArtBW
          ? '1px solid rgba(255,255,255,0.25)'
          : '1px solid rgba(255,42,84,0.40)',
        background: isArtBW
          ? 'rgba(16, 16, 16, 0.95)'
          : 'rgba(16,8,14,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        color: isArtBW ? '#FFFFFF' : '#FF2A54',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        fontWeight: 600,
        boxShadow: isArtBW
          ? '0 4px 20px rgba(255,255,255,0.10)'
          : '0 4px 20px rgba(255,42,84,0.28)',
        minWidth: '44px',
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          {isArtBW ? <Sun size={16} /> : <Contrast size={16} />}
        </motion.span>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.span
          key={theme + '_label'}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 6 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'none' }}
          className="sm-visible"
        >
          {isArtBW ? 'Color' : 'B&W'}
        </motion.span>
      </AnimatePresence>

      <style>{`
        @media (min-width: 480px) { .sm-visible { display: inline !important; } }
      `}</style>
    </motion.button>
  );
}
