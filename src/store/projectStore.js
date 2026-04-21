import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Zustand store for project screenshots (admin)
export const useProjectStore = create(
  persist(
    (set, get) => ({
      screenshots: {}, // { [projectId]: [{ id, src, caption }] }

      addScreenshot: (projectId, file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newShot = {
            id: `${projectId}-${Date.now()}`,
            src: e.target.result,
            caption: file.name.replace(/\.[^.]+$/, ''),
          };
          set((state) => ({
            screenshots: {
              ...state.screenshots,
              [projectId]: [...(state.screenshots[projectId] || []), newShot],
            },
          }));
        };
        reader.readAsDataURL(file);
      },

      removeScreenshot: (projectId, shotId) => {
        set((state) => ({
          screenshots: {
            ...state.screenshots,
            [projectId]: (state.screenshots[projectId] || []).filter((s) => s.id !== shotId),
          },
        }));
      },

      getScreenshots: (projectId) => {
        return get().screenshots[projectId] || [];
      },

      exportScreenshots: (projectId) => {
        const shots = get().screenshots[projectId] || [];
        const blob = new Blob([JSON.stringify({ projectId, screenshots: shots }, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectId}-screenshots.json`;
        a.click();
        URL.revokeObjectURL(url);
      },
    }),
    { name: 'romen-project-screenshots' }
  )
);
