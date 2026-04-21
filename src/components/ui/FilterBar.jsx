import { motion, AnimatePresence } from 'framer-motion';

const FILTERS = ['All', 'Spring Boot', 'React', 'IoT', 'Full Stack', 'Patent'];

export function FilterBar({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      {FILTERS.map((filter) => (
        <motion.button
          key={filter}
          onClick={() => onChange(filter)}
          aria-pressed={active === filter}
          className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer overflow-hidden"
          style={{
            color: active === filter ? 'white' : 'var(--color-text-secondary)',
            border: `1px solid ${active === filter ? 'var(--color-accent1)' : 'rgba(255,255,255,0.1)'}`,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {active === filter && (
            <motion.div
              layoutId="filter-bg"
              className="absolute inset-0 rounded-full"
              style={{ background: 'var(--gradient-accent)' }}
              transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{filter}</span>
        </motion.button>
      ))}
    </div>
  );
}
