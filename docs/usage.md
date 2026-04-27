# Usage Guide

## Prerequisites

- Node.js 18+
- pnpm 8+
- A Meta WhatsApp Cloud API account (see `meta-whatsapp-setup.md`)

## Installation

```bash
cd whatsapp-sender-agent
pnpm install
cp .env.example .env
# Edit .env with your Meta credentials
```

## Sending a Text Message

```bash
pnpm send --to 5491112345678 --message "Hello from my agent"
```

Output on success:
```
[2024-01-01T00:00:00.000Z] INFO  Agent: sendText invoked {"to":"5491112345678"}
[2024-01-01T00:00:00.000Z] INFO  Sending WhatsApp message {"to":"5491112345678","type":"text"}
[2024-01-01T00:00:00.000Z] OK    Message accepted by Meta API {"messageId":"wamid.xxx","to":"5491112345678"}

--- Result ---
success: true
messageId: wamid.xxx
```

## Sending a Template Message

```bash
pnpm send:template --to 5491112345678 --template hello_world --lang es_AR
```

## Phone Number Format

- No "+" prefix
- Digits only
- 7–15 digits
- International format (country code included)

Example — Argentina mobile: `5491112345678`
- `54` = Argentina country code
- `911` = mobile prefix (9 + area code 11)
- `12345678` = subscriber number

## Running Tests

```bash
pnpm test
```

## Programmatic Usage (for orchestrators)

```typescript
import { WhatsAppSenderAgent } from './src/agents/whatsapp-sender.agent.js';

const agent = new WhatsAppSenderAgent();

const result = await agent.sendText({
  to: '5491112345678',
  message: 'Hello from orchestrator',
});

if (result.success) {
  console.log('Sent:', result.messageId);
} else {
  console.error('Failed:', result.error);
}
```
