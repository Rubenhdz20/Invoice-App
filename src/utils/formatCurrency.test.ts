import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatCurrency';

//A. Basic formatting (USD): 1234.5 → "$1,234.50"
// B. Rounding to 2 decimals: 1.005 → "$1.01"
// C. Zero & negatives: 0 → "$0.00", -25 → "-$25.00"
// D. Other currency: MXN sample (with en-US it shows MX$…)
// E. Large number grouping: 1_000_000 → "$1,000,000.00"

describe('formatCurrency', () => {
    it('formats a number in USD with 2 decimals', () => {
        // ARRANGE
        const amount = 1234.56;
        // ACT
        const result = formatCurrency(amount);
        // ASSERT
        expect(result).toBe('$1,234.56');
    });

    it('rounds 2 decimals (e.g, 1.005 → $1.01)', () => {
        const result = formatCurrency(1.005); // en-US, USD
        expect(result).toBe('$1.01');
    });

    it('formats 0 as $0.00', () => {
        expect(formatCurrency(0)).toBe('$0.00');
    });

    it('formats negative numbers with a minus sign', () => {
        expect(formatCurrency(-25)).toBe('-$25.00');
    });

    it('formats MXN with en-US locale', () => {
        const result = formatCurrency(1234.5, 'MXN');
        expect(result).toBe('MX$1,234.50'); // en-US keeps comma + dot
    });

    it('formats EUR with en-US locale', () => {
        const result = formatCurrency(1234.5, 'EUR');
        expect(result).toBe('€1,234.50');   // symbol changes, separators stay en-US
    });

    it('formats large numbers with thousands separators', () => {
        expect(formatCurrency(1_000_000)).toBe('$1,000,000.00');
        expect(formatCurrency(123_456_789.12)).toBe('$123,456,789.12');
    });
});