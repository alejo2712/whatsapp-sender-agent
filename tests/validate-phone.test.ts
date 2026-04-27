import { describe, expect, it } from 'vitest';
import { validatePhone } from '../src/skills/validate-phone.skill.js';

describe('validatePhone', () => {
  it('accepts a valid international number without "+"', () => {
    const result = validatePhone('5491112345678');
    expect(result.valid).toBe(true);
    expect(result.normalized).toBe('5491112345678');
  });

  it('rejects a number with "+" prefix', () => {
    const result = validatePhone('+5491112345678');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/must NOT include/);
  });

  it('rejects numbers shorter than 7 digits', () => {
    const result = validatePhone('123456');
    expect(result.valid).toBe(false);
  });

  it('rejects numbers longer than 15 digits', () => {
    const result = validatePhone('1234567890123456');
    expect(result.valid).toBe(false);
  });

  it('rejects numbers containing letters', () => {
    const result = validatePhone('5491abc45678');
    expect(result.valid).toBe(false);
  });

  it('trims surrounding whitespace', () => {
    const result = validatePhone('  5491112345678  ');
    expect(result.valid).toBe(true);
    expect(result.normalized).toBe('5491112345678');
  });
});
