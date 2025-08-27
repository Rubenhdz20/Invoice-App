import { describe, it, expect } from 'vitest';
import { calculateLineSubtotal } from './calculateLineSubtotal';

describe('calculateLineSubtotal', () => {
  it('multiplies quantity × price', () => {
    expect(calculateLineSubtotal(2, 100)).toBe(200);
    expect(calculateLineSubtotal(3, 19.99)).toBe(59.97);
  });

  it('rounds to 2 decimals (money-safe)', () => {
    expect(calculateLineSubtotal(1, 1.005)).toBe(1.01);  // 1.005 → 1.01
    expect(calculateLineSubtotal(2, 0.335)).toBe(0.67);  // 0.335*2 → 0.67
  });

  it('returns 0 for zero qty and clamps negatives to 0', () => {
    expect(calculateLineSubtotal(0, 9.99)).toBe(0);
    expect(calculateLineSubtotal(5, 0)).toBe(0);
    expect(calculateLineSubtotal(-1, 10)).toBe(0);
    expect(calculateLineSubtotal(2, -10)).toBe(0);
    expect(calculateLineSubtotal(-2, -10)).toBe(0);
  });

  it('handles large values without floating drift', () => {
    expect(calculateLineSubtotal(1_000_000, 123.45)).toBe(123_450_000);
  });
});