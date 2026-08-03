import { motion } from 'framer-motion';
import { SectionHeading } from '../components/ui/SectionHeading';
import { TimelineCard } from '../components/ui/TimelineCard';
import experience from '../data/experience.json';

export function Experience() {
  return (
    <section id="experience" className="section section-alt py-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          title="Work Experience"
          subtitle="My professional journey — from internships to full-time roles"
        />

        {/* Timeline container */}
        <div className="relative mt-8">
          {/* Animated center line (desktop) — draws from top to bottom */}
          <motion.div
            className="hidden md:block absolute left-1/2 top-0 w-0.5 -translate-x-1/2 timeline-line rounded-full"
            style={{ originY: 0 }}
            initial={{ scaleY: 0, height: '100%' }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-5%' }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
          />

          <div className="space-y-8">
            {experience.map((exp, i) => (
              <TimelineCard
                key={exp.id}
                experience={exp}
                index={i}
                isLeft={i % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
