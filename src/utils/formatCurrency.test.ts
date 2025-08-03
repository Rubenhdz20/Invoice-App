import { describe, it, expect } from "vitest";
import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
  it("should format currency with default USD", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("should format currency with zero amount", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("should format currency with negative amount", () => {
    expect(formatCurrency(-1234.56)).toBe("-$1,234.56");
  });

  it("should format large amounts with thousands separators", () => {
    expect(formatCurrency(1234567.89)).toBe("$1,234,567.89");
  });

  it("should format small decimal amounts", () => {
    expect(formatCurrency(0.99)).toBe("$0.99");
  });

  it("should format whole numbers with .00", () => {
    expect(formatCurrency(100)).toBe("$100.00");
  });
});
