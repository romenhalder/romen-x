import { Github, Linkedin, Mail } from 'lucide-react';
import profile from '../../data/profile.json';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: 'var(--color-surface)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Wave divider */}
      <div className="wave-container" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: 'block', height: '60px', width: '100%' }}>
          <path
            d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,0 L0,0 Z"
            style={{ fill: 'var(--color-bg)' }}
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 text-center">
        {/* Social icons */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className="p-3 rounded-full glass card-glow"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <Github size={20} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile"
            className="p-3 rounded-full glass card-glow"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <Linkedin size={20} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Send email"
            className="p-3 rounded-full glass card-glow"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <Mail size={20} />
          </a>
        </div>

        {/* Built by */}
        <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          Built with{' '}
          <span style={{ color: '#FF6B9D' }}>♥</span>{' '}
          by{' '}
          <span className="font-semibold gradient-text">{profile.name}</span>
        </p>

        {/* Stack credits */}
        <p className="text-xs mb-4" style={{ color: 'var(--color-text-secondary)', opacity: 0.6 }}>
          React · Three.js · Framer Motion · Tailwind CSS
        </p>

        {/* Copyright */}
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)', opacity: 0.45 }}>
          © {currentYear} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
