# State

> Updated: 2026-04-27

## Current Status

Phase 1 — CLI Agent: **COMPLETE**

## What Exists

| File | Status |
|---|---|
| `src/config/env.ts` | Done — Zod-validated env loading with lazy init and `resetEnv()` for tests |
| `src/types/whatsapp.types.ts` | Done — all shared types |
| `src/utils/logger.ts` | Done — structured console logger |
| `src/tools/whatsapp-cloud-api.client.ts` | Done — Axios HTTP client for Meta Graph API |
| `src/skills/validate-phone.skill.ts` | Done — E.164 without "+" validation |
| `src/skills/build-whatsapp-payload.skill.ts` | Done — text and template payload builders |
| `src/skills/send-whatsapp-message.skill.ts` | Done — executes API call, maps to SendResult |
| `src/agents/whatsapp-sender.agent.ts` | Done — orchestrates skills |
| `src/cli.ts` | Done — parses argv, calls agent, prints result |
| `tests/validate-phone.test.ts` | Done — 6 cases |
| `tests/build-whatsapp-payload.test.ts` | Done — 3 cases |
| `tests/env.test.ts` | Done — 3 cases |
| `tests/send-whatsapp-message.test.ts` | Done — 3 cases (mock client) |

## Key Decisions

- **ESM (`"type": "module"`)** chosen for Node 22 compatibility; all imports use `.js` extensions.
- **Lazy env loading** (`getEnv()` + `resetEnv()`) avoids module-level throws that break test imports.
- **Agent receives optional client** via constructor injection so tests can pass a mock client.
- **No "+" prefix in phone numbers** — Meta API requires E.164 digits only, not RFC 3966 format.
- **`tsx` as dev runner** — no build step needed during development.

## Not Yet Done (Next Phases)

- REST API adapter (NestJS/Express wrapper)
- BullMQ queue for reliable delivery
- Template parameter injection (body variables)
- Media message support (image, document)
- Inbound webhook receiver

## Next Session Instructions

1. Run `pnpm test` to verify all tests pass.
2. If adding REST API: create `apps/api` NestJS app and wrap the agent as a service.
3. If adding queue: install BullMQ + Redis, create `WhatsAppSenderQueue` in `src/queue/`.
4. Do NOT re-scaffold the project — all Phase 1 files are complete.
5. Read this file first, then `docs/architecture.md` for the current layer design.
