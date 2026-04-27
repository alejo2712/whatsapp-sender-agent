# Roadmap

## Phase 1 — Project Setup and Architecture ✅ DONE

- [x] TypeScript + ESM + strict mode
- [x] pnpm workspace, Vitest, tsx, Zod, Axios, dotenv
- [x] Directory structure: agents / skills / tools / config / types / utils
- [x] `IWhatsAppClient` interface (transport abstraction)
- [x] `WhatsAppCloudApiClient` (live HTTP client, ready but blocked by credentials)
- [x] Git repository + GitHub remote

## Phase 2 — CLI + Validation + Payload Builder + Mock Mode ✅ DONE

- [x] `validatePhone` skill — E.164 without "+" prefix
- [x] `buildTextPayload` + `buildTemplatePayload` skills
- [x] `MockWhatsAppClient` — simulates responses, no network calls, unique fake IDs
- [x] `createWhatsAppClient` factory — routes mock vs live on `WHATSAPP_MODE`
- [x] `sendWhatsAppMessage` skill — delegates to `IWhatsAppClient`
- [x] `WhatsAppSenderAgent` — orchestrates skills, accepts any `IWhatsAppClient`
- [x] CLI: `pnpm send` and `pnpm send:template` fully working in mock mode
- [x] Env schema: `WHATSAPP_MODE` + optional Meta credentials
- [x] 22 tests passing (env, phone, payload, mock client, send skill)
- [x] CLAUDE.md, ROADMAP.md, STATE.md documentation

## Phase 3 — Logging and Persistence 🔲 NEXT (no credentials needed)

- [ ] Write send results to a local file (`logs/sends.jsonl`) after each operation
- [ ] CLI: `pnpm logs` command — tail recent send history with status
- [ ] Log rotation or max-file-size cap
- [ ] Structured log entries: timestamp, mode, phone, type, result, messageId

## Phase 4 — Real Meta API Integration 🔲 BLOCKED — awaiting credentials

- [ ] Obtain `META_ACCESS_TOKEN` (permanent System User token from Business Manager)
- [ ] Obtain `META_PHONE_NUMBER_ID` from the Developer Portal
- [ ] Set `WHATSAPP_MODE=live` in `.env`
- [ ] Smoke test: send a text message to a verified test number
- [ ] Smoke test: send `hello_world` template
- [ ] Verify error handling (190 token expired, 131026 template not found, etc.)
- [ ] Document real API response shapes in `src/types/whatsapp.types.ts`

## Phase 5 — Template Parameter Injection 🔲 TODO

- [ ] CLI: `--params '{"name":"Juan","order":"#1234"}'`
- [ ] `buildTemplatePayload` extended with dynamic body/header parameter injection
- [ ] Zod schema for parameter validation
- [ ] Tests for parameterized templates

## Phase 6 — Webhook Receiver for Incoming Messages 🔲 TODO

- [ ] Express or NestJS HTTP server with `POST /webhook` endpoint
- [ ] Meta webhook verification (`GET /webhook` hub.challenge)
- [ ] Parse inbound message events and status updates
- [ ] Emit normalized events (message received, message delivered, message read)
- [ ] Skills: `parseWebhookEvent`, `acknowledgeWebhook`

## Phase 7 — REST API Adapter 🔲 TODO

- [ ] Thin NestJS app wrapping `WhatsAppSenderAgent`
- [ ] `POST /messages/text` — `{ to, message }` → `SendResult`
- [ ] `POST /messages/template` — `{ to, template, lang, params? }` → `SendResult`
- [ ] Internal API key auth header
- [ ] Docker Compose: app + optional Redis for future queue

## Phase 8 — Orchestrator Agent 🔲 TODO

- [ ] `OrchestratorAgent` class that reads a recipient list and delegates to `WhatsAppSenderAgent`
- [ ] Does NOT live in this repo — separate `orchestrator-agent` package
- [ ] Communication contract: `SendTextInput` / `SendTemplateInput` / `SendResult`
- [ ] This agent remains a pure executor — orchestrator owns the "what, who, when"

## Phase 9 — Queue-Backed Delivery (BullMQ) 🔲 TODO

- [ ] BullMQ job queue in front of `WhatsAppSenderAgent`
- [ ] Configurable retry policy (exponential backoff, max attempts)
- [ ] Job status tracking: pending / sent / failed
- [ ] CLI: `pnpm queue:status` — show queue depth and recent job results
- [ ] Redis dependency added to Docker Compose

## Phase 10 — Multi-Agent System + Frontend Dashboard 🔲 FUTURE

- [ ] Multiple specialized agents (email-sender-agent, sms-sender-agent, push-sender-agent)
- [ ] Shared orchestrator that routes by channel
- [ ] Frontend dashboard (Next.js): send history, queue depth, live status
- [ ] Admin UI: retry failed jobs, inspect payloads, view delivery rates
