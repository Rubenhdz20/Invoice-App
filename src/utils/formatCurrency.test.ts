import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
    it('formats a number in USD with 2 decimals', () => {
        const amount = 1234.56;
        const result = formatCurrency(amount);
        expect(result).toBe('$1,234.56');
    });
});