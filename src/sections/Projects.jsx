import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ProjectCard } from '../components/ui/ProjectCard';
import { FilterBar } from '../components/ui/FilterBar';
import { Modal } from '../components/ui/Modal';
import { Pencil, Lock, Unlock } from 'lucide-react';
import toast from 'react-hot-toast';
import projects from '../data/projects.json';
import configData from '../data/config.json';

export function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [initialTab, setInitialTab] = useState('features');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter((p) => p.category?.includes(activeFilter));

  const openModal = (project, tab = 'features') => {
    setSelectedProject(project);
    setInitialTab(tab);
  };

  const handleAdminToggle = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      toast.success('Admin mode disabled');
    } else {
      setShowPinModal(true);
    }
  };

  const handlePinSubmit = () => {
    if (pinInput === configData.adminPin) {
      setIsAdminMode(true);
      setShowPinModal(false);
      setPinInput('');
      toast.success('Admin mode enabled — you can now upload screenshots!');
    } else {
      toast.error('Incorrect PIN');
      setPinInput('');
    }
  };

  return (
    <section id="projects" className="section py-20" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          title="Project Hub"
          subtitle="6 projects: full-stack development, IoT, and a granted patent — each built to solve real problems"
        />

        {/* Filter + admin toggle row */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
          <FilterBar active={activeFilter} onChange={setActiveFilter} />
          <button
            onClick={handleAdminToggle}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium glass cursor-pointer flex-shrink-0"
            style={{
              color: isAdminMode ? '#22c55e' : 'var(--color-text-secondary)',
              border: `1px solid ${isAdminMode ? '#22c55e' : 'var(--color-glass-border)'}`,
            }}
            aria-label={isAdminMode ? 'Exit admin mode' : 'Enter admin mode'}
          >
            {isAdminMode ? <Unlock size={13} /> : <Lock size={13} />}
            {isAdminMode ? 'Admin ON' : 'Admin'}
          </button>
        </div>

        {/* Admin info banner */}
        {isAdminMode && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }}
          >
            <Pencil size={14} />
            Admin mode active — click the <strong>camera icon</strong> on any card to upload screenshots
          </motion.div>
        )}

        {/* Bento grid */}
        <motion.div className="bento-grid" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.28 }}
              >
                <ProjectCard
                  project={project}
                  index={i}
                  onWalkthrough={openModal}
                  isAdminMode={isAdminMode}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: 'var(--color-text-secondary)' }}>
            No projects found for this filter.
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <Modal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          isAdminMode={isAdminMode}
          initialTab={initialTab}
        />
      )}

      {/* Admin PIN modal */}
      <AnimatePresence>
        {showPinModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-strong rounded-2xl p-8 w-full max-w-sm"
              style={{ border: '1px solid var(--border-accent)' }}
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
            >
              <h3 className="font-space font-bold text-xl gradient-text mb-1">Admin Mode</h3>
              <p className="text-sm mb-5" style={{ color: 'var(--color-text-secondary)' }}>
                Enter PIN to upload project screenshots
              </p>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
                className="form-input w-full px-4 py-3 rounded-xl mb-4 text-center text-3xl tracking-widest font-mono"
                placeholder="••••" maxLength={4} autoFocus aria-label="Admin PIN"
              />
              <div className="flex gap-3">
                <button onClick={() => { setShowPinModal(false); setPinInput(''); }}
                  className="flex-1 py-2.5 rounded-xl text-sm glass cursor-pointer" style={{ color: 'var(--color-text-secondary)' }}>
                  Cancel
                </button>
                <button onClick={handlePinSubmit}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer btn-ripple"
                  style={{ background: 'var(--gradient-accent)', color: 'white' }}>
                  Unlock
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
