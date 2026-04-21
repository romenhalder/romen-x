import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'space', // 'ocean' | 'space'

      toggleTheme: () => {
        const next = get().theme === 'ocean' ? 'space' : 'ocean';
        applyTheme(next);
        set({ theme: next });
      },

      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },

      initTheme: () => {
        const saved = get().theme;
        applyTheme(saved || 'space');
      },
    }),
    {
      name: 'romen-theme',
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme || 'space');
      },
    }
  )
);
