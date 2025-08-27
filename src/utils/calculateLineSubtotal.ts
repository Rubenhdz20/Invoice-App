/**
 * Safe money multiply with 2-decimal rounding.
 * - Clamps negative inputs to 0
 * - Works in cents to avoid float drift
*/

export function calculateLineSubtotal(quantity: number, price: number): number {
  const q = Number.isFinite(quantity) ? Math.max(0, quantity) : 0;
  const p = Number.isFinite(price) ? Math.max(0, price) : 0;

  // Round the *final product* to cents using EPSILON to avoid 1.005 → 1.00
  const cents = Math.round((q * p + Number.EPSILON) * 100);
  return cents / 100;
}