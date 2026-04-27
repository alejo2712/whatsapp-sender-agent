const isoNow = () => new Date().toISOString();

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => {
    const suffix = meta ? ` ${JSON.stringify(meta)}` : '';
    console.log(`[${isoNow()}] INFO  ${msg}${suffix}`);
  },
  success: (msg: string, meta?: Record<string, unknown>) => {
    const suffix = meta ? ` ${JSON.stringify(meta)}` : '';
    console.log(`[${isoNow()}] OK    ${msg}${suffix}`);
  },
  warn: (msg: string, meta?: Record<string, unknown>) => {
    const suffix = meta ? ` ${JSON.stringify(meta)}` : '';
    console.warn(`[${isoNow()}] WARN  ${msg}${suffix}`);
  },
  error: (msg: string, meta?: Record<string, unknown>) => {
    const suffix = meta ? ` ${JSON.stringify(meta)}` : '';
    console.error(`[${isoNow()}] ERROR ${msg}${suffix}`);
  },
};
