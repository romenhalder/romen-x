import { motion } from 'framer-motion';

export function SectionHeading({ title, subtitle, centered = true }) {
  return (
    <motion.div
      className={`mb-12 ${centered ? 'text-center' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2
        className="font-space font-bold text-4xl md:text-5xl gradient-text mb-3"
        style={{ lineHeight: 1.2 }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-base md:text-lg max-w-2xl"
          style={{ color: 'var(--color-text-secondary)', margin: centered ? '0 auto' : undefined }}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`section-heading-line mt-4 ${centered ? 'mx-auto' : ''}`}
        style={{ width: '60px' }}
      />
    </motion.div>
  );
}
