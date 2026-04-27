import { WhatsAppApiResponse, WhatsAppPayload } from '../types/whatsapp.types.js';
import { logger } from '../utils/logger.js';
import { IWhatsAppClient } from './whatsapp-client.interface.js';

/**
 * Simulates Meta API responses without making any network calls.
 * Active when WHATSAPP_MODE=mock (the default when credentials are absent).
 *
 * TODO: Replace with WhatsAppCloudApiClient when Meta credentials are available.
 */
export class MockWhatsAppClient implements IWhatsAppClient {
  async sendMessage(payload: WhatsAppPayload): Promise<WhatsAppApiResponse> {
    // TODO: REAL API CALL — swap this client for WhatsAppCloudApiClient in live mode
    const fakeMessageId = `mock-wamid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    logger.info('[MOCK] Simulating Meta API call — no network request made', {
      to: payload.to,
      type: payload.type,
    });

    // Simulate a small realistic delay so mock behaviour reflects production timing
    await new Promise((resolve) => setTimeout(resolve, 80));

    logger.info('[MOCK] Fake response generated', { messageId: fakeMessageId });

    return {
      messaging_product: 'whatsapp',
      contacts: [{ input: payload.to, wa_id: payload.to }],
      messages: [{ id: fakeMessageId }],
    };
  }
}
