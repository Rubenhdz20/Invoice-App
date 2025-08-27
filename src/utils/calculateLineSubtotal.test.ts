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
});