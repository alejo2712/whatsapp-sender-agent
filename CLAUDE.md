# CLAUDE.md — whatsapp-sender-agent

> Persistent instructions for all future Claude Code sessions.
> Read this file FIRST. Then read STATE.md. Then check git log.
> Do NOT re-analyze or re-scaffold anything that already exists.

---

## 1. Project Purpose

`whatsapp-sender-agent` is a **single-responsibility execution agent** that sends WhatsApp messages via the Meta WhatsApp Cloud API.

It is **Phase 1 of a planned multi-agent orchestration system**. Its role in that system is strictly execution:

```
orchestrator_agent
    └── whatsapp-sender-agent   ← this project
            └── Meta Cloud API (or MockWhatsAppClient)
```

The orchestrator decides WHO to message, WHAT to say, and WHEN. This agent only executes a single, explicit send command. It never reads campaign data, never generates content, and never runs in a loop on its own.

---

## 2. Current Status

**Phase 2 complete.** Mock mode fully operational. Real Meta API integration is **blocked on credentials** (not on code).

See STATE.md for the exact list of what is implemented vs pending.

---

## 3. Architecture

### Layer Model

```
CLI (src/cli.ts)
    └── WhatsAppSenderAgent (src/agents/)
            ├── validatePhone (src/skills/)
            ├── buildTextPayload / buildTemplatePayload (src/skills/)
            └── sendWhatsAppMessage (src/skills/)
                    └── IWhatsAppClient (interface)
                            ├── MockWhatsAppClient    ← WHATSAPP_MODE=mock
                            └── WhatsAppCloudApiClient ← WHATSAPP_MODE=live
                                        └── Meta Graph API (external, BLOCKED)
```

### Key Architectural Decisions

| Decision | Rationale |
|---|---|
| `IWhatsAppClient` interface | Decouples agent/skills from transport — mock and live are interchangeable |
| Factory (`createWhatsAppClient`) | Single place to route mock vs live; extension point for multi-account routing |
| Lazy env loading + `resetEnv()` | Avoids module-level throws that break test imports |
| Meta credentials optional in base schema | `WHATSAPP_MODE=mock` works with zero credentials |
| `getLiveCredentials()` separate function | Live-only validation, called only by `WhatsAppCloudApiClient` |
| Constructor injection in agent | Caller (or test) can provide any `IWhatsAppClient` — zero coupling |
| ESM (`"type": "module"`) | Node 22 native; all imports use `.js` extensions even for `.ts` sources |

---

## 4. Mode System

```
WHATSAPP_MODE=mock  (default)
  → MockWhatsAppClient
  → No network calls
  → Returns fake messageId like mock-wamid-{timestamp}-{random}
  → No credentials required

WHATSAPP_MODE=live
  → WhatsAppCloudApiClient
  → Requires META_ACCESS_TOKEN + META_PHONE_NUMBER_ID
  → POSTs to https://graph.facebook.com/{version}/{phoneNumberId}/messages
  → CURRENTLY BLOCKED — credentials not yet obtained
```

To switch to live: set `WHATSAPP_MODE=live` in `.env` and populate Meta credentials.
See `docs/meta-whatsapp-setup.md` for credential setup instructions.

---

## 5. Stack

| Concern | Tool |
|---|---|
| Runtime | Node.js 22 (ESM) |
| Language | TypeScript strict mode |
| HTTP client | Axios (WhatsAppCloudApiClient only) |
| Validation | Zod |
| Env vars | dotenv |
| Testing | Vitest |
| Dev runner | tsx |

---

## 6. Rules for This Codebase

### ESM imports — always use `.js` extension
```typescript
import { logger } from '../utils/logger.js'; // correct
import { logger } from '../utils/logger';     // WRONG — breaks at runtime
```

### Env access — only through getEnv() / getLiveCredentials()
```typescript
// correct
import { getEnv } from '../config/env.js';
const { WHATSAPP_MODE } = getEnv();

// WRONG
process.env.WHATSAPP_MODE
```

### Adding a new send type (e.g. media, reaction)
1. Add types to `src/types/whatsapp.types.ts`
2. Add a `buildXxxPayload()` function to `src/skills/build-whatsapp-payload.skill.ts`
3. Add a `sendXxx()` method to `WhatsAppSenderAgent`
4. Wire in `src/cli.ts`
5. Add tests

### Adding a new client (e.g. queue-backed, multi-account)
1. Implement `IWhatsAppClient` in `src/tools/`
2. Add routing logic in `src/tools/whatsapp-client.factory.ts`
3. Add env var for new mode if needed

---

## 7. Test Rules

- Use `resetEnv()` in `beforeEach`/`afterEach` for env-dependent tests
- Inject `IWhatsAppClient` via constructor — never intercept HTTP in tests
- Tests live in `tests/`, not co-located

---

## 8. Phone Number Format

E.164 without `+` prefix: digits only, 7–15 chars.
- Correct: `5491112345678`
- Wrong: `+5491112345678`

---

## 9. What NOT to Do

- Do NOT re-scaffold files that already exist
- Do NOT add `process.env` access outside `src/config/env.ts`
- Do NOT add any feature beyond what is asked
- Do NOT add error handling for impossible cases
- Do NOT touch `WhatsAppCloudApiClient` until Meta credentials are available

---

## 10. Orchestrator Integration (Future)

When the orchestrator agent is built, it will call this agent like this:

```typescript
import { WhatsAppSenderAgent } from './whatsapp-sender-agent/src/agents/whatsapp-sender.agent.js';

const agent = new WhatsAppSenderAgent(); // or pass a specific IWhatsAppClient
const result = await agent.sendText({ to: '5491112345678', message: 'Hello' });
```

The agent returns `SendResult` — `{ success, messageId }` or `{ success, error }` — which the orchestrator uses for retry logic, logging, or campaign tracking.

The agent never touches orchestration state. The orchestrator never touches transport details.

---

## 11. Next Priority Work (no credentials needed)

1. Logging persistence — write send results to a local JSON file or SQLite
2. Template parameter injection — `--params '{"name":"Juan"}'` in CLI
3. REST API adapter — thin NestJS/Express wrapper around the agent
4. n8n webhook adapter — POST endpoint that n8n can trigger

---

## 12. Future MCP Integrations

| MCP | Purpose |
|---|---|
| `github` | PR creation, issue management |
| `filesystem` | File operations across project boundaries |
| `n8n` | Trigger/receive n8n workflow events |
| `atlassian` | Jira ticket tracking |
| `postgres` | Query send logs for debugging |
