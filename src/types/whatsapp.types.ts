export type MessageType = 'text' | 'template';

export interface TextMessagePayload {
  messaging_product: 'whatsapp';
  to: string;
  type: 'text';
  text: {
    body: string;
    preview_url?: boolean;
  };
}

export interface TemplateMessagePayload {
  messaging_product: 'whatsapp';
  to: string;
  type: 'template';
  template: {
    name: string;
    language: {
      code: string;
    };
    components?: TemplateComponent[];
  };
}

export interface TemplateComponent {
  type: 'header' | 'body' | 'button';
  parameters?: TemplateParameter[];
}

export interface TemplateParameter {
  type: 'text' | 'image' | 'document' | 'video';
  text?: string;
}

export type WhatsAppPayload = TextMessagePayload | TemplateMessagePayload;

export interface WhatsAppApiResponse {
  messaging_product: string;
  contacts: Array<{ input: string; wa_id: string }>;
  messages: Array<{ id: string }>;
}

export interface WhatsAppApiError {
  error: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: {
    code: number;
    message: string;
    type: string;
  };
}

export interface SendTextInput {
  to: string;
  message: string;
}

export interface SendTemplateInput {
  to: string;
  template: string;
  lang: string;
  components?: TemplateComponent[];
}
