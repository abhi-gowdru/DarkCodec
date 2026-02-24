// utils/crypto.ts

/**
 * Enterprise-Grade Web Crypto Engine (AES-256-GCM)
 * SSR-Safe: Uses global objects instead of 'window'
 */

// 1. Generate a mathematically secure random key
export async function generateSymmetricKey(): Promise<CryptoKey> {
    // Cast the result to 'CryptoKey' since AES-GCM is symmetric (not a KeyPair)
    return (await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true, // Extractable so we can put it in the URL hash
        ["encrypt", "decrypt"]
    )) as CryptoKey;
}

// 2. Encrypt the payload (Message or File Base64)
export async function encryptData(key: CryptoKey, plainText: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);

    // IV (Initialization Vector) must be unique for every encryption
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const cipherBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        data
    );

    return {
        cipherText: arrayBufferToBase64(cipherBuffer),
        iv: arrayBufferToBase64(iv.buffer),
    };
}

// 3. Decrypt the payload
export async function decryptData(key: CryptoKey, cipherTextBase64: string, ivBase64: string): Promise<string> {
    const cipherBuffer = base64ToArrayBuffer(cipherTextBase64);
    const ivBuffer = base64ToArrayBuffer(ivBase64);

    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(ivBuffer) },
        key,
        cipherBuffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
}

// --- Key Export/Import for the URL Hash ---

export async function exportKeyToBase64(key: CryptoKey): Promise<string> {
    // Cast the result to 'ArrayBuffer' because we specifically requested the "raw" format
    const exported = (await crypto.subtle.exportKey("raw", key)) as ArrayBuffer;
    return arrayBufferToBase64(exported);
}

export async function importKeyFromBase64(base64Key: string): Promise<CryptoKey> {
    const keyBuffer = base64ToArrayBuffer(base64Key);
    return await crypto.subtle.importKey(
        "raw",
        keyBuffer,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

// --- ArrayBuffer to Base64 Helpers (Safe for Unicode) ---

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    // Use globalThis.btoa for cross-environment compatibility
    return globalThis.btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    // Use globalThis.atob for cross-environment compatibility
    const binaryString = globalThis.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}