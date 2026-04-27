# Architecture

## Overview

`whatsapp-sender-agent` is a single-responsibility CLI agent that sends WhatsApp messages via the Meta Cloud API. It is the first component of a planned multi-agent orchestration system.

## Layer Diagram

```
CLI (cli.ts)
    └── WhatsAppSenderAgent (agents/)
            ├── validatePhone (skills/)
            ├── buildTextPayload / buildTemplatePayload (skills/)
            └── sendWhatsAppMessage (skills/)
                    └── WhatsAppCloudApiClient (tools/)
                                └── Meta Graph API (external)
```

## Responsibilities by Layer

| Layer   | Path                        | Responsibility                                    |
|---------|-----------------------------|---------------------------------------------------|
| Agent   | `agents/whatsapp-sender.agent.ts` | Orchestrates skills for one send operation  |
| Skills  | `skills/`                   | Single-purpose functions: validate, build, send   |
| Tools   | `tools/whatsapp-cloud-api.client.ts` | HTTP client for Meta Graph API           |
| Config  | `config/env.ts`             | Env var validation via Zod                        |
| Types   | `types/whatsapp.types.ts`   | Shared TypeScript types for all layers            |
| Utils   | `utils/logger.ts`           | Structured console logger                         |
| CLI     | `cli.ts`                    | Parses args, invokes agent, prints result         |

## Orchestrator Integration Points

The `WhatsAppSenderAgent` class can be imported directly by:

- **n8n** — via a Code node that calls this module programmatically
- **REST API wrapper** — a thin NestJS/Express controller that constructs the input and calls the agent
- **Orchestrator agent** — any parent agent passes `SendTextInput` or `SendTemplateInput` and receives `SendResult`

The agent never pulls recipients from a database, never reads a campaign list, and never decides what to send. The caller is always responsible for those decisions.

## Data Flow

```
Input (phone + message/template)
    → validatePhone       — rejects bad format, strips whitespace
    → buildPayload        — constructs Meta API JSON structure
    → sendWhatsAppMessage — calls WhatsAppCloudApiClient
    → WhatsAppCloudApiClient → POST /messages
    → SendResult (success | error)
```

## Error Handling

- `ValidationError` (code 400): invalid phone number, returned before any HTTP call
- `WhatsAppApiClientError`: Meta API rejected the request (wraps Meta error code + type)
- Generic errors: network timeouts, DNS failures — wrapped with code -1
