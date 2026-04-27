#!/usr/bin/env node
import 'dotenv/config';
import { WhatsAppSenderAgent } from './agents/whatsapp-sender.agent.js';
import { logger } from './utils/logger.js';

const args = process.argv.slice(2);
const command = args[0];

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

function printResult(result: { success: boolean; messageId?: string; error?: { code: number; message: string; type: string } }) {
  if (result.success) {
    console.log('\n--- Result ---');
    console.log('success:', true);
    console.log('messageId:', result.messageId ?? '(none)');
  } else {
    console.log('\n--- Result ---');
    console.log('success:', false);
    console.log('error.code:', result.error?.code);
    console.log('error.type:', result.error?.type);
    console.log('error.message:', result.error?.message);
    process.exitCode = 1;
  }
}

async function main() {
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

  logger.error(`Unknown command: "${command ?? '(none)'}". Use "send" or "send:template".`);
  process.exit(1);
}

main().catch((err) => {
  logger.error('Fatal error', { message: err instanceof Error ? err.message : String(err) });
  process.exit(1);
});
