import { buildTemplatePayload, buildTextPayload } from '../skills/build-whatsapp-payload.skill.js';
import { sendWhatsAppMessage } from '../skills/send-whatsapp-message.skill.js';
import { validatePhone } from '../skills/validate-phone.skill.js';
import { IWhatsAppClient } from '../tools/whatsapp-client.interface.js';
import { createWhatsAppClient } from '../tools/whatsapp-client.factory.js';
import { SendResult, SendTemplateInput, SendTextInput, TemplateComponent } from '../types/whatsapp.types.js';
import { logger } from '../utils/logger.js';

/**
 * Orchestrates a single WhatsApp send operation.
 *
 * Responsibilities:
 *   - Validate input
 *   - Build the correct payload
 *   - Delegate to the appropriate client (mock | live) via IWhatsAppClient
 *
 * This agent does NOT:
 *   - Decide who to message
 *   - Generate marketing content
 *   - Run bulk campaigns
 *   - Read from any database or external state
 *
 * Future integration: an orchestrator_agent passes SendTextInput or SendTemplateInput
 * and receives SendResult. The transport (mock/live/queue) is invisible to the caller.
 *
 * TODO: Extend with sendMedia(), sendReaction(), sendInteractive() as new skills are added.
 */
export class WhatsAppSenderAgent {
  private client: IWhatsAppClient;

  constructor(client?: IWhatsAppClient) {
    this.client = client ?? createWhatsAppClient();
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
