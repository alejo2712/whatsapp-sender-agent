import { describe, expect, it } from 'vitest';
import { buildTemplatePayload, buildTextPayload } from '../src/skills/build-whatsapp-payload.skill.js';

describe('buildTextPayload', () => {
  it('builds a valid text payload', () => {
    const payload = buildTextPayload('5491112345678', 'Hello from agent');
    expect(payload).toEqual({
      messaging_product: 'whatsapp',
      to: '5491112345678',
      type: 'text',
      text: { body: 'Hello from agent' },
    });
  });
});

describe('buildTemplatePayload', () => {
  it('builds a valid template payload without components', () => {
    const payload = buildTemplatePayload('5491112345678', 'hello_world', 'es_AR');
    expect(payload).toEqual({
      messaging_product: 'whatsapp',
      to: '5491112345678',
      type: 'template',
      template: {
        name: 'hello_world',
        language: { code: 'es_AR' },
      },
    });
  });

  it('builds a template payload with components', () => {
    const components = [{ type: 'body' as const, parameters: [{ type: 'text' as const, text: 'John' }] }];
    const payload = buildTemplatePayload('5491112345678', 'order_confirm', 'en_US', components);
    expect(payload.template.components).toHaveLength(1);
    expect(payload.template.components![0].parameters![0].text).toBe('John');
  });
});
