import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

export function SkillPill({ skill, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative inline-flex flex-col items-start cursor-default"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: index * 0.04 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.div
        className="glass rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium relative overflow-hidden"
        style={{
          border: `1px solid ${hovered ? 'var(--color-accent1)' : 'rgba(255,255,255,0.1)'}`,
          color: hovered ? 'var(--color-accent1)' : 'var(--color-text-primary)',
          minWidth: '120px',
        }}
        whileHover={{ scale: 1.05 }}
        layout
      >
        {skill.primary && (
          <Star size={12} fill="currentColor" style={{ color: '#FFD700' }} />
        )}
        <span>{skill.name}</span>

        {/* Proficiency bar on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 rounded-full"
              style={{ background: 'var(--gradient-accent)' }}
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              exit={{ width: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Proficiency tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute -bottom-7 left-0 glass rounded-md px-2 py-1 text-xs whitespace-nowrap z-10"
            style={{ color: 'var(--color-accent1)' }}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            {skill.level}% proficiency
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
