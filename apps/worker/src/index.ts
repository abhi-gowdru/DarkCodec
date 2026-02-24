import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { Bindings } from './types';
import { getCorsConfig, secureHeadersConfig } from './middleware/security.middleware';
import secretsRouter from './routes/secrets.routes';
import { SecretsRepository } from './repositories/secrets.repository';
import { getNow } from './utils/time.utils';

const app = new Hono<{ Bindings: Bindings }>();

// --- Global Middleware ---
app.use('*', secureHeaders(secureHeadersConfig));
app.use('*', async (c, next) => {
  const corsMiddleware = cors(getCorsConfig(c.env));
  return corsMiddleware(c, next);
});

// --- Global Error Handler ---
app.onError((err, c) => {
  console.error(`[Server Error] ${err.message}`);
  return c.json({ error: 'An unexpected error occurred.' }, 500);
});

// --- Routes ---
app.route('/api/secrets', secretsRouter);

export default {
  // 1. HTTP Request Handler
  fetch: app.fetch,

  // 2. Scheduled Cron Job (Sweeps expired secrets)
  async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
    const now = getNow();
    const repo = new SecretsRepository(env.DB);
    const PAGE_SIZE = 100;

    try {
      console.log(`[Cron] Starting sweep at ${new Date().toISOString()}`);

      // Paginated File Cleanup from R2
      let hasMore = true;
      let offset = 0;

      while (hasMore) {
        const expiredFiles = await repo.getExpiredFiles(now, PAGE_SIZE, offset);

        if (expiredFiles && expiredFiles.length > 0) {
          for (const row of expiredFiles) {
            if (row.cipher_text) {
              ctx.waitUntil(
                env.VAULT_BUCKET.delete(row.cipher_text)
                  .catch((e: unknown) => console.error(`[Cron R2 Error]:`, e))
              );
            }
          }

          if (expiredFiles.length < PAGE_SIZE) {
            hasMore = false;
          } else {
            offset += PAGE_SIZE;
          }
        } else {
          hasMore = false;
        }
      }

      // Batch Delete from D1
      await repo.deleteExpired(now);
      console.log(`[Cron] Sweep completed successfully.`);

    } catch (e: unknown) {
      console.error("[Cron] Execution failed:", e);
    }
  }
};