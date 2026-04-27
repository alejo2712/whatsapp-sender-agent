import { describe, expect, it, vi } from 'vitest';
import { WhatsAppApiClientError } from '../src/tools/whatsapp-cloud-api.client.js';
import { sendWhatsAppMessage } from '../src/skills/send-whatsapp-message.skill.js';
import { buildTextPayload } from '../src/skills/build-whatsapp-payload.skill.js';
import type { IWhatsAppClient } from '../src/tools/whatsapp-client.interface.js';

function makeClient(sendMessage: IWhatsAppClient['sendMessage']): IWhatsAppClient {
  return { sendMessage };
}

describe('sendWhatsAppMessage', () => {
  it('returns success with messageId on successful API call', async () => {
    const client = makeClient(
      vi.fn().mockResolvedValue({
        messaging_product: 'whatsapp',
        contacts: [{ input: '5491112345678', wa_id: '5491112345678' }],
        messages: [{ id: 'wamid.abc123' }],
      }),
    );

    const payload = buildTextPayload('5491112345678', 'Hello');
    const result = await sendWhatsAppMessage(client, payload);

    expect(result.success).toBe(true);
    expect(result.messageId).toBe('wamid.abc123');
  });

  it('returns failure with error details on API error', async () => {
    const client = makeClient(
      vi.fn().mockRejectedValue(new WhatsAppApiClientError('Invalid token', 190, 'OAuthException')),
    );

    const payload = buildTextPayload('5491112345678', 'Hello');
    const result = await sendWhatsAppMessage(client, payload);

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(190);
    expect(result.error?.type).toBe('OAuthException');
    expect(result.error?.message).toMatch(/Invalid token/);
  });

  it('handles unexpected non-API errors gracefully', async () => {
    const client = makeClient(vi.fn().mockRejectedValue(new Error('Network timeout')));

    const payload = buildTextPayload('5491112345678', 'Hello');
    const result = await sendWhatsAppMessage(client, payload);

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(-1);
    expect(result.error?.message).toMatch(/Network timeout/);
  });
});
