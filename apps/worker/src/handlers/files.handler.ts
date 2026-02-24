import { Context } from 'hono';
import { Bindings } from '../types';
import { generateSecureUploadPolicy } from '../utils/r2-presigner';

export const getPresignedUrlHandler = async (
  c: Context<{ Bindings: Bindings }>
) => {
  try {
    const body = await c.req.json();
    const contentType =
      typeof body.contentType === "string"
        ? body.contentType
        : "application/octet-stream";

    const objectKey = crypto.randomUUID();

    const postPolicy = await generateSecureUploadPolicy(
      c.env.R2_ACCOUNT_ID,
      c.env.R2_ACCESS_KEY_ID,
      c.env.R2_SECRET_ACCESS_KEY,
      "devilcodec-vault",
      objectKey,
      contentType
    );

    return c.json({ success: true, postPolicy, objectKey });
  } catch (error) {
    console.error("Presigner error:", error);
    return c.json({ success: false, error: "Failed to generate upload policy" }, 500);
  }
};