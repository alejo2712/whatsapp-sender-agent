# CLAUDE.md — whatsapp-sender-agent

> Persistent instructions for all future Claude Code sessions in this project.
> Read this file FIRST before touching any code.

---

## 1. What This Project Is

A single-responsibility CLI agent that sends WhatsApp messages via the Meta Cloud API.
It is Phase 1 of a larger multi-agent orchestration system.

This agent:
- EXECUTES explicit send commands (text and template)
- Does NOT decide who to message
- Does NOT generate marketing content
- Does NOT run bulk campaigns
- Does NOT read campaign data from any database

---

## 2. Before Coding in This Project

1. Read `STATE.md` — see what's done and what comes next
2. Read `ROADMAP.md` — understand the phase you're working in
3. Run `git log --oneline -10` — see recent commits
4. Run `pnpm test` — confirm baseline passes
5. NEVER re-scaffold files that already exist

---

## 3. Stack

| Concern | Tool |
|---|---|
| Runtime | Node.js 22 (ESM) |
| Language | TypeScript strict mode |
| HTTP client | Axios |
| Validation | Zod |
| Env vars | dotenv |
| Testing | Vitest |
| Dev runner | tsx (no build needed for dev) |
| Module format | ESM — all imports MUST use `.js` extension |

---

## 4. Architecture Rules

- Agents orchestrate; skills do work; tools handle external I/O
- The `WhatsAppCloudApiClient` is the ONLY place that touches the Meta API
- Env vars are ONLY read through `getEnv()` — never `process.env` directly elsewhere
- All new skills go in `src/skills/`, new tools in `src/tools/`
- Keep `cli.ts` thin — argument parsing only, no business logic

---

## 5. ESM Import Rules

Always use `.js` extensions in imports, even for `.ts` source files:

```typescript
import { logger } from '../utils/logger.js'; // correct
import { logger } from '../utils/logger';     // WRONG — breaks at runtime
```

---

## 6. Testing Rules

- `resetEnv()` must be called in `beforeEach`/`afterEach` when testing env-dependent code
- Use constructor injection (mock `WhatsAppCloudApiClient`) — never intercept HTTP
- Tests live in `tests/`, not co-located with source

---

## 7. Phone Number Format

Meta API requires E.164 format WITHOUT the "+" prefix:
- Correct: `5491112345678`
- Wrong: `+5491112345678`

The `validatePhone` skill enforces this — call it before building any payload.

---

## 8. Recommended Next Steps (by priority)

1. **REST API adapter** — wrap agent in NestJS or Express for HTTP invocation
2. **BullMQ queue** — reliable delivery with retry for production use
3. **Template parameters** — inject body variables in template messages
4. **n8n adapter** — webhook endpoint that n8n can POST to
5. **Media payloads** — image/document/video message support

---

## 9. Future MCP Integrations to Consider

| MCP | Purpose |
|---|---|
| `github` | PR creation, issue management for this repo |
| `filesystem` | File operations across project boundaries |
| `n8n` | Trigger/receive n8n workflow events |
| `atlassian` | Jira ticket tracking for features/bugs |
| `postgres` | Query message send logs for debugging |

---

## 10. Secrets Rule

NEVER commit `.env`. NEVER hardcode tokens, phone number IDs, or API versions.
All credentials must live in `.env` (gitignored) and be referenced via `getEnv()`.
