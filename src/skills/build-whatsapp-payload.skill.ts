import {
  TemplateComponent,
  TemplateMessagePayload,
  TextMessagePayload,
} from '../types/whatsapp.types.js';

export function buildTextPayload(to: string, body: string): TextMessagePayload {
  return {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body },
  };
}

export function buildTemplatePayload(
  to: string,
  templateName: string,
  languageCode: string,
  components?: TemplateComponent[],
): TemplateMessagePayload {
  return {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: languageCode },
      ...(components && components.length > 0 ? { components } : {}),
    },
  };
}
