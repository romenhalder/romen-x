import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import galleryData from '../data/gallery.json';

export const useGalleryStore = create(
  persist(
    (set, get) => ({
      photos: galleryData,
      isAdminMode: false,
      selectedCategory: 'All',

      setPhotos: (photos) => set({ photos }),

      enterAdminMode: () => set({ isAdminMode: true }),
      exitAdminMode: () => set({ isAdminMode: false }),

      addPhoto: (photo) => {
        const newPhoto = {
          ...photo,
          id: `photo-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          width: photo.width || 800,
          height: photo.height || 600,
        };
        set({ photos: [...get().photos, newPhoto] });
      },

      removePhoto: (id) => {
        set({ photos: get().photos.filter((p) => p.id !== id) });
      },

      reorderPhotos: (newOrder) => set({ photos: newOrder }),

      setCategory: (category) => set({ selectedCategory: category }),

      exportGallery: () => {
        const dataStr = JSON.stringify(get().photos, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', 'gallery.json');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    }),
    {
      name: 'portfolio-gallery',
    }
  )
);
