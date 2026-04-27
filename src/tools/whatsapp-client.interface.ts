import { WhatsAppApiResponse, WhatsAppPayload } from '../types/whatsapp.types.js';

/**
 * Contract all WhatsApp client implementations must satisfy.
 * Allows the agent layer to remain decoupled from the transport (mock vs live).
 * Future implementations: webhook-based, queue-backed, multi-account router.
 */
export interface IWhatsAppClient {
  sendMessage(payload: WhatsAppPayload): Promise<WhatsAppApiResponse>;
}
