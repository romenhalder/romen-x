import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Github, Linkedin, Download, ChevronDown, MapPin, Send } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useTypewriter } from '../hooks/useTypewriter';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { scrollToSection } from '../utils/helpers';
import { ProfilePhoto3D } from '../components/three/ProfilePhoto3D';
import profile from '../data/profile.json';

const OceanBackground = lazy(() => import('../components/three/OceanBackground').then(m => ({ default: m.OceanBackground })));
const SpaceBackground = lazy(() => import('../components/three/SpaceBackground').then(m => ({ default: m.SpaceBackground })));

const TYPEWRITER_TEXTS = [
  'Java Full Stack Developer',
  'Spring Boot 3.x Engineer',
  'React 19 Developer',
  'IoT & ThingsBoard Specialist',
  'Patent Holder',
];

// Animated letter-by-letter name
function AnimatedName() {
  const name = 'ROMEN HALDER';
  return (
    <h1
      className="font-space font-black"
      style={{
        fontSize: 'clamp(2.2rem, 6.5vw, 5.5rem)',
        whiteSpace: 'nowrap',
        lineHeight: 1,
        textShadow: '0 0 30px rgba(14, 165, 233, 0.4), 0 0 60px rgba(199, 125, 255, 0.2)',
        marginBottom: '0.5rem',
      }}
      aria-label="Romen Halder"
    >
      {name.split('').map((char, i) => (
        <motion.span
          key={i}
          className="hero-letter gradient-text"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 + i * 0.03, duration: 0.4, ease: 'easeOut' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </h1>
  );
}

export function Hero() {
  const { theme } = useThemeStore();
  const prefersReduced = useReducedMotion();
  const typedText = useTypewriter(TYPEWRITER_TEXTS, 75, 1800, 40);
  const isOcean = theme === 'ocean';

  const overlayStyle = isOcean
    ? 'linear-gradient(180deg, rgba(240,248,255,0.4) 0%, rgba(240,248,255,0.15) 50%, transparent 100%)'
    : 'linear-gradient(180deg, rgba(3,0,28,0.6) 0%, rgba(3,0,28,0.25) 50%, transparent 100%)';

  return (
    <section id="hero" className="relative" style={{ height: '100dvh', minHeight: '700px' }}>
      {/* Three.js Canvas */}
      {!prefersReduced && (
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <Canvas
            camera={{ position: [0, 1.5, 5], fov: 60 }}
            frameloop="always"
            dpr={[1, Math.min(window.devicePixelRatio, 2)]}
            style={{ background: isOcean ? '#87CEEB' : '#03001C' }}
          >
            <Suspense fallback={null}>
              {isOcean ? <OceanBackground /> : <SpaceBackground />}
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Overlay for text readability */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: overlayStyle }}
        aria-hidden="true"
      />

      {/* Main Content — LEFT: text, RIGHT: large profile photo */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6">
          <div className="grid lg:grid-cols-2 gap-8 items-center">

            {/* LEFT COLUMN — Name, Role, CTAs */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <AnimatedName />

              {/* Subtitle */}
              <motion.p
                className="text-base md:text-lg font-medium mb-2"
                style={{ color: 'var(--color-text-secondary)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                {profile.subtitle}
              </motion.p>

              {/* Location */}
              <motion.div
                className="flex items-center justify-center lg:justify-start gap-1.5 mb-3 text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
              >
                <MapPin size={14} style={{ color: 'var(--color-accent1)' }} />
                Kolkata, India
              </motion.div>

              {/* Typewriter */}
              <motion.div
                className="text-xl md:text-2xl font-space font-bold mb-8 h-9"
                style={{ color: 'var(--color-accent1)', textShadow: '0 0 10px var(--color-accent1)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
              >
                {typedText}
                <span className="typewriter-cursor" aria-hidden="true" />
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                {/* View Projects — neon cyan */}
                <button
                  onClick={() => scrollToSection('projects')}
                  className="hero-btn-neon px-7 py-3 rounded-full font-bold text-sm uppercase tracking-wider cursor-pointer"
                  style={{
                    background: 'rgba(14, 165, 233, 0.08)',
                    color: '#0EA5E9',
                    border: '1.5px solid rgba(14, 165, 233, 0.6)',
                    boxShadow: '0 0 12px rgba(14, 165, 233, 0.3), inset 0 0 12px rgba(14, 165, 233, 0.08)',
                    textShadow: '0 0 8px rgba(14,165,233,0.5)',
                    transition: 'all 0.3s ease',
                  }}
                  aria-label="View projects"
                >
                  View Projects
                </button>

                {/* Contact Me — neon purple */}
                <button
                  onClick={() => scrollToSection('contact')}
                  className="hero-btn-neon px-7 py-3 rounded-full font-bold text-sm uppercase tracking-wider cursor-pointer flex items-center gap-2"
                  style={{
                    background: 'rgba(199, 125, 255, 0.08)',
                    color: '#C77DFF',
                    border: '1.5px solid rgba(199, 125, 255, 0.6)',
                    boxShadow: '0 0 12px rgba(199, 125, 255, 0.3), inset 0 0 12px rgba(199, 125, 255, 0.08)',
                    textShadow: '0 0 8px rgba(199,125,255,0.5)',
                    transition: 'all 0.3s ease',
                  }}
                  aria-label="Contact me"
                >
                  <Send size={14} /> Contact Me
                </button>

                {/* Download CV — glass */}
                <a
                  href="/resume.pdf"
                  download="Romen_Halder_Resume.pdf"
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm glass"
                  style={{ color: 'var(--color-accent1)', border: '1px solid var(--border-accent)' }}
                  aria-label="Download resume PDF"
                >
                  <Download size={14} /> Download CV
                </a>
              </motion.div>

              {/* Social + Status */}
              <motion.div
                className="flex flex-wrap gap-3 items-center justify-center lg:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.05 }}
              >
                <a href={profile.github} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass text-sm font-medium"
                  style={{ color: 'var(--color-text-primary)', border: '1px solid var(--color-glass-border)' }}
                  aria-label="GitHub profile">
                  <Github size={15} /> GitHub
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass text-sm font-medium"
                  style={{ color: 'var(--color-text-primary)', border: '1px solid var(--color-glass-border)' }}
                  aria-label="LinkedIn profile">
                  <Linkedin size={15} /> LinkedIn
                </a>

                {/* Availability */}
                <div className="flex items-center gap-2 text-xs font-medium ml-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e', animation: 'pulseGlow 2s infinite' }}
                  />
                  <span style={{ color: '#22c55e' }}>Available mid-2026</span>
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN — Large Profile Photo */}
            <div className="flex items-center justify-center order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.75, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.4, type: 'spring', bounce: 0.35, duration: 0.8 }}
              >
                <ProfilePhoto3D size={typeof window !== 'undefined' && window.innerWidth < 640 ? 280 : 420} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1" aria-hidden="true">
        <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)', opacity: 0.7 }}>
          scroll to explore
        </p>
        <ChevronDown size={20} className="scroll-indicator" style={{ color: 'var(--color-accent1)' }} />
      </div>

      {/* Neon button hover style */}
      <style>{`
        .hero-btn-neon:hover {
          filter: brightness(1.3);
          transform: translateY(-1px);
        }
        .hero-btn-neon:active {
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
}
