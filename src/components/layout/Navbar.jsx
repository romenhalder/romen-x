import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { scrollToSection } from '../../utils/helpers';
import { useThemeStore } from '../../store/themeStore';

const NAV_LINKS = [
  { label: 'Home', section: 'hero' },
  { label: 'About', section: 'about' },
  { label: 'Experience', section: 'experience' },
  { label: 'Projects', section: 'projects' },
  { label: 'Gallery', section: 'gallery' },
  { label: 'Contact', section: 'contact' },
];

export function Navbar({ mobileMenuOpen, setMobileMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Detect active section
      const sections = NAV_LINKS.map((l) => l.section);
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            aria-label="Go to top"
            className="relative w-10 h-10 flex items-center justify-center cursor-pointer"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
              <circle cx="20" cy="20" r="18" fill="none" stroke="var(--color-accent1)" strokeWidth="1.5" opacity="0.5" />
              <circle
                cx="20" cy="20" r="18"
                fill="none"
                stroke="var(--color-accent1)"
                strokeWidth="1.5"
                strokeDasharray="113"
                strokeDashoffset="113"
                className="avatar-ring-svg"
              />
              <text x="20" y="25" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="13" fill="var(--color-accent1)">
                RH
              </text>
            </svg>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.section}
                onClick={() => scrollToSection(link.section)}
                className="relative px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
                style={{ color: activeSection === link.section ? 'var(--color-accent1)' : 'var(--color-text-secondary)' }}
                aria-current={activeSection === link.section ? 'page' : undefined}
              >
                {link.label}
                {activeSection === link.section && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                    style={{ background: 'var(--gradient-accent)' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToSection('contact')}
              className="hidden lg:flex items-center px-4 py-2 rounded-full text-sm font-semibold btn-ripple cursor-pointer"
              style={{ background: 'var(--gradient-accent)', color: 'white' }}
              aria-label="Hire me - go to contact"
            >
              Hire Me
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg glass cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              style={{ color: 'var(--color-text-primary)' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileMenuOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
