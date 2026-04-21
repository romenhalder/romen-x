import { SectionHeading } from '../components/ui/SectionHeading';
import { TimelineCard } from '../components/ui/TimelineCard';
import experience from '../data/experience.json';

export function Experience() {
  return (
    <section id="experience" className="section py-20" style={{ background: 'var(--color-surface)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          title="Work Experience"
          subtitle="My professional journey — from internships to full-time roles"
        />

        {/* Timeline container */}
        <div className="relative mt-8">
          {/* Center line (desktop) */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 timeline-line rounded-full"
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
