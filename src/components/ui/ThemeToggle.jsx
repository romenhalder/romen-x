import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const isOcean = theme === 'ocean';

  return (
    <motion.button
      id="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isOcean ? 'Deep Space Night' : 'Ocean Day'} theme`}
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
        border: isOcean ? '1px solid rgba(14,165,233,0.4)' : '1px solid rgba(199,125,255,0.4)',
        background: isOcean ? 'rgba(255,255,255,0.85)' : 'rgba(10,5,40,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        color: isOcean ? '#0EA5E9' : '#C77DFF',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        fontWeight: 600,
        boxShadow: isOcean
          ? '0 4px 20px rgba(14,165,233,0.2)'
          : '0 4px 20px rgba(199,125,255,0.25)',
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
          {isOcean ? <Moon size={16} /> : <Sun size={16} />}
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
          {isOcean ? 'Night' : 'Day'}
        </motion.span>
      </AnimatePresence>

      <style>{`
        @media (min-width: 480px) { .sm-visible { display: inline !important; } }
      `}</style>
    </motion.button>
  );
}
