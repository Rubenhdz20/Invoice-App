import { renderHook, act } from '@testing-library/react';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import useThemeStore from './Theme';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

global.localStorage = localStorageMock as any;

describe('useThemeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with light theme by default', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    
    const { result } = renderHook(() => useThemeStore());
    expect(result.current.theme).toBe('light');
  });

  it('should initialize with saved theme from localStorage', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('dark');
    
    const { result } = renderHook(() => useThemeStore());
    expect(result.current.theme).toBe('dark');
  });

  it('should toggle from light to dark theme', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('light');
    
    const { result } = renderHook(() => useThemeStore());
    
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.theme).toBe('dark');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should toggle from dark to light theme', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('dark');
    
    const { result } = renderHook(() => useThemeStore());
    
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.theme).toBe('light');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('should persist theme changes to localStorage', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('light');
    
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
});
