import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  META_ACCESS_TOKEN: z.string({ required_error: 'META_ACCESS_TOKEN is required' }).min(1, 'META_ACCESS_TOKEN is required'),
  META_PHONE_NUMBER_ID: z.string({ required_error: 'META_PHONE_NUMBER_ID is required' }).min(1, 'META_PHONE_NUMBER_ID is required'),
  META_GRAPH_API_VERSION: z.string().default('v21.0'),
});

function loadEnv() {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    const missing = result.error.issues.map((i) => i.message).join('\n  ');
    throw new Error(`Environment configuration error:\n  ${missing}\n\nCopy .env.example to .env and fill in your values.`);
  }
  return result.data;
}

export type Env = z.infer<typeof EnvSchema>;

// Lazily validated — only throws when first accessed, allowing test files to import modules safely.
let _env: Env | null = null;

export function getEnv(): Env {
  if (!_env) {
    _env = loadEnv();
  }
  return _env;
}

// For tests: reset cached env so each test can set its own process.env
export function resetEnv(): void {
  _env = null;
}
