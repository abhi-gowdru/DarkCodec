import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const generateSecureUploadPolicy = async (
  accountId: string,
  accessKeyId: string,
  secretAccessKey: string,
  bucketName: string,
  objectKey: string,
  contentType: string
) => {
  const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  // 1. Use PutObjectCommand for a clean PUT upload
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    ContentType: contentType,
  });

  // 2. This returns a pure, flat string URL (e.g., "https://...")
  const signedUrl = await getSignedUrl(S3, command, { expiresIn: 900 });

  return signedUrl;
};

export const generateSecureDownloadUrl = async (
  accountId: string,
  accessKeyId: string,
  secretAccessKey: string,
  bucketName: string,
  objectKey: string
) => {
  const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  return await getSignedUrl(S3, command, { expiresIn: 300 }); // 5 minutes expiry (Swiss-tight)
};