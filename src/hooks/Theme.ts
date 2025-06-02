import { create } from 'zustand'

type Theme = 'light'|'dark';

const useThemeStore = create<{
  theme: Theme
  toggle: () => void
}> ((set) => ({
  // pick up saved preference or default to light
  theme: (localStorage.getItem('theme') as Theme) || 'light',
  toggle: () =>
    set((s) => {
      const next = s.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', next)
      return { theme: next }
    })
}));

export default useThemeStore;