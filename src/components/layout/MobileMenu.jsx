import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { scrollToSection } from '../../utils/helpers';

const NAV_LINKS = [
  { label: 'Home', section: 'hero' },
  { label: 'About', section: 'about' },
  { label: 'Experience', section: 'experience' },
  { label: 'Projects', section: 'projects' },
  { label: 'Gallery', section: 'gallery' },
  { label: 'Contact', section: 'contact' },
];

export function MobileMenu({ isOpen, onClose }) {
  const handleNav = (section) => {
    scrollToSection(section);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Menu panel */}
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-72 glass-strong flex flex-col"
            style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="font-space font-bold gradient-text text-lg">Menu</span>
              <button onClick={onClose} className="p-2 rounded-lg glass cursor-pointer" aria-label="Close menu">
                <X size={18} style={{ color: 'var(--color-text-secondary)' }} />
              </button>
            </div>

            <nav className="flex-1 px-6 py-8">
              <ul className="space-y-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.section}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <button
                      onClick={() => handleNav(link.section)}
                      className="w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors cursor-pointer"
                      style={{ color: 'var(--color-text-primary)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent1)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
                    >
                      {link.label}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="p-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => handleNav('contact')}
                className="w-full py-3 rounded-xl font-semibold text-sm btn-ripple cursor-pointer"
                style={{ background: 'var(--gradient-accent)', color: 'white' }}
              >
                Hire Me
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
