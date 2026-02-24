import { SecretsRepository } from '../repositories/secrets.repository';
import { getExpirationTimestamp, getNow } from '../utils/time.utils';
import { generateSecureDownloadUrl } from '../utils/r2-presigner';
import { SecretPayload, Bindings, SecretDatabaseRecord } from '../types';

export class SecretsService {
  private repo: SecretsRepository;

  constructor(private env: Bindings, private ctx: ExecutionContext) {
    this.repo = new SecretsRepository(env.DB);
  }

  // URL-safe NanoID generator (no dashes, unbreakable by bots)
  // 32 characters @ 6 bits per char = 192 bits of entropy
  private generateNanoId(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Removed _- for even cleaner URLs
    let id = '';
    for (let i = 0; i < 32; i++) {
      id += alphabet[bytes[i] % 62]; // Updated to 62 to match alphabet
    }
    return id;
  }

  async saveSecret(payload: SecretPayload): Promise<string> {
    const id = this.generateNanoId();
    const expiresAt = getExpirationTimestamp(payload.expiresInHours);
    const isBurn = payload.isBurnAfterRead ? 1 : 0;

    await this.repo.create(id, payload.type, payload.cipherText, payload.iv, isBurn, expiresAt);
    return id;
  }

  async retrieveSecret(id: string): Promise<Pick<SecretDatabaseRecord, 'cipher_text' | 'iv' | 'type'> & { downloadUrl?: string } | null> {
    const now = getNow();
    const meta = await this.repo.getMetadata(id, now);

    if (!meta) return null;

    let secretRecord: Pick<SecretDatabaseRecord, 'cipher_text' | 'iv' | 'type'> & { downloadUrl?: string } | null = null;

    if (meta.is_burn_after_read === 1) {
      secretRecord = await this.repo.atomicDeleteAndReturn(id);

      if (secretRecord && secretRecord.type === 'file' && secretRecord.cipher_text) {
        const fileKey = secretRecord.cipher_text;

        // --- 5-Minute Grace Period for Burn After Read Files ---
        // This ensures the user has time to download the file after opening the link
        this.ctx.waitUntil(
          new Promise(resolve => setTimeout(resolve, 300000)) // 5 minutes
            .then(() => this.env.VAULT_BUCKET.delete(fileKey))
            .then(() => console.log(`[R2] Wiped file after grace period: ${fileKey}`))
            .catch((error: unknown) => console.error(`[R2] Failed to wipe ${fileKey}:`, error))
        );
      }
    } else {
      secretRecord = await this.repo.getById(id);
    }

    // If it's a file, we generate a signed download URL
    if (secretRecord && secretRecord.type === 'file' && secretRecord.cipher_text) {
      secretRecord.downloadUrl = await generateSecureDownloadUrl(
        this.env.R2_ACCOUNT_ID,
        this.env.R2_ACCESS_KEY_ID,
        this.env.R2_SECRET_ACCESS_KEY,
        "devilcodec-vault",
        secretRecord.cipher_text
      );
    }

    return secretRecord;
  }
}