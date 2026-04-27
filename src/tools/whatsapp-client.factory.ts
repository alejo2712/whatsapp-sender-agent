import { getEnv } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { MockWhatsAppClient } from './mock-whatsapp.client.js';
import { IWhatsAppClient } from './whatsapp-client.interface.js';
import { WhatsAppCloudApiClient } from './whatsapp-cloud-api.client.js';

/**
 * Returns the correct WhatsApp client based on WHATSAPP_MODE env var.
 *
 * mock (default) — no credentials needed, simulates API responses
 * live           — requires META_ACCESS_TOKEN + META_PHONE_NUMBER_ID
 *
 * TODO: Extend to support multi-account routing (select client by accountId param).
 */
export function createWhatsAppClient(): IWhatsAppClient {
  const { WHATSAPP_MODE } = getEnv();

  if (WHATSAPP_MODE === 'live') {
    logger.info('WhatsApp client: LIVE mode — Meta Cloud API');
    // TODO: REAL API CALL — WhatsAppCloudApiClient will validate credentials at instantiation
    return new WhatsAppCloudApiClient();
  }

  logger.info('WhatsApp client: MOCK mode — no network requests will be made');
  return new MockWhatsAppClient();
}
