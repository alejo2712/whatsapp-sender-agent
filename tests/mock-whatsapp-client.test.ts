import { describe, expect, it } from 'vitest';
import { MockWhatsAppClient } from '../src/tools/mock-whatsapp.client.js';
import { buildTextPayload, buildTemplatePayload } from '../src/skills/build-whatsapp-payload.skill.js';

describe('MockWhatsAppClient', () => {
  const client = new MockWhatsAppClient();

  it('returns a successful response for a text payload', async () => {
    const payload = buildTextPayload('5491112345678', 'Hello from mock');
    const response = await client.sendMessage(payload);

    expect(response.messaging_product).toBe('whatsapp');
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].id).toMatch(/^mock-wamid-/);
    expect(response.contacts[0].wa_id).toBe('5491112345678');
  });

  it('returns a successful response for a template payload', async () => {
    const payload = buildTemplatePayload('5491112345678', 'hello_world', 'es_AR');
    const response = await client.sendMessage(payload);

    expect(response.messages[0].id).toMatch(/^mock-wamid-/);
  });

  it('generates a unique messageId on each call', async () => {
    const payload = buildTextPayload('5491112345678', 'test');
    const [r1, r2] = await Promise.all([
      client.sendMessage(payload),
      client.sendMessage(payload),
    ]);
    expect(r1.messages[0].id).not.toBe(r2.messages[0].id);
  });
});
