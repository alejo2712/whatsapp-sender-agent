import { WhatsAppApiClientError, WhatsAppCloudApiClient } from '../tools/whatsapp-cloud-api.client.js';
import { SendResult, WhatsAppPayload } from '../types/whatsapp.types.js';
import { logger } from '../utils/logger.js';

export async function sendWhatsAppMessage(
  client: WhatsAppCloudApiClient,
  payload: WhatsAppPayload,
): Promise<SendResult> {
  logger.info('Sending WhatsApp message', { to: payload.to, type: payload.type });

  try {
    const response = await client.sendMessage(payload);
    const messageId = response.messages?.[0]?.id;

    logger.success('Message accepted by Meta API', { messageId, to: payload.to });

    return { success: true, messageId };
  } catch (err) {
    if (err instanceof WhatsAppApiClientError) {
      logger.error('Meta API rejected the message', { code: err.code, type: err.type, message: err.message });
      return { success: false, error: { code: err.code, message: err.message, type: err.type } };
    }

    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Unexpected error sending message', { message: msg });
    return { success: false, error: { code: -1, message: msg, type: 'UnknownError' } };
  }
}
