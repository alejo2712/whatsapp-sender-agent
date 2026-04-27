# State

> Last updated: 2026-04-27

---

## Current Status

**Phase 2 complete. Mock mode fully operational.**
Real Meta API integration is ready in code but **blocked on credentials**.

---

## What Is Implemented

### Source

| File | Description |
|---|---|
| `src/config/env.ts` | Zod-validated env. `WHATSAPP_MODE` required. Meta credentials optional (validated separately by `getLiveCredentials()`). Lazy-loaded with `resetEnv()` for tests. |
| `src/types/whatsapp.types.ts` | All shared types: payloads, responses, inputs, results |
| `src/utils/logger.ts` | Structured console logger with ISO timestamps |
| `src/tools/whatsapp-client.interface.ts` | `IWhatsAppClient` — contract for all transport implementations |
| `src/tools/mock-whatsapp.client.ts` | Simulates success responses, unique fake IDs, 80ms delay |
| `src/tools/whatsapp-cloud-api.client.ts` | Live HTTP client (Axios). Calls `getLiveCredentials()` at construction. **BLOCKED until credentials available.** |
| `src/tools/whatsapp-client.factory.ts` | Routes to mock or live client based on `WHATSAPP_MODE` |
| `src/skills/validate-phone.skill.ts` | E.164 without "+" — rejects, normalizes |
| `src/skills/build-whatsapp-payload.skill.ts` | `buildTextPayload`, `buildTemplatePayload` |
| `src/skills/send-whatsapp-message.skill.ts` | Calls `IWhatsAppClient.sendMessage`, maps to `SendResult` |
| `src/agents/whatsapp-sender.agent.ts` | Orchestrates skills. Constructor injection for `IWhatsAppClient`. |
| `src/cli.ts` | Parses argv. Prints mode at start. Calls agent. Prints structured result. |

### Tests (22 passing)

| File | Cases |
|---|---|
| `tests/validate-phone.test.ts` | 6 — valid, "+", too short, too long, letters, whitespace |
| `tests/build-whatsapp-payload.test.ts` | 3 — text payload, template without components, template with components |
| `tests/env.test.ts` | 7 — mode default, mode=live, invalid mode, mock no-credentials, live credentials, live missing token, version default |
| `tests/mock-whatsapp-client.test.ts` | 3 — text response, template response, unique IDs |
| `tests/send-whatsapp-message.test.ts` | 3 — success, Meta API error, unexpected error |

---

## What Is Pending

### No credentials needed

- [ ] **Phase 3** — Log send results to `logs/sends.jsonl` (persistence without a DB)
- [ ] **Phase 5** — Template parameter injection (`--params '{"name":"Juan"}'`)
- [ ] **Phase 7** — REST API adapter (NestJS thin wrapper)

### Blocked — awaiting Meta credentials

- [ ] **Phase 4** — Real Meta API integration
  - Need: `META_ACCESS_TOKEN` (permanent System User token)
  - Need: `META_PHONE_NUMBER_ID`
  - Steps after obtaining: set `WHATSAPP_MODE=live` in `.env`, smoke test

### Future

- [ ] Phase 6 — Webhook receiver (inbound messages, delivery status)
- [ ] Phase 8 — Orchestrator agent (separate repo/package)
- [ ] Phase 9 — BullMQ queue-backed delivery
- [ ] Phase 10 — Frontend dashboard

---

## WHATSAPP_MODE=mock — confirmed working

```
pnpm send --to 5491112345678 --message "Hello"
→ mode: mock
→ success: true
→ messageId: mock-wamid-{timestamp}-{random}
→ NO network calls made
```

---

## Meta Credentials — Status: MISSING

The integration code is complete. To activate live mode:

1. Go to https://developers.facebook.com/apps/ → your app → WhatsApp → API Setup
2. Copy `META_PHONE_NUMBER_ID` from the page
3. Generate a permanent token: Business Manager → System Users → Generate Token
4. Set in `.env`:
   ```
   WHATSAPP_MODE=live
   META_ACCESS_TOKEN=your_token
   META_PHONE_NUMBER_ID=your_id
   META_GRAPH_API_VERSION=v21.0
   ```
5. Run: `pnpm send --to <your_verified_test_number> --message "Hello"`

---

## Next Session Instructions

1. Run `git log --oneline -10` — check recent commits
2. Run `pnpm test` — confirm 22 tests pass baseline
3. Read CLAUDE.md for architecture rules before any change
4. If credentials are now available → switch to Phase 4
5. If not → next priority is Phase 3 (logging/persistence)
6. Do NOT re-scaffold anything — all Phase 1 and Phase 2 files are complete
