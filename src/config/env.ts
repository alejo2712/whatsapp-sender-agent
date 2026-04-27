import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  WHATSAPP_MODE: z.enum(['mock', 'live']).default('mock'),

  // Required only in live mode — validated by WhatsAppCloudApiClient at instantiation.
  META_ACCESS_TOKEN: z.string().optional(),
  META_PHONE_NUMBER_ID: z.string().optional(),
  META_GRAPH_API_VERSION: z.string().default('v21.0'),
});

const LiveEnvSchema = z.object({
  META_ACCESS_TOKEN: z.string({ required_error: 'META_ACCESS_TOKEN is required in live mode' }).min(1),
  META_PHONE_NUMBER_ID: z.string({ required_error: 'META_PHONE_NUMBER_ID is required in live mode' }).min(1),
  META_GRAPH_API_VERSION: z.string().default('v21.0'),
});

function loadEnv() {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    const issues = result.error.issues.map((i) => i.message).join('\n  ');
    throw new Error(`Environment configuration error:\n  ${issues}\n\nCopy .env.example to .env and fill in your values.`);
  }
  return result.data;
}

export type Env = z.infer<typeof EnvSchema>;
export type LiveEnv = z.infer<typeof LiveEnvSchema>;

// Lazily validated — only throws when first accessed, keeping test imports safe.
let _env: Env | null = null;

export function getEnv(): Env {
  if (!_env) {
    _env = loadEnv();
  }
  return _env;
}

/**
 * Validates Meta-specific credentials required for live mode.
 * Called by WhatsAppCloudApiClient — never called in mock mode.
 */
export function getLiveCredentials(): LiveEnv {
  const result = LiveEnvSchema.safeParse(process.env);
  if (!result.success) {
    const issues = result.error.issues.map((i) => i.message).join('\n  ');
    throw new Error(
      `Live mode credential error:\n  ${issues}\n\nSet META_ACCESS_TOKEN and META_PHONE_NUMBER_ID in your .env file.\nSee docs/meta-whatsapp-setup.md for instructions.`,
    );
  }
  return result.data;
}

// For tests: reset cached env so each test can set its own process.env
export function resetEnv(): void {
  _env = null;
}
