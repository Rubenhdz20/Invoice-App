import { renderHook } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('useMediaQuery', () => {
  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks();
  });

  it('should return false initially when matchMedia does not match', () => {
    (window.matchMedia as jest.Mock).mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('should return true when matchMedia matches', () => {
    (window.matchMedia as jest.Mock).mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('should call matchMedia with correct query', () => {
    const query = '(max-width: 1024px)';
    (window.matchMedia as jest.Mock).mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    renderHook(() => useMediaQuery(query));
    expect(window.matchMedia).toHaveBeenCalledWith(query);
  });

  it('should add event listener on mount', () => {
    const addEventListener = jest.fn();
    (window.matchMedia as jest.Mock).mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener: jest.fn(),
    });

    renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should remove event listener on unmount', () => {
    const removeEventListener = jest.fn();
    (window.matchMedia as jest.Mock).mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener,
    });

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    unmount();
    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should handle server-side rendering correctly', () => {
    // Test when window is undefined (SSR scenario)
    const originalWindow = global.window;
    delete (global as any).window;

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);

    // Restore window
    global.window = originalWindow;
  });

  it('should work with different media queries', () => {
    const queries = [
      '(min-width: 768px)',
      '(max-width: 1024px)',
      '(orientation: portrait)',
      '(prefers-color-scheme: dark)'
    ];

    queries.forEach(query => {
      (window.matchMedia as jest.Mock).mockReturnValue({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });

      const { result } = renderHook(() => useMediaQuery(query));
      expect(result.current).toBe(true);
      expect(window.matchMedia).toHaveBeenCalledWith(query);
    });
  });
});