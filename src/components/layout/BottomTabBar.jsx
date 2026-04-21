import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, FolderOpen, Image, Mail, Sun } from 'lucide-react';
import { scrollToSection } from '../../utils/helpers';
import { useThemeStore } from '../../store/themeStore';

const TABS = [
  { icon: Home, label: 'Home', section: 'hero' },
  { icon: FolderOpen, label: 'Projects', section: 'projects' },
  { icon: Image, label: 'Gallery', section: 'gallery' },
  { icon: Mail, label: 'Contact', section: 'contact' },
];

export function BottomTabBar() {
  const [activeSection, setActiveSection] = useState('hero');
  const { toggleTheme } = useThemeStore();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'experience', 'projects', 'patent', 'gallery', 'resume', 'contact'];
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
    <div className="bottom-tab-bar lg:hidden" aria-label="Mobile navigation">
      <div className="flex items-center justify-around px-2 py-2">
        {TABS.map(({ icon: Icon, label, section }) => {
          const isActive = activeSection === section;
          return (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              aria-label={label}
              className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl cursor-pointer relative"
              style={{ color: isActive ? 'var(--color-accent1)' : 'var(--color-text-secondary)' }}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-active"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'var(--color-accent1)', opacity: 0.12 }}
                />
              )}
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl cursor-pointer"
          style={{ color: 'var(--color-accent1)' }}
        >
          <Sun size={20} />
          <span className="text-xs font-medium">Theme</span>
        </button>
      </div>
    </div>
  );
}
