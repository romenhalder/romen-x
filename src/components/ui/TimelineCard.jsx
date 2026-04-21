import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Code, Server, ChevronDown, Briefcase } from 'lucide-react';

const ICONS = {
  shield: Shield,
  code: Code,
  server: Server,
};

export function TimelineCard({ experience, index, isLeft }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = ICONS[experience.icon] || Briefcase;

  return (
    <motion.div
      className={`flex gap-6 md:gap-0 ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'} items-start`}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
    >
      {/* Card */}
      <div className={`flex-1 ${isLeft ? 'md:pr-10' : 'md:pl-10'}`}>
        <motion.div
          className="glass rounded-2xl overflow-hidden cursor-pointer card-glow"
          style={{ border: `1px solid ${experience.color}30` }}
          onClick={() => setExpanded(!expanded)}
          whileHover={{ scale: 1.01 }}
        >
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${experience.color}20`, border: `1px solid ${experience.color}50` }}
                >
                  <Icon size={18} style={{ color: experience.color }} />
                </div>
                <div>
                  <h3 className="font-space font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
                    {experience.role}
                  </h3>
                  <p className="text-sm font-medium" style={{ color: experience.color }}>
                    {experience.company}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end flex-shrink-0">
                <span
                  className="text-xs font-mono px-2 py-1 rounded-full"
                  style={{ background: `${experience.color}15`, color: experience.color }}
                >
                  {experience.type}
                </span>
                <span className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  {experience.period}
                </span>
              </div>
            </div>

            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              className="flex justify-center mt-3"
            >
              <ChevronDown size={16} style={{ color: 'var(--color-text-secondary)' }} />
            </motion.div>
          </div>

          {/* Expanded bullets */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div
                  className="px-6 pb-6"
                  style={{ borderTop: `1px solid ${experience.color}20` }}
                >
                  <ul className="mt-4 space-y-2">
                    {experience.bullets.map((bullet, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-2 text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: experience.color }} />
                        {bullet}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Timeline dot (visible on md+) */}
      <div className="hidden md:flex flex-col items-center flex-shrink-0" style={{ width: '40px' }}>
        <div
          className="w-4 h-4 rounded-full border-2 z-10"
          style={{
            background: experience.color,
            borderColor: experience.color,
            boxShadow: `0 0 12px ${experience.color}`,
            marginTop: '28px',
          }}
        />
      </div>
    </motion.div>
  );
}
