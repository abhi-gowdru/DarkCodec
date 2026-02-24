import { Context, Next } from 'hono';
import { Bindings } from '../types';

// Export configurations to avoid Hono's generic type mismatch errors
export const getCorsConfig = (env: Bindings) => {
  const allowed = env.ALLOWED_ORIGINS ? env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'];
  return {
    origin: allowed,
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'X-API-Key'],
    maxAge: 86400,
  };
};

export const secureHeadersConfig = {
  xFrameOptions: 'DENY',
  xXssProtection: '1; mode=block',
  strictTransportSecurity: 'max-age=31536000; includeSubDomains; preload',
  xContentTypeOptions: 'nosniff',
};

/**
 * Middleware to validate API Key
 */
export const apiKeyAuth = async (c: Context<{ Bindings: Bindings }>, next: Next) => {
  const apiKey = c.req.header('X-API-Key');

  if (!apiKey || apiKey !== c.env.API_KEY) {
    return c.json({ error: 'Unauthorized: Invalid or missing API Key' }, 401);
  }

  await next();
};