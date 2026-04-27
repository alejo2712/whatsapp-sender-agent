import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resetEnv } from '../src/config/env.js';

describe('getEnv', () => {
  const saved = { ...process.env };

  beforeEach(() => {
    resetEnv();
  });

  afterEach(() => {
    process.env = { ...saved };
    resetEnv();
  });

  it('throws when META_ACCESS_TOKEN is missing', async () => {
    delete process.env.META_ACCESS_TOKEN;
    process.env.META_PHONE_NUMBER_ID = '123';
    process.env.META_GRAPH_API_VERSION = 'v21.0';

    const { getEnv } = await import('../src/config/env.js');
    expect(() => getEnv()).toThrow(/Environment configuration error/);
  });

  it('returns parsed env when all required vars are set', async () => {
    process.env.META_ACCESS_TOKEN = 'token_abc';
    process.env.META_PHONE_NUMBER_ID = '987654321';
    process.env.META_GRAPH_API_VERSION = 'v21.0';

    const { getEnv } = await import('../src/config/env.js');
    const env = getEnv();
    expect(env.META_ACCESS_TOKEN).toBe('token_abc');
    expect(env.META_PHONE_NUMBER_ID).toBe('987654321');
  });

  it('uses default API version when not set', async () => {
    process.env.META_ACCESS_TOKEN = 'token_abc';
    process.env.META_PHONE_NUMBER_ID = '987654321';
    delete process.env.META_GRAPH_API_VERSION;

    const { getEnv } = await import('../src/config/env.js');
    const env = getEnv();
    expect(env.META_GRAPH_API_VERSION).toBe('v21.0');
  });
});
