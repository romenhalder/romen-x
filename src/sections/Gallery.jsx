import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from '../components/ui/SectionHeading';
import { AchievementCard } from '../components/ui/AchievementCard';
import { useGalleryStore } from '../store/galleryStore';
import { Plus, X, Download, Lock, Unlock, Grid, Filter } from 'lucide-react';
import { fileToBase64 } from '../utils/helpers';
import toast from 'react-hot-toast';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import achievements from '../data/achievements.json';

const GALLERY_PIN = '1234';

export function Gallery() {
  const {
    photos, isAdminMode, selectedCategory,
    enterAdminMode, exitAdminMode,
    addPhoto, removePhoto, setCategory, exportGallery,
  } = useGalleryStore();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [pinInput, setPinInput] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const fileInputRef = useRef(null);

  const categories = ['All', ...new Set(photos.map((p) => p.category))];
  const filtered = selectedCategory === 'All'
    ? photos
    : photos.filter((p) => p.category === selectedCategory);

  const lightboxSlides = filtered.map((p) => ({ src: p.src, title: p.caption }));

  const handlePhotoClick = useCallback((index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const handleAdminToggle = () => {
    if (isAdminMode) {
      exitAdminMode();
    } else {
      setShowPinModal(true);
    }
  };

  const handlePinSubmit = () => {
    if (pinInput === GALLERY_PIN) {
      enterAdminMode();
      setShowPinModal(false);
      setPinInput('');
      toast.success('Admin mode enabled');
    } else {
      toast.error('Incorrect PIN');
      setPinInput('');
    }
  };

  const handleAddPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      addPhoto({
        src: base64,
        caption: file.name.replace(/\.[^.]+$/, ''),
        category: 'My Photos',
        width: 800,
        height: 600,
      });
      toast.success('Photo added!');
    } catch {
      toast.error('Failed to add photo');
    }
    e.target.value = '';
  };

  return (
    <section id="gallery" className="section py-20" style={{ background: 'var(--color-surface)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Achievements */}
        <SectionHeading title="Wall of Fame" subtitle="Certifications, awards, and recognitions" />
        <div className="masonry-grid mb-20">
          {achievements.map((a, i) => (
            <AchievementCard key={a.id} achievement={a} index={i} />
          ))}
        </div>

        {/* Gallery */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <SectionHeading title="Photo Gallery" subtitle="Moments worth remembering" centered={false} />

          <div className="flex items-center gap-2">
            {isAdminMode && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium cursor-pointer"
                  style={{ background: 'var(--gradient-accent)', color: 'white' }}
                  aria-label="Add photo"
                >
                  <Plus size={15} /> Add Photo
                </button>
                <button
                  onClick={exportGallery}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium glass cursor-pointer"
                  style={{ color: 'var(--color-accent1)', border: '1px solid var(--border-accent)' }}
                  aria-label="Export gallery JSON"
                >
                  <Download size={15} /> Export JSON
                </button>
              </>
            )}
            <button
              onClick={handleAdminToggle}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium glass cursor-pointer"
              style={{ color: 'var(--color-text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}
              aria-label={isAdminMode ? 'Exit admin mode' : 'Enter admin mode'}
            >
              {isAdminMode ? <Unlock size={15} /> : <Lock size={15} />}
              {isAdminMode ? 'Exit Admin' : 'Edit Gallery'}
            </button>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer relative overflow-hidden"
              style={{
                background: selectedCategory === cat ? 'var(--gradient-accent)' : 'rgba(255,255,255,0.05)',
                color: selectedCategory === cat ? 'white' : 'var(--color-text-secondary)',
                border: `1px solid ${selectedCategory === cat ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
              }}
              aria-pressed={selectedCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photo grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((photo, i) => (
              <motion.div
                key={photo.id}
                className="relative rounded-xl overflow-hidden group cursor-pointer"
                style={{ aspectRatio: '4/3' }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                onClick={() => !isAdminMode && handlePhotoClick(i)}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                  style={{ display: 'block' }}
                />
                {/* Caption overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4"
                  style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}
                >
                  <div>
                    <p className="text-white text-sm font-medium">{photo.caption}</p>
                    <p className="text-xs" style={{ color: 'var(--color-accent1)' }}>{photo.category} · {photo.date}</p>
                  </div>
                </div>

                {/* Admin remove button */}
                {isAdminMode && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removePhoto(photo.id); toast.success('Photo removed'); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label={`Remove ${photo.caption}`}
                  >
                    <X size={14} color="white" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16" style={{ color: 'var(--color-text-secondary)' }}>
            <Grid size={40} className="mx-auto mb-3 opacity-30" />
            <p>No photos yet. {isAdminMode ? 'Click "Add Photo" to get started!' : 'Enable admin mode to add photos.'}</p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAddPhoto}
        aria-label="Upload photo"
      />

      {/* PIN Modal */}
      <AnimatePresence>
        {showPinModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-strong rounded-2xl p-8 w-full max-w-sm"
              style={{ border: '1px solid var(--border-accent)' }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h3 className="font-space font-bold text-xl gradient-text mb-2">Admin Mode</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>Enter PIN to manage gallery photos</p>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
                className="form-input w-full px-4 py-3 rounded-xl mb-4 text-center text-2xl tracking-widest font-mono"
                placeholder="••••"
                maxLength={4}
                autoFocus
                aria-label="Admin PIN"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowPinModal(false); setPinInput(''); }}
                  className="flex-1 py-2.5 rounded-xl text-sm glass cursor-pointer"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePinSubmit}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                  style={{ background: 'var(--gradient-accent)', color: 'white' }}
                >
                  Unlock
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
        plugins={[Zoom]}
      />
    </section>
  );
}
