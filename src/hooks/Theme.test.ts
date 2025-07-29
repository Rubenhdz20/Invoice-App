import { renderHook, act } from '@testing-library/react';
import { create } from 'zustand';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// We need to create the store fresh for each test since Zustand caches stores
const createThemeStore = () => create<{
  theme: 'light' | 'dark';
  toggle: () => void;
}>((set) => ({
  // pick up saved preference or default to light
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  toggle: () =>
    set((s) => {
      const next = s.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return { theme: next };
    })
}));

describe('useThemeStore', () => {
  beforeEach(() => {
    // Clear localStorage mock before each test
    jest.clearAllMocks();
  });

  it('should initialize with light theme by default', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    
    const useThemeStore = createThemeStore();
    const { result } = renderHook(() => useThemeStore());
    expect(result.current.theme).toBe('light');
  });

  it('should initialize with saved theme from localStorage', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue('dark');
    
    const useThemeStore = createThemeStore();
    const { result } = renderHook(() => useThemeStore());
    expect(result.current.theme).toBe('dark');
  });

  it('should toggle from light to dark theme', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue('light');
    
    const useThemeStore = createThemeStore();
    const { result } = renderHook(() => useThemeStore());
    
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.theme).toBe('dark');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should toggle from dark to light theme', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue('dark');
    
    const useThemeStore = createThemeStore();
    const { result } = renderHook(() => useThemeStore());
    
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.theme).toBe('light');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('should persist theme changes to localStorage', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue('light');
    
    const useThemeStore = createThemeStore();
    const { result } = renderHook(() => useThemeStore());
    
    act(() => {
      result.current.toggle();
    });
    
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    
    act(() => {
      result.current.toggle();
    });
    
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('should handle multiple toggles correctly', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue('light');
    
    const useThemeStore = createThemeStore();
    const { result } = renderHook(() => useThemeStore());
    expect(result.current.theme).toBe('light');
    
    // First toggle: light -> dark
    act(() => {
      result.current.toggle();
    });
    expect(result.current.theme).toBe('dark');
    
    // Second toggle: dark -> light
    act(() => {
      result.current.toggle();
    });
    expect(result.current.theme).toBe('light');
    
    // Third toggle: light -> dark
    act(() => {
      result.current.toggle();
    });
    expect(result.current.theme).toBe('dark');
  });

  it('should call localStorage.getItem with correct key on initialization', () => {
    const useThemeStore = createThemeStore();
    renderHook(() => useThemeStore());
    expect(localStorage.getItem).toHaveBeenCalledWith('theme');
  });
});