import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SkillPill } from '../components/ui/SkillPill';
import { GraduationCap, Code2, Briefcase, Award } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';
import profile from '../data/profile.json';
import skillsData from '../data/skills.json';

// Stats counter card
function StatCard({ value, suffix = '', label, icon: Icon, delay = 0 }) {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });
  const count = useCountUp(value, 1800, inView);

  return (
    <motion.div
      ref={ref}
      className="glass rounded-2xl p-5 flex flex-col items-center text-center card-glow"
      style={{ border: '1px solid var(--border-accent)' }}
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-accent)' }}
      >
        <Icon size={18} style={{ color: 'var(--color-accent1)' }} />
      </div>
      <div
        className="font-space font-black text-3xl gradient-text"
        style={{ lineHeight: 1 }}
        aria-label={`${count}${suffix} ${label}`}
      >
        {count}{suffix}
      </div>
      <p className="text-xs mt-1.5 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </p>
    </motion.div>
  );
}

function EducationTimeline() {
  return (
    <div className="relative pl-6 mt-6 space-y-6">
      {/* Animated vertical line */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full timeline-line"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ originY: 0 }}
      />

      {profile.education.map((edu, i) => (
        <motion.div
          key={i}
          className="relative"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12 + 0.2, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Dot — pops in after line draws */}
          <motion.div
            className="absolute -left-8 w-4 h-4 rounded-full border-2"
            style={{ background: edu.color, borderColor: edu.color, top: '10px', boxShadow: `0 0 8px ${edu.color}` }}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 + 0.5, type: 'spring', bounce: 0.5 }}
          />
          <div
            className="glass rounded-xl p-4"
            style={{ border: `1px solid ${edu.color}25` }}
          >
            <div className="flex items-start gap-2">
              <GraduationCap size={16} style={{ color: edu.color, marginTop: '2px', flexShrink: 0 }} />
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>{edu.degree}</p>
                <p className="text-xs" style={{ color: edu.color }}>{edu.institution}</p>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <span className="text-xs font-mono" style={{ color: 'var(--color-text-secondary)' }}>{edu.period}</span>
                  <span className="text-xs font-semibold" style={{ color: edu.color }}>{edu.score}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SkillUniverse() {
  const [activeTab, setActiveTab] = useState(skillsData.tabs[0].id);
  const currentTab = skillsData.tabs.find((t) => t.id === activeTab);

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {skillsData.tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${activeTab === tab.id ? 'skill-tab-active' : 'glass'}`}
            style={{
              border: `1px solid ${activeTab === tab.id ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
              color: activeTab === tab.id ? 'white' : 'var(--color-text-secondary)',
            }}
            aria-pressed={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pills */}
      <motion.div
        key={activeTab}
        className="flex flex-wrap gap-3 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {currentTab?.skills.map((skill, i) => (
          <SkillPill key={skill.name} skill={skill} index={i} />
        ))}
      </motion.div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="section pt-24 pb-20" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading title="About Me" subtitle="A little about who I am and what drives me" />

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard value={2}  suffix="+"  label="Years Experience" icon={Briefcase} delay={0}    />
          <StatCard value={6}  suffix=""   label="Projects Built"   icon={Code2}     delay={0.08} />
          <StatCard value={1}  suffix=""   label="Granted Patent"   icon={Award}     delay={0.16} />
          <StatCard value={10} suffix="+"  label="Technologies"     icon={Code2}     delay={0.24} />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mt-4">
          {/* Left: Bio + Education */}
          <div>
            <motion.div
              className="glass rounded-2xl p-6 mb-6"
              style={{ border: '1px solid var(--border-accent)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {profile.summary}
              </p>
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Languages: </span>
                    <span className="font-medium" style={{ color: 'var(--color-accent1)' }}>
                      {profile.languages.join(' · ')}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Availability: </span>
                    <span className="font-medium" style={{ color: '#22c55e' }}>{profile.availability}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <h3 className="font-space font-bold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Education
            </h3>
            <EducationTimeline />
          </div>

          {/* Right: Skills Universe */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <h3 className="font-space font-bold text-lg mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Skill Universe
            </h3>
            <SkillUniverse />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
