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

  it('defaults WHATSAPP_MODE to "mock" when not set', async () => {
    delete process.env.WHATSAPP_MODE;
    const { getEnv } = await import('../src/config/env.js');
    const env = getEnv();
    expect(env.WHATSAPP_MODE).toBe('mock');
  });

  it('accepts WHATSAPP_MODE=live', async () => {
    process.env.WHATSAPP_MODE = 'live';
    const { getEnv } = await import('../src/config/env.js');
    const env = getEnv();
    expect(env.WHATSAPP_MODE).toBe('live');
  });

  it('rejects invalid WHATSAPP_MODE values', async () => {
    process.env.WHATSAPP_MODE = 'production';
    const { getEnv } = await import('../src/config/env.js');
    expect(() => getEnv()).toThrow(/Environment configuration error/);
  });

  it('does not require META_ACCESS_TOKEN in mock mode', async () => {
    process.env.WHATSAPP_MODE = 'mock';
    delete process.env.META_ACCESS_TOKEN;
    const { getEnv } = await import('../src/config/env.js');
    expect(() => getEnv()).not.toThrow();
  });

  it('getLiveCredentials throws when META_ACCESS_TOKEN is missing', async () => {
    delete process.env.META_ACCESS_TOKEN;
    process.env.META_PHONE_NUMBER_ID = '123456';
    const { getLiveCredentials } = await import('../src/config/env.js');
    expect(() => getLiveCredentials()).toThrow(/Live mode credential error/);
  });

  it('getLiveCredentials succeeds when both Meta credentials are set', async () => {
    process.env.META_ACCESS_TOKEN = 'token_abc';
    process.env.META_PHONE_NUMBER_ID = '987654321';
    process.env.META_GRAPH_API_VERSION = 'v21.0';
    const { getLiveCredentials } = await import('../src/config/env.js');
    const creds = getLiveCredentials();
    expect(creds.META_ACCESS_TOKEN).toBe('token_abc');
    expect(creds.META_PHONE_NUMBER_ID).toBe('987654321');
  });

  it('defaults META_GRAPH_API_VERSION to v21.0', async () => {
    delete process.env.META_GRAPH_API_VERSION;
    process.env.META_ACCESS_TOKEN = 'tok';
    process.env.META_PHONE_NUMBER_ID = '123';
    const { getLiveCredentials } = await import('../src/config/env.js');
    const creds = getLiveCredentials();
    expect(creds.META_GRAPH_API_VERSION).toBe('v21.0');
  });
});
