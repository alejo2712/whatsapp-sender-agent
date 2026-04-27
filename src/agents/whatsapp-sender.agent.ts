import { WhatsAppCloudApiClient } from '../tools/whatsapp-cloud-api.client.js';
import { buildTemplatePayload, buildTextPayload } from '../skills/build-whatsapp-payload.skill.js';
import { sendWhatsAppMessage } from '../skills/send-whatsapp-message.skill.js';
import { validatePhone } from '../skills/validate-phone.skill.js';
import { SendResult, SendTemplateInput, SendTextInput, TemplateComponent } from '../types/whatsapp.types.js';
import { logger } from '../utils/logger.js';

/**
 * Orchestrates a single WhatsApp send operation.
 * Does NOT decide who to message, does NOT generate content, does NOT run campaigns.
 * Receives explicit inputs and executes the operation.
 */
export class WhatsAppSenderAgent {
  private client: WhatsAppCloudApiClient;

  constructor(client?: WhatsAppCloudApiClient) {
    this.client = client ?? new WhatsAppCloudApiClient();
  }

  async sendText(input: SendTextInput): Promise<SendResult> {
    logger.info('Agent: sendText invoked', { to: input.to });

    const phoneResult = validatePhone(input.to);
    if (!phoneResult.valid) {
      logger.error('Invalid phone number', { reason: phoneResult.error });
      return { success: false, error: { code: 400, message: phoneResult.error!, type: 'ValidationError' } };
    }

    const payload = buildTextPayload(phoneResult.normalized!, input.message);
    return sendWhatsAppMessage(this.client, payload);
  }

  async sendTemplate(input: SendTemplateInput): Promise<SendResult> {
    logger.info('Agent: sendTemplate invoked', { to: input.to, template: input.template });

    const phoneResult = validatePhone(input.to);
    if (!phoneResult.valid) {
      logger.error('Invalid phone number', { reason: phoneResult.error });
      return { success: false, error: { code: 400, message: phoneResult.error!, type: 'ValidationError' } };
    }

    const payload = buildTemplatePayload(
      phoneResult.normalized!,
      input.template,
      input.lang,
      input.components as TemplateComponent[] | undefined,
    );
    return sendWhatsAppMessage(this.client, payload);
  }
}
