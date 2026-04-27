# Meta WhatsApp Cloud API Setup

## Required Credentials

You need three values to use this agent:

| Variable | Where to find it |
|---|---|
| `META_ACCESS_TOKEN` | Meta Developer Portal → Your App → WhatsApp → API Setup |
| `META_PHONE_NUMBER_ID` | Same page, listed next to your test phone number |
| `META_GRAPH_API_VERSION` | Use `v21.0` unless Meta releases a newer stable version |

## What is META_ACCESS_TOKEN?

A Bearer token that authenticates your requests to the Graph API.

- **Temporary token** (for development): expires in ~24h, generated from the API Setup page in the Developer Portal. Fine for testing.
- **Permanent token** (for production): generated from a System User in Business Manager → Settings → System Users → Generate Token. Never expires unless revoked.

Do not commit either type of token. Store in `.env` only.

## What is META_PHONE_NUMBER_ID?

A numeric ID that represents the WhatsApp Business phone number your app sends from.
It is NOT the phone number itself. Example: `102345678901234`.

Each WhatsApp Business Account can have multiple phone numbers; each has its own ID.

## Free Text vs. Template Messages

### Template Messages

- Used to **initiate** conversations (when the customer has not messaged you in the last 24 hours).
- Must be pre-approved by Meta before use.
- Created in the Meta Business Manager → Account Overview → Message Templates.
- Can include variable parameters (e.g. customer name, order ID).

### Free Text Messages

- Used to **reply** within an open conversation window.
- A conversation window opens when the customer sends you a message and remains open for **24 hours** after their last message.
- After the 24-hour window expires, you must use a template to re-engage.

### Decision Rule

| Situation | Use |
|---|---|
| Customer messaged you in the last 24h | Free text (`send` command) |
| No recent message from customer | Template (`send:template` command) |
| Starting a proactive campaign | Template (required) |

## Test Phone Numbers

Meta provides a free test phone number on the Developer Portal. It can only send to up to 5 verified recipient numbers (added in the portal). For production, you need a Business-verified number.

## Useful Links

- [Meta WhatsApp Cloud API docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [API Setup page](https://developers.facebook.com/apps/) → Select your app → WhatsApp → API Setup
- [Business Manager](https://business.facebook.com/)
- [Message Templates guide](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates)
