import { z } from 'zod';

export type Bindings = {
  DB: D1Database;
  VAULT_BUCKET: R2Bucket;
  R2_ACCOUNT_ID: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  API_KEY: string;
  ALLOWED_ORIGINS?: string;
  RATE_LIMIT_KV?: KVNamespace;
};

// Message Secret Schema
export const MessageSecretSchema = z.object({
  type: z.literal('message'),
  cipherText: z.string().min(10).max(100000), // Increased min for better security
  iv: z.string().min(16).max(64),
  isBurnAfterRead: z.boolean(),
  expiresInHours: z.number().int().min(1).max(720) // Up to 30 days
});

// File Secret Schema
export const FileSecretSchema = z.object({
  type: z.literal('file'),
  cipherText: z.string().min(10).max(1024), // R2 Object Key
  iv: z.string().min(16).max(512), // Combined IV and Metadata
  isBurnAfterRead: z.boolean(),
  expiresInHours: z.number().int().min(1).max(720)
});

export const SecretPayloadSchema = z.discriminatedUnion('type', [
  MessageSecretSchema,
  FileSecretSchema
]);

export type MessageSecretPayload = z.infer<typeof MessageSecretSchema>;
export type FileSecretPayload = z.infer<typeof FileSecretSchema>;
export type SecretPayload = z.infer<typeof SecretPayloadSchema>;

export interface SecretDatabaseRecord {
  id: string;
  type: 'message' | 'file';
  cipher_text: string;
  iv: string;
  is_burn_after_read: number;
  expires_at: number;
  created_at: number;
}