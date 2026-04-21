import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Cpu, Layers, Code2, Image as ImageIcon, ChevronLeft, ChevronRight, Upload, Download, Trash2 } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'screenshots', label: 'Screenshots', icon: ImageIcon },
  { id: 'features', label: 'Features', icon: Layers },
  { id: 'tech', label: 'Tech Dive', icon: Code2 },
  { id: 'architecture', label: 'Architecture', icon: Cpu },
];

// --- Screenshot Gallery Tab ---
function ScreenshotGallery({ project, isAdminMode }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const fileInputRef = useRef(null);
  const { getScreenshots, addScreenshot, removeScreenshot, exportScreenshots } = useProjectStore();
  const screenshots = getScreenshots(project.id);

  const prev = () => setCurrentIdx((i) => (i - 1 + screenshots.length) % screenshots.length);
  const next = () => setCurrentIdx((i) => (i + 1) % screenshots.length);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (!isAdminMode) return;
    Array.from(e.dataTransfer.files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 10 * 1024 * 1024) { toast.error('File too large (max 10MB)'); return; }
      addScreenshot(project.id, file);
    });
    toast.success('Screenshots added!');
  }, [isAdminMode, project.id, addScreenshot]);

  const handleFileInput = (e) => {
    Array.from(e.target.files || []).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) { toast.error('File too large (max 10MB)'); return; }
      addScreenshot(project.id, file);
    });
    toast.success('Screenshots added!');
    e.target.value = '';
  };

  if (screenshots.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed"
        style={{ borderColor: 'var(--color-glass-border)' }}
        onDragOver={isAdminMode ? (e) => e.preventDefault() : undefined}
        onDrop={isAdminMode ? handleDrop : undefined}
      >
        <ImageIcon size={40} className="mb-3" style={{ color: 'var(--color-text-secondary)', opacity: 0.35 }} />
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
          No screenshots yet
        </p>
        <p className="text-xs mb-4" style={{ color: 'var(--color-text-secondary)', opacity: 0.6 }}>
          {isAdminMode ? 'Drag & drop or click to upload' : 'Enable Admin Mode to upload screenshots'}
        </p>
        {isAdminMode && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer btn-ripple"
            style={{ background: 'var(--gradient-accent)', color: 'white' }}
          >
            <Upload size={15} /> Upload Screenshots
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileInput} />
      </div>
    );
  }

  const current = screenshots[currentIdx];

  return (
    <div>
      {/* Main image */}
      <div
        className="relative rounded-xl overflow-hidden mb-4"
        style={{ maxHeight: '58vh' }}
        onDragOver={isAdminMode ? (e) => e.preventDefault() : undefined}
        onDrop={isAdminMode ? handleDrop : undefined}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={current.id}
            src={current.src}
            alt={current.caption}
            className="w-full object-contain"
            style={{ maxHeight: '58vh', display: 'block', margin: '0 auto' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>

        {/* Nav arrows */}
        {screenshots.length > 1 && (
          <>
            <button onClick={prev} className="screenshot-nav-btn" style={{ left: '8px' }} aria-label="Previous screenshot">
              <ChevronLeft size={18} />
            </button>
            <button onClick={next} className="screenshot-nav-btn" style={{ right: '8px' }} aria-label="Next screenshot">
              <ChevronRight size={18} />
            </button>
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(0,0,0,0.55)', color: 'white' }}
            >
              {currentIdx + 1} / {screenshots.length}
            </div>
          </>
        )}
      </div>

      <p className="text-xs text-center mb-4" style={{ color: 'var(--color-text-secondary)' }}>{current.caption}</p>

      {/* Thumbnail strip */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {screenshots.map((shot, i) => (
          <button
            key={shot.id}
            onClick={() => setCurrentIdx(i)}
            className="relative flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
            style={{
              width: '72px', height: '52px',
              border: `2px solid ${i === currentIdx ? 'var(--color-accent1)' : 'transparent'}`,
              transition: 'border-color 200ms',
            }}
            aria-label={`Screenshot ${i + 1}`}
          >
            <img src={shot.src} alt="" className="w-full h-full object-cover" />
            {isAdminMode && (
              <button
                onClick={(e) => { e.stopPropagation(); removeScreenshot(project.id, shot.id); if(currentIdx >= screenshots.length - 1) setCurrentIdx(0); toast.success('Removed'); }}
                className="absolute inset-0 bg-red-500 opacity-0 hover:opacity-90 flex items-center justify-center cursor-pointer"
                aria-label="Remove screenshot"
              >
                <Trash2 size={14} color="white" />
              </button>
            )}
          </button>
        ))}

        {/* Add more (admin) */}
        {isAdminMode && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 rounded-lg flex items-center justify-center cursor-pointer"
            style={{ width: '72px', height: '52px', border: '2px dashed var(--color-glass-border)', color: 'var(--color-text-secondary)' }}
            aria-label="Add more screenshots"
          >
            <Upload size={16} />
          </button>
        )}
      </div>

      {/* Export button (admin) */}
      {isAdminMode && (
        <div className="flex justify-end mt-3">
          <button
            onClick={() => exportScreenshots(project.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass cursor-pointer"
            style={{ color: 'var(--color-accent1)', border: '1px solid var(--border-accent)' }}
          >
            <Download size={12} /> Export JSON
          </button>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileInput} />
    </div>
  );
}

// --- Architecture Diagram ---
function ArchitectureDiagram({ architecture }) {
  if (!architecture?.nodes?.length) {
    return (
      <div className="flex items-center justify-center h-48" style={{ color: 'var(--color-text-secondary)' }}>
        Architecture diagram not available.
      </div>
    );
  }
  const { nodes = [], edges = [] } = architecture;
  const typeColors = {
    frontend: '#0EA5E9', backend: '#22c55e', database: '#f97316',
    security: '#ef4444', cloud: '#a855f7', state: '#C77DFF', export: '#6b7280',
  };
  return (
    <div className="overflow-auto rounded-xl p-2" style={{ background: 'rgba(0,0,0,0.12)' }}>
      <svg viewBox="0 0 800 300" className="w-full" style={{ minHeight: '240px' }}>
        <defs>
          <marker id="arrowModal" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="rgba(255,255,255,0.3)" />
          </marker>
        </defs>
        {edges.map((edge, i) => {
          const from = nodes.find((n) => n.id === edge.from);
          const to = nodes.find((n) => n.id === edge.to);
          if (!from || !to) return null;
          const x1 = from.x + 65, y1 = from.y + 20;
          const x2 = to.x + 65, y2 = to.y + 20;
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#arrowModal)" />
              <text x={(x1+x2)/2} y={(y1+y2)/2 - 5} fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">{edge.label}</text>
            </g>
          );
        })}
        {nodes.map((node) => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            <rect width="130" height="40" rx="8" fill={`${typeColors[node.type] || '#555'}22`} stroke={typeColors[node.type] || '#555'} strokeWidth="1.5" />
            <text x="65" y="25" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">{node.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// --- Tech Deep Dive Tab ---
function TechDeepDive({ project }) {
  const specs = project.techSpecs || {};
  const rows = [
    { key: 'Stack', value: project.tech?.join(', ') || 'N/A' },
    { key: 'Architecture', value: specs.architecture || 'N/A' },
    { key: 'Auth Method', value: specs.authMethod || 'N/A' },
    { key: 'Database', value: specs.database || 'N/A' },
    { key: 'Deployment', value: specs.deployment || 'N/A' },
    { key: 'Period', value: project.period || 'N/A' },
  ];
  return (
    <div>
      <table className="w-full text-sm mb-6">
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <td className="py-3 pr-4 font-semibold whitespace-nowrap" style={{ color: 'var(--color-accent1)' }}>{row.key}</td>
              <td className="py-3" style={{ color: 'var(--color-text-secondary)' }}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {specs.keyFeatures?.length > 0 && (
        <>
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-accent1)' }}>KEY FEATURES</p>
          <div className="flex flex-wrap gap-2">
            {specs.keyFeatures.map((f) => (
              <span key={f} className="text-xs px-2.5 py-1 rounded-full glass" style={{ color: 'var(--color-text-secondary)' }}>{f}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// --- Main Modal ---
export function Modal({ project, onClose, isAdminMode = false, initialTab = 'features' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  // Keyboard ESC to close
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <motion.div
          className="glass-strong rounded-t-3xl sm:rounded-2xl w-full sm:max-w-3xl flex flex-col overflow-hidden"
          style={{
            border: `1px solid ${project.color}40`,
            maxHeight: '92dvh',
          }}
          initial={{ scale: 0.94, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile drag handle */}
          <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex-1 min-w-0">
              <h3 className="font-space font-bold text-xl gradient-text leading-tight">{project.title}</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{project.subtitle}</p>
            </div>
            <button onClick={onClose} aria-label="Close" className="p-2 rounded-lg glass cursor-pointer ml-4 flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }}>
              <X size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-4 pt-3 pb-0 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer flex-shrink-0"
                style={{
                  background: activeTab === tab.id ? `${project.color}22` : 'transparent',
                  color: activeTab === tab.id ? project.color : 'var(--color-text-secondary)',
                  border: `1px solid ${activeTab === tab.id ? project.color + '50' : 'transparent'}`,
                }}
                aria-pressed={activeTab === tab.id}
              >
                <tab.icon size={13} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 px-6 py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                {activeTab === 'screenshots' && (
                  <ScreenshotGallery project={project} isAdminMode={isAdminMode} />
                )}
                {activeTab === 'features' && (
                  <div className="space-y-4">
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                      {project.longDescription || project.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(project.features || []).map((feature, i) => (
                        <motion.div
                          key={i}
                          className="glass rounded-xl p-4"
                          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                        >
                          <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-accent1)' }}>{feature.title}</h4>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{feature.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'tech' && <TechDeepDive project={project} />}
                {activeTab === 'architecture' && <ArchitectureDiagram architecture={project.architecture} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer links */}
          <div className="px-6 py-4 flex gap-2 flex-wrap" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {project.githubUrl && project.githubUrl !== 'https://github.com/romenhalder' && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass text-sm font-medium"
                style={{ color: 'var(--color-text-primary)', border: '1px solid var(--color-glass-border)' }}>
                <Github size={14} /> GitHub
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: 'var(--gradient-accent)', color: 'white' }}>
                <ExternalLink size={14} /> Live Demo
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
