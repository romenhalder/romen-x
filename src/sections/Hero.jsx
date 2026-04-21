import { Suspense, lazy, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Github, Linkedin, Download, ChevronDown, Sparkles, MapPin } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useTypewriter } from '../hooks/useTypewriter';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useCountUp } from '../hooks/useCountUp';
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
      className="font-space font-black leading-none mb-3"
      style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)' }}
      aria-label="Romen Halder"
    >
      {name.split('').map((char, i) => (
        <motion.span
          key={i}
          className="hero-letter gradient-text"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.04, duration: 0.4, ease: 'easeOut' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </h1>
  );
}

// Stat counter card
function StatCard({ stat, index }) {
  const count = useCountUp(stat.value, 1500, true);
  return (
    <motion.div
      className="glass rounded-2xl px-5 py-4 text-center"
      style={{ border: '1px solid var(--color-glass-border)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 + index * 0.1 }}
    >
      <div className="font-black text-2xl font-space gradient-text">
        {count}{stat.suffix}
      </div>
      <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
        {stat.label}
      </div>
    </motion.div>
  );
}

export function Hero() {
  const { theme } = useThemeStore();
  const prefersReduced = useReducedMotion();
  const typedText = useTypewriter(TYPEWRITER_TEXTS, 75, 1800, 40);
  const isOcean = theme === 'ocean';

  // Ocean theme — lighter overlay; Space — darker
  const overlayStyle = isOcean
    ? 'linear-gradient(135deg, rgba(240,248,255,0.5) 0%, rgba(240,248,255,0.2) 60%, transparent 100%)'
    : 'linear-gradient(135deg, rgba(3,0,28,0.7) 0%, rgba(3,0,28,0.35) 60%, transparent 100%)';

  return (
    <section id="hero" className="relative" style={{ height: '100dvh', minHeight: '600px' }}>
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

      {/* Gradient overlay for readability */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: overlayStyle }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 pt-16 pb-20">
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">

            {/* LEFT */}
            <div className="text-center lg:text-left max-w-2xl">
              {/* Patent badge */}
              <motion.div
                className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-semibold patent-glow"
                style={{
                  background: 'rgba(255,215,0,0.15)',
                  color: '#B8860B',
                  border: '1px solid rgba(255,215,0,0.45)',
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
              >
                <Sparkles size={12} className="animate-sparkle" aria-hidden="true" />
                ⚡ Patent No. 202531058380 — Granted 2025
              </motion.div>

              <AnimatedName />

              {/* Subtitle */}
              <motion.p
                className="text-base md:text-lg font-medium mb-3"
                style={{ color: 'var(--color-text-secondary)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
              >
                {profile.subtitle}
              </motion.p>

              {/* Location */}
              <motion.div
                className="flex items-center justify-center lg:justify-start gap-1.5 mb-4 text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
              >
                <MapPin size={14} style={{ color: 'var(--color-accent1)' }} />
                Kolkata, India
              </motion.div>

              {/* Typewriter */}
              <motion.div
                className="text-xl md:text-2xl font-space font-bold mb-6 h-9"
                style={{ color: 'var(--color-accent1)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {typedText}
                <span className="typewriter-cursor" aria-hidden="true" />
              </motion.div>

              {/* CTAs */}
              <motion.div
                className="flex flex-wrap gap-3 justify-center lg:justify-start mb-5"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <button
                  onClick={() => scrollToSection('projects')}
                  className="px-6 py-3 rounded-xl font-semibold text-sm btn-ripple cursor-pointer"
                  style={{ background: 'var(--gradient-accent)', color: 'white' }}
                  aria-label="View my work - scroll to projects"
                >
                  View My Work
                </button>
                <a
                  href="/resume.pdf"
                  download="Romen_Halder_Resume.pdf"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm glass"
                  style={{ color: 'var(--color-accent1)', border: '1px solid var(--border-accent)' }}
                  aria-label="Download resume PDF"
                >
                  <Download size={15} /> Download CV
                </a>
              </motion.div>

              {/* Social links */}
              <motion.div
                className="flex gap-3 justify-center lg:justify-start mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.25 }}
              >
                <a href={profile.github} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass text-sm font-medium card-glow"
                  style={{ color: 'var(--color-text-primary)', border: '1px solid var(--color-glass-border)' }}
                  aria-label="GitHub profile">
                  <Github size={16} /> GitHub
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass text-sm font-medium card-glow"
                  style={{ color: 'var(--color-text-primary)', border: '1px solid var(--color-glass-border)' }}
                  aria-label="LinkedIn profile">
                  <Linkedin size={16} /> LinkedIn
                </a>
              </motion.div>

              {/* Availability badge */}
              <motion.div
                className="inline-flex items-center gap-2 text-xs font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.35 }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e', animation: 'pulseGlow 2s infinite' }}
                />
                <span style={{ color: '#22c55e' }}>Open to full-time roles from mid-2026</span>
              </motion.div>
            </div>

            {/* RIGHT — 3D Photo + Stats */}
            <div className="flex flex-col items-center gap-6">
              {/* 3D Profile Photo */}
              <motion.div
                className="animate-float"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: 'spring', bounce: 0.4 }}
              >
                <ProfilePhoto3D size={typeof window !== 'undefined' && window.innerWidth < 640 ? 170 : 210} />
              </motion.div>

              {/* Photo hint */}
              <motion.p
                className="text-xs text-center max-w-[200px]"
                style={{ color: 'var(--color-text-secondary)', opacity: 0.7 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1.5 }}
              >
                💡 Place photo at{' '}
                <code className="text-xs" style={{ color: 'var(--color-accent1)' }}>src/assets/profile-photo.jpg</code>
              </motion.p>

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-3 w-full">
                {profile.stats.map((stat, i) => (
                  <StatCard key={stat.label} stat={stat} index={i} />
                ))}
              </div>
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
    </section>
  );
}
