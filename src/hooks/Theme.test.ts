import { renderHook, act } from '@testing-library/react';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import useThemeStore from './Theme';

// Mock localStorage globally
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Replace the global localStorage
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('useThemeStore', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    
    // Reset localStorage mock
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    
    // Reset Zustand store state
    useThemeStore.setState({ theme: 'light' });
  });

  it('should initialize with light theme by default', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    // Create a fresh store instance
    const { result } = renderHook(() => useThemeStore());
    expect(result.current.theme).toBe('light');
  });

  it('should initialize with saved theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    // Reset store to pick up the mocked localStorage value
    useThemeStore.setState({ 
      theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light' 
    });
    
    const { result } = renderHook(() => useThemeStore());
    expect(result.current.theme).toBe('dark');
  });

  it('should toggle from light to dark theme', () => {
    // Start with light theme
    useThemeStore.setState({ theme: 'light' });
    
    const { result } = renderHook(() => useThemeStore());
    
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.theme).toBe('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should toggle from dark to light theme', () => {
    // Start with dark theme
    useThemeStore.setState({ theme: 'dark' });
    
    const { result } = renderHook(() => useThemeStore());
    
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.theme).toBe('light');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('should persist theme changes to localStorage', () => {
    // Start with light theme
    useThemeStore.setState({ theme: 'light' });
    
    const { result } = renderHook(() => useThemeStore());
    
    act(() => {
      result.current.toggle();
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    
    act(() => {
      result.current.toggle();
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
  });
});