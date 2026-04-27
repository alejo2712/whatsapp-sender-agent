# Roadmap

## Phase 1 — CLI Agent (current)

- [x] Project scaffold: TypeScript, pnpm, Zod, Axios, Vitest
- [x] `validatePhone` skill — E.164 without "+" prefix
- [x] `buildTextPayload` skill — text message payload builder
- [x] `buildTemplatePayload` skill — template payload builder
- [x] `WhatsAppCloudApiClient` tool — HTTP client for Meta Graph API
- [x] `sendWhatsAppMessage` skill — executes API call, maps result
- [x] `WhatsAppSenderAgent` — orchestrates skills for a single operation
- [x] CLI (`pnpm send`, `pnpm send:template`)
- [x] Tests for all skills and env validation
- [x] Documentation: README, architecture, usage, Meta setup guide

## Phase 2 — REST API Adapter

- [ ] Wrap agent in a thin NestJS or Express HTTP layer
- [ ] `POST /messages/text` and `POST /messages/template` endpoints
- [ ] Request validation via DTOs (class-validator)
- [ ] Auth header validation (internal API key)
- [ ] Docker Compose setup for local serving

## Phase 3 — Queue-backed Delivery

- [ ] BullMQ job queue for send operations
- [ ] Configurable retry policy (exponential backoff)
- [ ] Job status tracking (pending / sent / failed)
- [ ] Dashboard or CLI status command

## Phase 4 — Orchestrator Integration

- [ ] Parent orchestrator agent that reads a recipient list and delegates to this agent
- [ ] n8n webhook adapter (receive trigger → call agent → return result)
- [ ] Campaign guard: this agent never reads campaign state itself

## Phase 5 — Media Support

- [ ] Image message payloads
- [ ] Document message payloads
- [ ] Template components with media headers

## Backlog

- Webhook receiver for inbound messages and delivery status callbacks
- Template parameter injection (body variables in `send:template`)
- PostgreSQL logging of all sent messages
- Multiple phone number IDs (routing by account)
