import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Zap, Shield, Award } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';

const PATENT = {
  title: 'Integrated Geolocation Model for Electric Vehicle Charging Networks',
  number: '202531058380',
  year: '2025',
  role: 'Backend Developer',
  tech: 'Java Spring Boot · REST APIs',
};

const STATS = [
  { label: 'Patent', value: 1, suffix: '', icon: Award, color: '#FFD700' },
  { label: 'Projects', value: 5, suffix: '+', icon: Zap, color: '#FF6B9D' },
  { label: 'Degrees', value: 2, suffix: '', icon: Shield, color: '#C77DFF' },
];

function StatCounter({ stat, trigger }) {
  const count = useCountUp(stat.value, 1800, trigger);
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
        style={{ background: `${stat.color}20`, border: `1px solid ${stat.color}50` }}
      >
        <stat.icon size={24} style={{ color: stat.color }} />
      </div>
      <div className="text-4xl font-black font-space" style={{ color: stat.color }}>
        {count}{stat.suffix}
      </div>
      <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{stat.label}</div>
    </div>
  );
}

export function PatentShowcase() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section
      id="patent"
      ref={ref}
      className="py-20 circuit-pattern relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a0a00, #2d1a00, #1a0a00)' }}
    >
      {/* Amber glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.08) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Patent badge icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
          className="inline-flex items-center justify-center mb-6"
        >
          <svg width="80" height="80" viewBox="0 0 80 80" aria-label="Patent shield icon">
            <defs>
              <linearGradient id="patentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FF8C00" />
              </linearGradient>
            </defs>
            <path
              d="M40 8 L68 20 L68 44 C68 58 55 68 40 72 C25 68 12 58 12 44 L12 20 Z"
              fill="none"
              stroke="url(#patentGrad)"
              strokeWidth="2.5"
              opacity="0.8"
            />
            <path
              d="M40 8 L68 20 L68 44 C68 58 55 68 40 72 C25 68 12 58 12 44 L12 20 Z"
              fill="rgba(255,215,0,0.08)"
            />
            <path
              d="M32 38 L38 44 L50 32"
              stroke="url(#patentGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M40 20 L40 26 M36 24 L40 20 L44 24"
              stroke="url(#patentGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div
            className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.4)' }}
          >
            🏆 GRANTED PATENT
          </div>
          <h2
            className="font-space font-black text-3xl md:text-4xl mb-2 leading-tight"
            style={{ color: '#FFD700' }}
          >
            {PATENT.title}
          </h2>
        </motion.div>

        {/* Patent details */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-6 mb-10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          {[
            { label: 'Patent No.', value: PATENT.number },
            { label: 'Year Granted', value: PATENT.year },
            { label: 'My Role', value: PATENT.role },
            { label: 'Tech Used', value: PATENT.tech },
          ].map((item) => (
            <div
              key={item.label}
              className="glass rounded-xl px-5 py-3 text-center"
              style={{ border: '1px solid rgba(255,215,0,0.2)' }}
            >
              <p className="text-xs font-medium" style={{ color: 'rgba(255,215,0,0.6)' }}>{item.label}</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: '#FFD700' }}>{item.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Animated stat counters */}
        <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
          {STATS.map((stat) => (
            <StatCounter key={stat.label} stat={stat} trigger={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
