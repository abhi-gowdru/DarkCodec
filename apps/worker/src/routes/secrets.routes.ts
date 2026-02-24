import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { MessageSecretSchema, FileSecretSchema, Bindings } from '../types';
import { createMessageSecretHandler, createFileSecretHandler, getSecretHandler } from '../handlers/secrets.handler';
import { getPresignedUrlHandler } from '../handlers/files.handler';

import { apiKeyAuth } from '../middleware/security.middleware';
import { rateLimit } from '../middleware/ratelimit.middleware';

const router = new Hono<{ Bindings: Bindings }>();

// Message & Metadata Endpoints - Protected & Rate Limited
router.post(
    '/message',
    apiKeyAuth,
    rateLimit(10, 60), // 10 creations per minute per key
    zValidator('json', MessageSecretSchema),
    createMessageSecretHandler
);

router.post(
    '/file',
    apiKeyAuth,
    rateLimit(5, 60), // 5 file metadata creations per minute per key
    zValidator('json', FileSecretSchema),
    createFileSecretHandler
);

// Retrieval Endpoint - Public but Rate Limited to prevent brute force
router.get(
    '/:id',
    rateLimit(30, 60), // 30 retrievals per minute (public/per-key)
    getSecretHandler
);

// File Presigner Endpoint - Protected & Rate Limited
router.post(
    '/presign',
    apiKeyAuth,
    rateLimit(5, 60),
    getPresignedUrlHandler
);

export default router;