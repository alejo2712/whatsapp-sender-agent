import { z } from 'zod';

// E.164 without leading "+": digits only, 7–15 chars, starts with country code
const PhoneSchema = z
  .string()
  .regex(/^\d{7,15}$/, 'Phone number must be digits only (no "+" prefix), 7–15 digits, in international format (e.g. 5491112345678)');

export interface PhoneValidationResult {
  valid: boolean;
  normalized?: string;
  error?: string;
}

export function validatePhone(raw: string): PhoneValidationResult {
  if (raw.startsWith('+')) {
    return {
      valid: false,
      error: 'Phone number must NOT include a "+" prefix. Use digits only (e.g. 5491112345678).',
    };
  }

  const result = PhoneSchema.safeParse(raw.trim());
  if (!result.success) {
    return { valid: false, error: result.error.issues[0].message };
  }

  return { valid: true, normalized: result.data };
}
