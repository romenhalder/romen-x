import { motion } from 'framer-motion';

// Splits subtitle into words and animates them in one by one
function WordReveal({ text }) {
  const words = text.split(' ');
  return (
    <span aria-label={text} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.28em' }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            variants={{
              hidden: { y: '110%', opacity: 0 },
              visible: {
                y: '0%',
                opacity: 1,
                transition: {
                  delay: i * 0.045,
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
          >
            {word}
          </motion.span>
        </motion.span>
      ))}
    </span>
  );
}

export function SectionHeading({ title, subtitle, centered = true }) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      {/* Clip-path wipe title reveal */}
      <div style={{ overflow: 'hidden' }}>
        <motion.h2
          className="font-space font-bold text-4xl md:text-5xl gradient-text mb-3"
          style={{ lineHeight: 1.2 }}
          initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
          whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          {title}
        </motion.h2>
      </div>

      {subtitle && (
        <p
          className="text-base md:text-lg max-w-2xl"
          style={{
            color: 'var(--color-text-secondary)',
            margin: centered ? '0 auto' : undefined,
          }}
        >
          <WordReveal text={subtitle} />
        </p>
      )}

      {/* Animated accent line */}
      <motion.div
        className={`section-heading-line mt-4 ${centered ? 'mx-auto' : ''}`}
        style={{ height: '3px', borderRadius: '2px', originX: 0 }}
        initial={{ scaleX: 0, width: '0px' }}
        whileInView={{ scaleX: 1, width: '60px' }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      />
    </div>
  );
}
