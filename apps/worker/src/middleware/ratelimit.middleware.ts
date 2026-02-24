import { Context, Next } from 'hono';
import { Bindings } from '../types';

/**
 * Production-Grade Distributed Rate Limiter
 * 
 * Scalability: Uses Cloudflare KV if available to provide a global rate limit across all isolates.
 * Fallback: Uses an in-memory Map (local to isolate) if KV is not configured.
 */
export const rateLimit = (limit: number, windowSeconds: number) => {
    // In-memory fallback for local development or when KV is missing
    const localCache = new Map<string, { count: number; reset: number }>();

    return async (c: Context<{ Bindings: Bindings }>, next: Next) => {
        const apiKey = c.req.header('X-API-Key');
        const identifier = apiKey || 'public';
        const now = Math.floor(Date.now() / 1000);
        const kv = c.env.RATE_LIMIT_KV;

        if (kv) {
            // --- Distributed KV Logic ---
            const kvKey = `rl:${identifier}`;
            const data = await kv.get<{ count: number; reset: number }>(kvKey, 'json');

            if (!data || now > data.reset) {
                await kv.put(kvKey, JSON.stringify({ count: 1, reset: now + windowSeconds }), {
                    expirationTtl: windowSeconds > 60 ? windowSeconds : 60 // Minimum 60s for KV expiration
                });
                return await next();
            }

            if (data.count >= limit) {
                return c.json({
                    error: 'Shield activated: Too many requests. Please try again later.',
                    retryAfter: data.reset - now
                }, 429);
            }

            await kv.put(kvKey, JSON.stringify({ count: data.count + 1, reset: data.reset }), {
                expirationTtl: windowSeconds > 60 ? windowSeconds : 60
            });
        } else {
            // --- Local Fallback Logic ---
            const window = localCache.get(identifier);

            if (!window || now > window.reset) {
                localCache.set(identifier, { count: 1, reset: now + windowSeconds });
                return await next();
            }

            if (window.count >= limit) {
                return c.json({
                    error: 'Local limit reached. For production scale, please bind RATE_LIMIT_KV.',
                    retryAfter: window.reset - now
                }, 429);
            }

            window.count++;
        }

        await next();
    };
};
