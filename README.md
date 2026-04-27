# whatsapp-sender-agent

A CLI agent for sending WhatsApp messages via the Meta WhatsApp Cloud API. Designed as the first component of a multi-agent orchestration system — callable from the terminal, n8n workflows, REST APIs, or parent agents.

## What it does

- Sends text messages to a phone number (within the 24-hour conversation window)
- Sends template messages (required to start or re-engage conversations)
- Validates phone format before any API call
- Returns structured output: `success`, `messageId`, or error details
- Runs fully in **mock mode** with no credentials required

## Running without Meta credentials (Mock Mode)

Mock mode is the **default**. No Meta account, token, or phone number ID is needed.

```bash
git clone https://github.com/alejo2712/whatsapp-sender-agent.git
cd whatsapp-sender-agent
pnpm install
cp .env.example .env
# .env already has WHATSAPP_MODE=mock — nothing else needed

pnpm send --to 5491112345678 --message "Hello from mock mode"
```

Output:
```
INFO  whatsapp-sender-agent starting {"mode":"mock"}
INFO  WhatsApp client: MOCK mode — no network requests will be made
INFO  Agent: sendText invoked {"to":"5491112345678"}
INFO  [MOCK] Simulating Meta API call — no network request made
INFO  [MOCK] Fake response generated {"messageId":"mock-wamid-..."}
OK    Message accepted {"messageId":"mock-wamid-..."}

--- Result ---
success:   true
messageId: mock-wamid-1234567890-abc123
```

No network calls are made. The mock client simulates a realistic delay and returns a unique fake `messageId`.

## Switching to Live Mode

When you have Meta credentials:

```env
# .env
WHATSAPP_MODE=live
META_ACCESS_TOKEN=your_permanent_token
META_PHONE_NUMBER_ID=your_phone_number_id
META_GRAPH_API_VERSION=v21.0
```

Then run the same commands — the live `WhatsAppCloudApiClient` takes over automatically.

See [`docs/meta-whatsapp-setup.md`](docs/meta-whatsapp-setup.md) for how to obtain credentials.

## Installation

```bash
pnpm install
cp .env.example .env
```

## Send a Text Message

```bash
pnpm send --to 5491112345678 --message "Hello from my agent"
```

Phone number format: digits only, no "+", international format (country code included).
Example — Argentina mobile: `54` + `911` + `12345678` = `5491112345678`

## Send a Template Message

```bash
pnpm send:template --to 5491112345678 --template hello_world --lang es_AR
```

## Run Tests

```bash
pnpm test
```

22 tests — all pass in mock mode without any credentials.

## Architecture

```
CLI
 └── WhatsAppSenderAgent
         ├── validatePhone skill
         ├── buildPayload skill
         └── sendWhatsAppMessage skill
                 └── IWhatsAppClient
                         ├── MockWhatsAppClient    (WHATSAPP_MODE=mock)
                         └── WhatsAppCloudApiClient (WHATSAPP_MODE=live)
                                     └── Meta Graph API
```

See [`docs/architecture.md`](docs/architecture.md) for the full layer diagram and orchestrator integration points.

## Current Limitations

- Live mode blocked until Meta credentials are obtained
- Text messages only work within the 24-hour conversation window
- Templates must be pre-approved by Meta before use
- No built-in retry logic (planned: BullMQ in Phase 9)
- Single phone number per `.env` configuration
- No media message support yet (planned: Phase 5)

## Roadmap

See [`ROADMAP.md`](ROADMAP.md) for all 10 planned phases.

| Phase | Status |
|---|---|
| 1 — Project setup + architecture | ✅ Done |
| 2 — CLI + validation + mock mode | ✅ Done |
| 3 — Logging and persistence | 🔲 Next |
| 4 — Real Meta API integration | 🔲 Blocked (awaiting credentials) |
| 5 — Template parameter injection | 🔲 Todo |
| 6 — Webhook receiver | 🔲 Todo |
| 7 — REST API adapter | 🔲 Todo |
| 8 — Orchestrator agent | 🔲 Todo |
| 9 — BullMQ queue | 🔲 Todo |
| 10 — Frontend dashboard | 🔲 Future |
