import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppMode = 'default' | 'anime' | 'f1';

interface ThemeState {
  isDark: boolean;
  appMode: AppMode;
  agent: string;
  toggle: () => void;
  setDark: (dark: boolean) => void;
  setMode: (mode: AppMode, agent?: string) => void;
  applyTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: true,
      appMode: 'default',
      agent: 'Standard Coach',

      toggle: () =>
        set((s) => {
          const newDark = !s.isDark;
          document.documentElement.classList.toggle('dark', newDark);
          return { isDark: newDark };
        }),

      setDark: (dark) => {
        document.documentElement.classList.toggle('dark', dark);
        set({ isDark: dark });
      },

      setMode: (mode, agent) => {
        // Apply theme data attribute immediately for live preview
        document.documentElement.dataset.theme = mode === 'default' ? '' : mode;
        set((s) => ({ appMode: mode, agent: agent ?? s.agent }));
      },

      applyTheme: () => {
        const { isDark, appMode } = get();
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.dataset.theme = appMode === 'default' ? '' : appMode;
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // Apply theme immediately on page load from persisted state
        if (state) {
          document.documentElement.classList.toggle('dark', state.isDark);
          document.documentElement.dataset.theme =
            state.appMode === 'default' ? '' : state.appMode;
        }
      },
    }
  )
);
