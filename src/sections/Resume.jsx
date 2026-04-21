import { motion } from 'framer-motion';
import { Download, Github, Linkedin, Mail } from 'lucide-react';
import profile from '../data/profile.json';

export function Resume() {
  return (
    <section id="resume" className="py-20" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Glowing backdrop */}
          <div
            className="relative glass-strong rounded-3xl p-10 md:p-14"
            style={{ border: '1px solid var(--border-accent)' }}
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ boxShadow: 'var(--shadow-glow)', opacity: 0.5 }}
              aria-hidden="true"
            />

            <h2 className="font-space font-black text-3xl md:text-4xl gradient-text mb-3">
              Want the full picture?
            </h2>
            <p className="text-base mb-8 max-w-md mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              Download my resume for a complete breakdown of skills, experience, and projects.
            </p>

            {/* CTA button */}
            <a
              href="/resume.pdf"
              download="Romen_Halder_Resume.pdf"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base btn-ripple mb-8 cursor-pointer"
              style={{
                background: 'var(--gradient-accent)',
                color: 'white',
                boxShadow: 'var(--shadow-glow)',
              }}
              aria-label="Download Romen Halder's resume PDF"
            >
              <Download size={20} />
              Download Resume PDF
            </a>

            {/* Social row */}
            <div className="flex items-center justify-center gap-4 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm font-medium"
                style={{ color: 'var(--color-text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Github size={16} /> GitHub
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm font-medium"
                style={{ color: 'var(--color-text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Linkedin size={16} /> LinkedIn
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Send email"
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm font-medium"
                style={{ color: 'var(--color-text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Mail size={16} /> Email
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
