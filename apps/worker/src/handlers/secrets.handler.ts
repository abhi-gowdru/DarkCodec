import { Context } from 'hono';
import { SecretsService } from '../services/secrets.service';
import { MessageSecretPayload, FileSecretPayload, Bindings } from '../types';

export const createMessageSecretHandler = async (c: Context<{ Bindings: Bindings }>) => {
  const body = (await c.req.json()) as MessageSecretPayload;
  const service = new SecretsService(c.env, c.executionCtx);
  const id = await service.saveSecret(body);
  return c.json({ success: true, id }, 201);
};

export const createFileSecretHandler = async (c: Context<{ Bindings: Bindings }>) => {
  const body = (await c.req.json()) as FileSecretPayload;
  const service = new SecretsService(c.env, c.executionCtx);
  const id = await service.saveSecret(body);
  return c.json({ success: true, id }, 201);
};

export const getSecretHandler = async (c: Context<{ Bindings: Bindings }>) => {
  const id = c.req.param('id');

  // Validate NanoID format (32 chars, alphanumeric)
  const nanoIdRegex = /^[0-9A-Za-z]{32}$/;
  if (!nanoIdRegex.test(id)) {
    return c.json({ error: 'Invalid identifier format' }, 400);
  }

  const service = new SecretsService(c.env, c.executionCtx);
  const secret = await service.retrieveSecret(id);

  if (!secret) {
    return c.json({ error: 'Secret not found, expired, or already destroyed.' }, 404);
  }

  return c.json({
    success: true,
    data: {
      type: secret.type,
      cipherText: secret.cipher_text,
      iv: secret.iv,
      downloadUrl: secret.downloadUrl
    }
  });
};