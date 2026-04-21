import { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SkillPill } from '../components/ui/SkillPill';
import { GraduationCap } from 'lucide-react';
import profile from '../data/profile.json';
import skillsData from '../data/skills.json';

function EducationTimeline() {
  return (
    <div className="relative pl-6 mt-6 space-y-6">
      {/* Vertical line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full timeline-line"
      />

      {profile.education.map((edu, i) => (
        <motion.div
          key={i}
          className="relative"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          {/* Dot */}
          <div
            className="absolute -left-8 w-4 h-4 rounded-full border-2"
            style={{ background: edu.color, borderColor: edu.color, top: '10px', boxShadow: `0 0 8px ${edu.color}` }}
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
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

        <div className="grid lg:grid-cols-2 gap-12 mt-4">
          {/* Left: Bio + Education */}
          <div>
            <motion.div
              className="glass rounded-2xl p-6 mb-6"
              style={{ border: '1px solid var(--border-accent)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
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
          <div>
            <h3 className="font-space font-bold text-lg mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Skill Universe
            </h3>
            <SkillUniverse />
          </div>
        </div>
      </div>
    </section>
  );
}
