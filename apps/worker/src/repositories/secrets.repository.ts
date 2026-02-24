import { SecretDatabaseRecord } from '../types';

export class SecretsRepository {
  constructor(private db: D1Database) { }

  async create(id: string, type: string, cipherText: string, iv: string, isBurn: number, expiresAt: number): Promise<void> {
    await this.db.prepare(
      `INSERT INTO secrets (id, type, cipher_text, iv, is_burn_after_read, expires_at) VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(id, type, cipherText, iv, isBurn, expiresAt).run();
  }

  async getMetadata(id: string, now: number): Promise<Pick<SecretDatabaseRecord, 'is_burn_after_read' | 'type'> | null> {
    return await this.db.prepare(
      `SELECT is_burn_after_read, type FROM secrets WHERE id = ? AND expires_at > ?`
    ).bind(id, now).first<Pick<SecretDatabaseRecord, 'is_burn_after_read' | 'type'>>();
  }

  // Atomic delete to prevent race conditions
  async atomicDeleteAndReturn(id: string): Promise<Pick<SecretDatabaseRecord, 'cipher_text' | 'iv' | 'type'> | null> {
    return await this.db.prepare(
      `DELETE FROM secrets WHERE id = ? RETURNING cipher_text, iv, type`
    ).bind(id).first<Pick<SecretDatabaseRecord, 'cipher_text' | 'iv' | 'type'>>();
  }

  async getById(id: string): Promise<Pick<SecretDatabaseRecord, 'cipher_text' | 'iv' | 'type'> | null> {
    return await this.db.prepare(
      `SELECT cipher_text, iv, type FROM secrets WHERE id = ?`
    ).bind(id).first<Pick<SecretDatabaseRecord, 'cipher_text' | 'iv' | 'type'>>();
  }

  async getExpiredFiles(now: number, limit: number = 100, offset: number = 0): Promise<Pick<SecretDatabaseRecord, 'cipher_text'>[]> {
    const { results } = await this.db.prepare(
      `SELECT cipher_text FROM secrets WHERE type = 'file' AND expires_at < ? LIMIT ? OFFSET ?`
    ).bind(now, limit, offset).all<Pick<SecretDatabaseRecord, 'cipher_text'>>();
    return results || [];
  }

  async deleteExpired(now: number): Promise<void> {
    await this.db.prepare(`DELETE FROM secrets WHERE expires_at < ?`).bind(now).run();
  }
}