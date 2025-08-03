import { renderHook } from '@testing-library/react';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { useMediaQuery } from './useMediaQuery';

// Mock window.matchMedia since it doesn't exist in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('useMediaQuery', () => {
  beforeEach(() => {
    // Reset the mock before each test
    vi.clearAllMocks();
  });

  it('should return false initially when matchMedia does not match', () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any);

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('should return true when matchMedia matches', () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any);

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('should call matchMedia with correct query', () => {
    const query = '(max-width: 1024px)';
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any);

    renderHook(() => useMediaQuery(query));
    expect(window.matchMedia).toHaveBeenCalledWith(query);
  });

  it('should add event listener on mount', () => {
    const addEventListener = vi.fn();
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener: vi.fn(),
    } as any);

    renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should remove event listener on unmount', () => {
    const removeEventListener = vi.fn();
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener,
    } as any);

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    unmount();
    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
