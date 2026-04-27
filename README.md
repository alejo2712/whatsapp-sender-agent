# whatsapp-sender-agent

A CLI agent for sending WhatsApp messages via the Meta WhatsApp Cloud API. Designed as the first component of a multi-agent orchestration system — callable from the terminal, n8n workflows, REST APIs, or parent agents.

## What it does

- Sends text messages to a phone number (within the 24-hour conversation window)
- Sends template messages (required to start or re-engage conversations)
- Validates phone format before any API call
- Returns structured output: `success`, `messageId`, or error details

## Installation

```bash
git clone https://github.com/alejo2712/whatsapp-sender-agent.git
cd whatsapp-sender-agent
pnpm install
```

## Environment Setup

```bash
cp .env.example .env
```

Edit `.env`:

```env
META_ACCESS_TOKEN=your_token_here
META_PHONE_NUMBER_ID=your_phone_number_id
META_GRAPH_API_VERSION=v21.0
```

See [`docs/meta-whatsapp-setup.md`](docs/meta-whatsapp-setup.md) for how to get these values.

## Send a Text Message

```bash
pnpm send --to 5491112345678 --message "Hello from my agent"
```

Phone number format: digits only, no "+", international format (country code included).

## Send a Template Message

```bash
pnpm send:template --to 5491112345678 --template hello_world --lang es_AR
```

## Run Tests

```bash
pnpm test
```

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for the layer diagram and integration points.

```
CLI → WhatsAppSenderAgent → [validate, build, send] skills → WhatsAppCloudApiClient → Meta API
```

## Current Limitations

- Text messages only work within the 24-hour conversation window after the customer's last message
- Templates must be pre-approved by Meta before use
- No built-in retry logic (add BullMQ in the orchestrator layer if needed)
- Single phone number per `.env` configuration
- No support for media messages (images, documents) yet

## Next Steps

- [ ] Wrap the agent in a NestJS REST endpoint for HTTP invocation
- [ ] Add BullMQ job queue for reliable delivery with retries
- [ ] Support media message payloads (image, document, video)
- [ ] Add template parameter injection (body variables)
- [ ] Integrate with orchestrator agent that decides recipient and content
- [ ] Add n8n webhook trigger adapter
