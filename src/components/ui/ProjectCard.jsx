import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, BookOpen, Zap, Camera, Image } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';

function ScreenshotThumbnail({ project }) {
  const screenshots = useProjectStore((s) => s.getScreenshots(project.id));
  const firstShot = screenshots[0];
  const count = screenshots.length;

  if (firstShot) {
    return (
      <div className="relative overflow-hidden" style={{ height: '172px' }}>
        <img
          src={firstShot.src}
          alt={`${project.title} screenshot`}
          className="project-thumbnail"
          style={{ width: '100%', height: '172px', objectFit: 'cover', display: 'block' }}
        />
        {count > 1 && (
          <div
            className="absolute bottom-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(0,0,0,0.65)', color: 'white' }}
          >
            1 of {count}
          </div>
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.25))' }}
        />
      </div>
    );
  }

  // Gradient placeholder
  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        height: '172px',
        background: `linear-gradient(135deg, ${project.color}22, ${project.color}44)`,
        borderBottom: `1px solid ${project.color}30`,
      }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(${project.color} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />
      <p
        className="font-space font-black text-2xl text-center px-4 relative z-10 leading-tight"
        style={{ color: project.color }}
      >
        {project.title}
      </p>
      <div className="flex flex-wrap gap-1 mt-2 px-4 justify-center relative z-10">
        {project.tech?.slice(0, 3).map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: `${project.color}25`, color: project.color }}
          >
            {t}
          </span>
        ))}
      </div>
      <div
        className="absolute bottom-2 right-2 flex items-center gap-1 text-xs opacity-40"
        style={{ color: project.color }}
      >
        <Camera size={11} /> Add screenshot
      </div>
    </div>
  );
}

export function ProjectCard({ project, index, onWalkthrough, isAdminMode }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 12;
    setTilt({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  const cardColSpan = project.featured ? 'md:col-span-2' : '';

  return (
    <motion.div
      ref={cardRef}
      className={`glass rounded-2xl overflow-hidden tilt-card relative group ${cardColSpan}`}
      style={{
        border: `1px solid ${project.color}30`,
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: 'transform 0.15s ease, box-shadow 0.3s ease',
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hover glow border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${project.color}`, transition: 'opacity 0.3s ease' }}
      />

      {/* Patent badge */}
      {project.isPatent && (
        <div
          className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
          style={{ background: 'rgba(255,215,0,0.18)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.45)' }}
        >
          <Zap size={11} /> Patent
        </div>
      )}

      {/* Admin camera icon */}
      {isAdminMode && (
        <button
          onClick={() => onWalkthrough(project, 'screenshots')}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
          style={{ background: 'rgba(34,197,94,0.8)', color: 'white' }}
          aria-label="Upload screenshots"
        >
          <Camera size={14} />
        </button>
      )}

      {/* Thumbnail */}
      <div className="cursor-pointer" onClick={() => onWalkthrough(project)}>
        <ScreenshotThumbnail project={project} />
      </div>

      {/* Card body */}
      <div className="p-5">
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: project.color }} />
            <span className="text-xs font-mono" style={{ color: 'var(--color-text-secondary)' }}>{project.period}</span>
          </div>
          <h3
            className="font-space font-bold text-lg mb-1"
            style={{
              background: `linear-gradient(135deg, ${project.color}, var(--color-accent2))`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
          >
            {project.title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {project.description}
          </p>
        </div>

        {/* Tech pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech?.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: `${project.color}18`, color: project.color,
                border: `1px solid ${project.color}30`,
              }}
            >
              {tech}
            </span>
          ))}
          {project.tech?.length > 5 && (
            <span className="text-xs self-center" style={{ color: 'var(--color-text-secondary)' }}>
              +{project.tech.length - 5}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {project.githubUrl && project.githubUrl !== 'https://github.com/romenhalder' && (
            <a
              href={project.githubUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass"
              style={{ color: 'var(--color-text-primary)', border: '1px solid var(--color-glass-border)' }}
              aria-label={`${project.title} on GitHub`}
            >
              <Github size={12} /> GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: 'var(--gradient-accent)', color: 'white' }}
              aria-label={`${project.title} live demo`}
            >
              <ExternalLink size={12} /> Live
            </a>
          )}
          <button
            onClick={() => onWalkthrough(project)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
            style={{ background: `${project.color}18`, color: project.color, border: `1px solid ${project.color}35` }}
            aria-label={`View ${project.title} details`}
          >
            <BookOpen size={12} /> Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
