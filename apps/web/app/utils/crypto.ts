/**
 * Enterprise-Grade Web Crypto Engine (AES-256-GCM)
 * SSR-Safe, Base64URL-Safe, and Memory-Optimized for large payloads
 */

// 1. Generate a mathematically secure random key
export async function generateSymmetricKey(): Promise<CryptoKey> {
  return (await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true, // Extractable so we can put it in the URL hash
    ["encrypt", "decrypt"]
  )) as CryptoKey;
}

// 2. Encrypt the payload
export async function encryptData(key: CryptoKey, plainText: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  
  // IV (Initialization Vector) must be strictly 12 bytes for AES-GCM
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );

  return {
    // We strictly use Base64URL so data is always safe for network transport
    cipherText: arrayBufferToBase64Url(cipherBuffer),
    iv: arrayBufferToBase64Url(iv.buffer),
  };
}

// 3. Decrypt the payload
export async function decryptData(key: CryptoKey, cipherTextBase64Url: string, ivBase64Url: string): Promise<string> {
  try {
    const cipherBuffer = base64UrlToArrayBuffer(cipherTextBase64Url);
    const ivBuffer = base64UrlToArrayBuffer(ivBase64Url);

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(ivBuffer) },
      key,
      cipherBuffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    // We intentionally swallow the specific crypto error so attackers 
    // cannot use timing/padding oracle attacks.
    console.error("[Vault] Decryption failed. Invalid key or corrupted data.");
    throw new Error("Decryption failed");
  }
}

// --- Key Export/Import for the URL Hash ---

export async function exportKeyToBase64Url(key: CryptoKey): Promise<string> {
  const exported = (await crypto.subtle.exportKey("raw", key)) as ArrayBuffer;
  return arrayBufferToBase64Url(exported);
}

export async function importKeyFromBase64Url(base64UrlKey: string): Promise<CryptoKey> {
  const keyBuffer = base64UrlToArrayBuffer(base64UrlKey);
  return await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

// --- High-Performance Base64URL Helpers ---

/**
 * Converts an ArrayBuffer to a URL-Safe Base64 string.
 * Uses a chunked memory approach to prevent "Maximum call stack size exceeded" 
 * errors when dealing with massive payloads.
 */
function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  
  // Process in 32KB chunks to prevent stack overflows and UI freezing
  const chunkSize = 0x8000; 
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    // Array.from is required here because standard arrays pass perfectly into apply
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  const base64 = globalThis.btoa(binary);
  
  // Convert standard Base64 to URL-Safe Base64URL
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''); // Strip padding
}

/**
 * Converts a URL-Safe Base64 string back to an ArrayBuffer.
 */
function base64UrlToArrayBuffer(base64Url: string): ArrayBuffer {
  // Revert Base64URL formatting back to standard Base64
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  
  // Re-add removed padding
  while (base64.length % 4) {
    base64 += '=';
  }
  
  const binaryString = globalThis.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  
  // This loop is safe for decoding because we are assigning to a pre-allocated array, 
  // not concatenating a string.
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return bytes.buffer;
}