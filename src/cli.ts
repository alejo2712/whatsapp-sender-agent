#!/usr/bin/env node
import 'dotenv/config';
import { getEnv } from './config/env.js';
import { WhatsAppSenderAgent } from './agents/whatsapp-sender.agent.js';
import { logger } from './utils/logger.js';
import { SendResult } from './types/whatsapp.types.js';

const args = process.argv.slice(2);
const command = args[0];

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

function printResult(result: SendResult) {
  console.log('\n--- Result ---');
  if (result.success) {
    console.log('success:  ', true);
    console.log('messageId:', result.messageId ?? '(none)');
  } else {
    console.log('success:  ', false);
    console.log('error.code:', result.error?.code);
    console.log('error.type:', result.error?.type);
    console.log('error.message:', result.error?.message);
    process.exitCode = 1;
  }
}

async function main() {
  const { WHATSAPP_MODE } = getEnv();
  logger.info(`whatsapp-sender-agent starting`, { mode: WHATSAPP_MODE });

  const agent = new WhatsAppSenderAgent();

  if (command === 'send') {
    const to = getArg('--to');
    const message = getArg('--message');

    if (!to || !message) {
      logger.error('Usage: pnpm send --to <phone> --message "<text>"');
      process.exit(1);
    }

    const result = await agent.sendText({ to, message });
    printResult(result);
    return;
  }

  if (command === 'send:template') {
    const to = getArg('--to');
    const template = getArg('--template');
    const lang = getArg('--lang');

    if (!to || !template || !lang) {
      logger.error('Usage: pnpm send:template --to <phone> --template <name> --lang <code>');
      process.exit(1);
    }

    const result = await agent.sendTemplate({ to, template, lang });
    printResult(result);
    return;
  }

  logger.error(`Unknown command: "${command ?? '(none)'}". Available: send, send:template`);
  process.exit(1);
}

main().catch((err) => {
  logger.error('Fatal error', { message: err instanceof Error ? err.message : String(err) });
  process.exit(1);
});
