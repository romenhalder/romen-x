import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Building, Code, Trophy, Zap, Award } from 'lucide-react';

const ICON_MAP = {
  coffee: Coffee,
  building: Building,
  code: Code,
  trophy: Trophy,
  zap: Zap,
};

export function AchievementCard({ achievement, index }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const Icon = ICON_MAP[achievement.icon] || Award;

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 10;
    setTilt({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  return (
    <motion.div
      ref={cardRef}
      className="masonry-item"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <div
        className="glass rounded-2xl p-5 tilt-card group cursor-default"
        style={{
          border: `1px solid ${achievement.color}30`,
          transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transition: 'transform 0.15s ease, box-shadow 0.3s ease',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Glow on hover */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            boxShadow: `0 0 25px ${achievement.color}30`,
            transition: 'opacity 0.3s ease',
          }}
        />

        <div className="flex items-start gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${achievement.color}20`, border: `1px solid ${achievement.color}50` }}
          >
            <Icon size={20} style={{ color: achievement.color }} />
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-snug" style={{ color: 'var(--color-text-primary)' }}>
              {achievement.title}
            </h3>
            <p className="text-xs mt-1" style={{ color: achievement.color }}>
              {achievement.issuer}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
              {achievement.date}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
