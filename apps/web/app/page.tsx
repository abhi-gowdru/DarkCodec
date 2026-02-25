"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect, useCallback } from "react"
import {
  FileText,
  MessageSquare,
  Shield,
  Lock,
  Key,
  Upload,
  Send,
  Check,
  Flame,
  Clock,
  Copy,
  CheckCheck,
  MessageCircle,
  PlusCircle,
} from "lucide-react"
import Link from "next/link"
import { FaWhatsapp, FaTelegramPlane, FaSms, FaEnvelope } from "react-icons/fa"
import { exportKeyToBase64Url, encryptData, generateSymmetricKey } from "./utils/crypto"
import Turnstile, { TurnstileHandle } from "@/components/security/Turnstile"


// --- Enterprise Splash Screen ---
const InitialLoader = () => (
  <motion.div
    key="initial-loader"
    initial={{ opacity: 1 }}
    // The exit animation smoothly blurs and scales the loader away
    exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
    // FIX: z-[100] guarantees absolutely nothing renders above this
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 w-screen h-screen overflow-hidden"
  >
    <BackgroundAnimation />

    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center gap-8 relative z-10"
    >
      {/* Glowing Shield Assembly */}
      <div className="relative flex items-center justify-center">
        {/* Pulsing Aura */}
        <motion.div
          className="absolute w-32 h-32 bg-blue-600/20 rounded-full blur-[30px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Rotating Outer Ring */}
        <motion.div
          className="absolute w-20 h-20 rounded-full border border-dashed border-blue-500/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <Shield className="w-10 h-10 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)] relative z-10" />
      </div>

      {/* Typography & Status */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-extrabold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-500 uppercase">
          Secure Vault
        </h2>
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 tracking-widest uppercase">
          Initializing Crypto Engine...
        </div>
      </div>

      {/* Sleek Progress Bar */}
      <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden shadow-inner border border-slate-800/60">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          // Matches the 2000ms enforced delay perfectly
          transition={{ duration: 1.8, ease: "easeInOut", delay: 0.2 }}
        />
      </div>
    </motion.div>
  </motion.div>
);

const BackgroundAnimation = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0A0A0A] flex items-center justify-center">
    {/* Deep ambient glow */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.08)_0%,transparent_70%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.05)_0%,transparent_70%)]" />

    {/* Slow rotating mesh/orbs */}
    {[0, 1].map((i) => (
      <motion.div
        key={i}
        className="absolute rounded-full blur-[100px] opacity-30"
        style={{
          background: i === 0 ? 'rgba(56,189,248,0.2)' : 'rgba(99,102,241,0.2)',
          width: '40vw',
          height: '40vw',
        }}
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 15 + i * 5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    ))}
    {/* Subtle noise texture */}
    <div className="absolute inset-0 opacity-[0.02] mix-blend-screen" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
  </div>
)


export function TabsLine({ activeTab, onValueChange }: { activeTab: string; onValueChange: (value: string) => void }) {
  const tabs = [
    { id: "message", label: "Message", icon: MessageSquare },
    { id: "file", label: "File", icon: FileText },
    { id: "chat", label: "Chat", icon: MessageCircle },
  ];

  return (
    <div className="flex w-full p-1.5 bg-black/80 backdrop-blur-2xl border border-slate-800/80 rounded-2xl shadow-[inset_0_1px_4px_rgba(0,0,0,0.4)] relative">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onValueChange(tab.id)}
            className={`relative flex-1 flex items-center justify-center py-3 text-sm font-semibold transition-colors duration-300 outline-none rounded-xl z-10 ${isActive
              ? "text-white"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-600 rounded-xl shadow-[0_2px_10px_rgba(37,99,235,0.3)] border border-blue-400/30"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-20 flex items-center gap-2">
              <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? "text-blue-100 scale-110" : "scale-100"}`} />
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("message");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isBurnAfterRead, setIsBurnAfterRead] = useState(true);
  const [expireTime, setExpireTime] = useState("1D");

  // Integration States
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const onVerifyToken = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";


  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isFileUploading, setIsFileUploading] = useState(false);

  // Loading State
  const [isAppLoading, setIsAppLoading] = useState(true);

  const isProcessing = useRef(false);

  // --- NEW: Synchronized Network & Animation Loader ---
  useEffect(() => {
    // We strictly enforce a minimum 2-second display so the 
    // premium progress bar animation actually finishes perfectly.
    const MINIMUM_DISPLAY_TIME = 2000;
    const startTime = Date.now();

    const finishLoading = () => {
      const timeElapsed = Date.now() - startTime;
      // Calculate how much time is left to reach the 2-second mark
      const remainingTime = Math.max(0, MINIMUM_DISPLAY_TIME - timeElapsed);

      setTimeout(() => {
        setIsAppLoading(false);
      }, remainingTime);
    };

    if (document.readyState === 'complete') {
      // If network is already fast, just wait out the remaining animation time
      finishLoading();
    } else {
      // If network is slow, wait for it to finish, THEN calculate remaining time
      window.addEventListener('load', finishLoading);
      return () => window.removeEventListener('load', finishLoading);
    }
  }, []);

  // Helper to wait for Turnstile token if it's still being generated
  const waitForToken = async (maxRetries = 10): Promise<string | null> => {
    let retries = 0;
    while (!turnstileToken && retries < maxRetries) {
      await new Promise(r => setTimeout(r, 500));
      retries++;
    }
    return turnstileToken;
  };

  // --- Core Encryption & API Logic ---
  const handleEncrypt = async () => {
    if (isProcessing.current || !messageText.trim()) return;

    isProcessing.current = true;
    setIsEncrypting(true);
    setError(null);

    try {
      // 1. Generate the AES Key on the device
      const key = await generateSymmetricKey();

      // 2. Encrypt the plaintext
      const { cipherText, iv } = await encryptData(key, messageText);

      // 3. Map the UI expiration to hours for the backend
      const hoursMap: Record<string, number> = { '1H': 1, '1D': 24, '1W': 168 };
      const expiresInHours = hoursMap[expireTime] || 24;

      // 4. Ensure Turnstile token is ready (Wait up to 5s)
      const token = await waitForToken();
      if (!token) {
        throw new Error("Security check took too long. Please refresh and try again.");
      }

      // 5. Send to Next.js API Proxy
      const response = await fetch(`/api/secrets/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'message',
          cipherText,
          iv,
          isBurnAfterRead,
          expiresInHours,
          turnstileToken: token, // Sent verified token
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to communicate with the vault.');
      }

      const data = await response.json();
      setTurnstileToken(null); // Reset for next use
      turnstileRef.current?.reset(); // Trigger fresh token generation

      // 5. Export Key & make it URL-safe (Base64URL) so apps don't truncate it
      let exportedKey = await exportKeyToBase64Url(key);
      exportedKey = exportedKey.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      // 6. Generate the final shareable link
      const shareUrl = `${window.location.origin}/view/${data.id}#${exportedKey}`;
      setGeneratedLink(shareUrl);

      // 7. Security Hygiene: Destroy the plaintext from memory immediately
      setMessageText("");

    } catch (err) {
      console.error("Encryption flow failed:", err);
      setError("Failed to encrypt and store message. Please try again.");
    } finally {
      setIsEncrypting(false);
      isProcessing.current = false;
    }
  };


  // --- Secure File Upload Engine ---
  const handleFileLock = async () => {
    if (!selectedFile || isProcessing.current) return;

    isProcessing.current = true;
    setIsFileUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // 1. Generate local AES Key
      const key = await generateSymmetricKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // 2. Read file to memory and encrypt it instantly (Client-Side)
      const fileBuffer = await selectedFile.arrayBuffer();
      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        fileBuffer
      );

      // The file is now mathematically locked. It is safe to transmit.
      const encryptedBlob = new Blob([encryptedBuffer]);

      // 3. Encrypt the Metadata (Filename & Type) so the server stays blind
      const metadata = JSON.stringify({ name: selectedFile.name, type: selectedFile.type });
      const { cipherText: encryptedMetadata, iv: metaIv } = await encryptData(key, metadata);

      // 4. Get Presigned URL from Next.js Proxy
      const presignRes = await fetch(`/api/secrets/presign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: 'application/octet-stream' })
      });

      if (!presignRes.ok) throw new Error("Failed to get secure upload channel");

      const resp = await presignRes.json();

      // BULLETPROOF EXTRACTION: 
      // This guarantees we get a string URL, whether the backend called it 'url' or 'postPolicy'
      const uploadUrl = typeof resp.url === 'string' ? resp.url : resp.postPolicy?.url || resp.postPolicy;
      const objectKey = resp.objectKey;

      if (!uploadUrl || typeof uploadUrl !== 'string') {
        throw new Error("Backend did not return a valid upload URL string.");
      }

      // 5. Upload directly to Cloudflare R2 with XHR to track progress (Using PUT)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // This will now correctly be "https://<account>.r2.cloudflarestorage.com/..."
        xhr.open("PUT", uploadUrl);

        xhr.setRequestHeader("Content-Type", "application/octet-stream");

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percent);
          }
        });

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed with status: ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error("Network connection lost"));

        // Send the raw encrypted blob
        xhr.send(encryptedBlob);
      });

      // 6. Save the record to D1 Database
      const hoursMap: Record<string, number> = { '1H': 1, '1D': 24, '1W': 168 };

      const token = await waitForToken();
      if (!token) throw new Error("Security check failed. Please refresh.");

      const fileIvBase64 = globalThis.btoa(String.fromCharCode(...iv));
      const combinedIvAndMeta = `${fileIvBase64}.${metaIv}.${encryptedMetadata}`;

      const dbRes = await fetch(`/api/secrets/file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'file',
          cipherText: objectKey, // The R2 file identifier
          iv: combinedIvAndMeta,
          isBurnAfterRead: isBurnAfterRead,
          expiresInHours: hoursMap[expireTime] || 24,
          turnstileToken: token, // Bot protection
        }),
      });

      if (!dbRes.ok) throw new Error("Failed to finalize vault record");
      const data = await dbRes.json();
      setTurnstileToken(null);
      turnstileRef.current?.reset();

      // 7. Generate final Base64URL key and Share Link
      let exportedKey = await exportKeyToBase64Url(key);
      const shareUrl = `${window.location.origin}/view/${data.id}#${exportedKey}`;

      setGeneratedLink(shareUrl);
      setSelectedFile(null); // Memory cleanup

    } catch (err) {
      console.error("File lock failed:", err);
      setError("Secure upload failed. Please check your connection.");
    } finally {
      setIsFileUploading(false);
      isProcessing.current = false;
      setUploadProgress(0);
    }
  };

  const copyToClipboard = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const resetVault = () => {
    setGeneratedLink(null);
    setIsConsentGiven(false);
    setError(null);
    turnstileRef.current?.reset();
  };




  return (
    <div className="relative min-h-screen text-slate-50 font-sans selection:bg-blue-500/30 flex flex-col">
      <BackgroundAnimation />
      <Turnstile
        ref={turnstileRef}
        siteKey={turnstileSiteKey}
        onVerify={onVerifyToken}
      />
      <AnimatePresence mode="wait">
        {isAppLoading ? <InitialLoader key="splash-screen" /> : (
          <div key="main-app" className="relative flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="mb-8 text-center flex flex-col items-center">
              <motion.div whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 backdrop-blur-md cursor-default">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-blue-400 tracking-wide uppercase">Zero-Knowledge Architecture</span>
              </motion.div>
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight">
                <span className="bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">Secure Vault</span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-sm">
                Client-side AES-256 encryption. Share sensitive data with absolute privacy—we never see your keys.
              </p>
            </motion.div>
            <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }} className="w-full max-w-md">
              <Card className="border-slate-800/60 bg-black/40 backdrop-blur-2xl shadow-2xl shadow-blue-900/5 ring-1 ring-white/5 w-full max-w-md">
                <CardHeader className="pt-6 px-6">
                  <TabsLine activeTab={activeTab} onValueChange={(val) => {
                    setActiveTab(val);
                    setError(null);
                    turnstileRef.current?.reset();
                    if (generatedLink) resetVault();
                  }} />
                </CardHeader>

                <CardContent className="px-6 pb-6 pt-4 overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>

                    {/* ---------------- MESSAGE TAB ---------------- */}
                    {activeTab === "message" && (
                      <motion.div key="message" initial={{ opacity: 0, x: 10, filter: "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: -10, filter: "blur(4px)" }} transition={{ duration: 0.25, ease: "easeInOut" }} className="space-y-5">

                        {generatedLink ? (
                          /* --- SUCCESS STATE UI --- */
                          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-4 space-y-6">

                            {/* Header */}
                            <div className="text-center space-y-2">
                              <div className="mx-auto w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                <Lock className="w-6 h-6 text-emerald-400" />
                              </div>
                              <h3 className="text-xl font-bold text-slate-100">Vault Locked</h3>
                              <p className="text-sm text-slate-400">Your secure link is ready. The encryption key is embedded in the URL and was never sent to our servers.</p>
                            </div>

                            {/* Link Input Box */}
                            <div className="relative group">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-xl blur opacity-50 transition duration-500" />
                              <div className="relative flex items-center bg-slate-950/80 border border-slate-700/60 p-2 rounded-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                                <Input readOnly value={generatedLink || ""} className="border-0 bg-transparent focus-visible:ring-0 text-slate-300 font-mono text-xs truncate h-10" />
                                <Button onClick={copyToClipboard} size="icon" variant="ghost" className="shrink-0 hover:bg-slate-800 text-slate-300 hover:text-white ml-2 transition-colors">
                                  {isCopied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                </Button>
                              </div>
                            </div>

                            {/* --- Quick Share Grid --- */}
                            <div className="pt-2">
                              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center mb-3">
                                Quick Share
                              </p>
                              <div className="flex items-center justify-center gap-3">
                                {/* WhatsApp (Official Icon) */}
                                <a
                                  href={`https://wa.me/?text=${encodeURIComponent(`I sent you a secure, encrypted message. It will self-destruct after reading.\n\nOpen it here: ${generatedLink}`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-3 rounded-full bg-slate-900 border border-slate-800 hover:border-[#25D366]/50 hover:bg-[#25D366]/10 text-slate-400 hover:text-[#25D366] transition-all duration-300 shadow-sm"
                                  title="Share via WhatsApp"
                                >
                                  <FaWhatsapp className="w-5 h-5" />
                                </a>

                                {/* Telegram (Official Icon) */}
                                <a
                                  href={`https://t.me/share/url?url=${encodeURIComponent(generatedLink || "")}&text=${encodeURIComponent("I sent you a secure, encrypted message. It will self-destruct after reading.")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-3 rounded-full bg-slate-900 border border-slate-800 hover:border-[#229ED9]/50 hover:bg-[#229ED9]/10 text-slate-400 hover:text-[#229ED9] transition-all duration-300 shadow-sm"
                                  title="Share via Telegram"
                                >
                                  <FaTelegramPlane className="w-5 h-5" />
                                </a>

                                {/* SMS */}
                                <a
                                  href={`sms:?body=${encodeURIComponent(`I sent you a secure, encrypted message. It will self-destruct after reading.\n\nOpen it here: ${generatedLink}`)}`}
                                  className="p-3 rounded-full bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-purple-500/10 text-slate-400 hover:text-purple-400 transition-all duration-300 shadow-sm"
                                  title="Share via SMS"
                                >
                                  <FaSms className="w-5 h-5" />
                                </a>

                                {/* Email */}
                                <a
                                  href={`mailto:?subject=${encodeURIComponent("Secure Encrypted Message")}&body=${encodeURIComponent(`I sent you a secure, encrypted message. It will self-destruct after reading.\n\nOpen it here: ${generatedLink}`)}`}
                                  className="p-3 rounded-full bg-slate-900 border border-slate-800 hover:border-orange-500/50 hover:bg-orange-500/10 text-slate-400 hover:text-orange-400 transition-all duration-300 shadow-sm"
                                  title="Share via Email"
                                >
                                  <FaEnvelope className="w-5 h-5" />
                                </a>
                              </div>
                            </div>

                            {/* --- Redesigned 'Create Another' Button --- */}
                            <div className="pt-2">
                              <Button
                                onClick={resetVault}
                                variant="ghost"
                                className="w-full h-12 rounded-xl border border-dashed border-slate-700/60 bg-slate-950/30 hover:bg-slate-900 hover:border-slate-600 text-slate-400 hover:text-slate-200 transition-all duration-300 group"
                              >
                                <PlusCircle className="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                Create Another Secret
                              </Button>
                            </div>

                          </motion.div>
                        ) : (
                          /* --- INPUT STATE UI --- */
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                            <div>
                              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-100">
                                <MessageSquare className="w-4 h-4 text-blue-400" />
                                Create Secret Message
                              </CardTitle>
                              <CardDescription className="text-slate-400 mt-1.5 text-sm">
                                Lock your sensitive info into a secure, shareable link.
                              </CardDescription>
                            </div>

                            {error && (
                              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
                                {error}
                              </div>
                            )}

                            <div className="space-y-5">
                              <div className="space-y-2">
                                <Label htmlFor="message" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                                  Your Secret Message
                                </Label>
                                <Textarea
                                  id="message"
                                  value={messageText}
                                  onChange={(e) => setMessageText(e.target.value)}
                                  placeholder="Enter passwords, private notes, or sensitive data you want to share safely..."
                                  className="min-h-[120px] bg-black/40 border-slate-700/60 focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 text-slate-100 placeholder:text-slate-600 resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] rounded-xl transition-all duration-300"
                                />
                              </div>

                              <div className="flex flex-col rounded-xl border border-slate-700/60 bg-black/40 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] overflow-hidden divide-y divide-slate-800/60">
                                <div className="flex items-center justify-between p-3.5 sm:p-4 cursor-pointer hover:bg-slate-800/20 transition-colors group" onClick={() => setIsBurnAfterRead(!isBurnAfterRead)}>
                                  <div className="flex items-center gap-3.5">
                                    <div className={`p-2 rounded-lg transition-all duration-300 ${isBurnAfterRead ? 'bg-orange-500/20 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.2)]' : 'bg-slate-900 text-slate-500'}`}>
                                      <Flame className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className={`text-sm font-semibold transition-colors duration-300 ${isBurnAfterRead ? 'text-slate-100' : 'text-slate-300'}`}>
                                        One-Time View
                                      </span>
                                      <span className="text-[11px] font-medium text-slate-500 mt-0.5 group-hover:text-slate-400 transition-colors">
                                        Message destroys forever after it is opened
                                      </span>
                                    </div>
                                  </div>
                                  <div className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out ${isBurnAfterRead ? 'bg-orange-500' : 'bg-slate-700'}`}>
                                    <motion.div layout className="inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0" animate={{ x: isBurnAfterRead ? 20 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between p-3.5 sm:p-4">
                                  <div className="flex items-center gap-3.5">
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                      <Clock className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-sm font-semibold text-slate-100">Expiration</span>
                                      <span className="text-[11px] font-medium text-slate-500 mt-0.5">Auto-destruct if not opened</span>
                                    </div>
                                  </div>
                                  <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 shadow-inner">
                                    {['1H', '1D', '1W'].map((time) => (
                                      <button key={time} onClick={() => setExpireTime(time)} className="relative px-3 py-1.5 text-xs font-bold rounded-md z-10 outline-none" style={{ WebkitTapHighlightColor: "transparent" }}>
                                        {expireTime === time && (
                                          <motion.div layoutId="expire-pill" className="absolute inset-0 bg-slate-800 rounded-md border border-slate-700 shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                        )}
                                        <span className={`relative z-20 transition-colors duration-300 tracking-wider ${expireTime === time ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                                          {time}
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ delay: 0.2, duration: 0.3 }}>
                                <ConsentCheckbox checked={isConsentGiven} onChange={setIsConsentGiven} />
                              </motion.div>

                              <motion.button onClick={handleEncrypt} disabled={isEncrypting || !isConsentGiven || messageText.trim() === ""} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="relative w-full h-12 flex items-center justify-center rounded-xl font-semibold text-white overflow-hidden shadow-[0_4px_20px_-4px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_8px_30px_-4px_rgba(37,99,235,0.6)] border border-blue-400/30 group transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-700" />
                                <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] pointer-events-none" />
                                <div className="relative z-10 flex items-center justify-center w-full">
                                  <AnimatePresence mode="wait">
                                    {isEncrypting ? (
                                      <motion.div key="encrypting" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2, ease: "easeOut" }} className="flex items-center gap-2">
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                                          <Lock className="w-4 h-4 text-blue-100 drop-shadow-md" />
                                        </motion.div>
                                        <span className="tracking-wide text-blue-50 drop-shadow-md">Locking Message...</span>
                                      </motion.div>
                                    ) : (
                                      <motion.div key="idle" initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.2, ease: "easeOut" }} className="flex items-center gap-2">
                                        <Send className="w-4 h-4 text-blue-100 drop-shadow-md group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                                        <span className="tracking-wide drop-shadow-md">Lock & Generate Link</span>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {/* ---------------- FILE TAB ---------------- */}
                    {activeTab === "file" && (
                      <motion.div key="file" initial={{ opacity: 0, x: 10, filter: "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: -10, filter: "blur(4px)" }} transition={{ duration: 0.25, ease: "easeInOut" }} className="space-y-6">

                        {generatedLink ? (
                          /* Reuse the existing SUCCESS STATE UI here */
                          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-4 space-y-6">
                            <div className="text-center space-y-2">
                              <div className="mx-auto w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                <Lock className="w-6 h-6 text-emerald-400" />
                              </div>
                              <h3 className="text-xl font-bold text-slate-100">File Vault Locked</h3>
                              <p className="text-sm text-slate-400">Your secure link is ready. The encryption key is embedded in the URL and was never sent to our servers.</p>
                            </div>

                            <div className="relative group">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-xl blur opacity-50 transition duration-500" />
                              <div className="relative flex items-center bg-slate-950/80 border border-slate-700/60 p-2 rounded-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                                <Input readOnly value={generatedLink || ""} className="border-0 bg-transparent focus-visible:ring-0 text-slate-300 font-mono text-xs truncate h-10" />
                                <Button onClick={copyToClipboard} size="icon" variant="ghost" className="shrink-0 hover:bg-slate-800 text-slate-300 hover:text-white ml-2 transition-colors">
                                  {isCopied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                </Button>
                              </div>
                            </div>

                            <Button onClick={resetVault} variant="ghost" className="w-full h-12 rounded-xl border border-dashed border-slate-700/60 bg-slate-950/30 hover:bg-slate-900 hover:border-slate-600 text-slate-400 hover:text-slate-200 transition-all duration-300 group">
                              <PlusCircle className="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                              Lock Another File
                            </Button>
                          </motion.div>
                        ) : (
                          /* INPUT STATE UI */
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                            <div>
                              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-100">
                                <FileText className="w-5 h-5 text-blue-400" />
                                Lock a File
                              </CardTitle>
                              <CardDescription className="text-slate-400 mt-1.5 text-sm">
                                Safely share sensitive documents, images, and media.
                              </CardDescription>
                            </div>

                            {error && (
                              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
                                {error}
                              </div>
                            )}

                            <div className="space-y-5">
                              {/* File Selection / Progress Area */}
                              {selectedFile ? (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border border-blue-500/30 bg-black/5 relative overflow-hidden">
                                  <div className="flex items-center justify-between mb-3 relative z-10">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                      <div className="p-2 rounded-lg bg-black/20 text-blue-400">
                                        <FileText className="w-5 h-5" />
                                      </div>
                                      <div className="flex flex-col truncate">
                                        <span className="text-sm font-semibold text-slate-200 truncate">{selectedFile.name}</span>
                                        <span className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                      </div>
                                    </div>
                                    {!isFileUploading && (
                                      <button onClick={() => setSelectedFile(null)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors">
                                        <PlusCircle className="w-4 h-4 rotate-45" />
                                      </button>
                                    )}
                                  </div>

                                  {/* Live Progress Bar */}
                                  {isFileUploading && (
                                    <div className="space-y-1.5 relative z-10">
                                      <div className="flex justify-between text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                                        <span>Encrypting & Transmitting...</span>
                                        <span>{uploadProgress}%</span>
                                      </div>
                                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                                        <motion.div
                                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-400"
                                          initial={{ width: 0 }}
                                          animate={{ width: `${uploadProgress}%` }}
                                          transition={{ ease: "linear", duration: 0.1 }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              ) : (
                                <motion.div className="relative w-full rounded-2xl border-2 border-dashed border-blue-500/60 bg-black/40 p-8 text-center cursor-pointer overflow-hidden group shadow-[inset_0_2px_20px_rgba(0,0,0,0.2)]" whileHover={{ scale: 1.015, borderColor: "rgba(59, 130, 246, 0.5)", backgroundColor: "rgba(30, 58, 138, 0.15)" }} whileTap={{ scale: 0.98 }}>
                                  <input
                                    type="file"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file && file.size <= 100 * 1024 * 1024) setSelectedFile(file);
                                      else if (file) setError("File exceeds 100MB limit.");
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                  />
                                  <div className="relative z-10 flex flex-col items-center justify-center gap-5 pointer-events-none">
                                    <div className="p-4 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/50 group-hover:border-blue-500/30 group-hover:from-blue-900/40 transition-colors">
                                      <Upload className="w-7 h-7 text-slate-400 group-hover:text-blue-400" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-slate-300 group-hover:text-slate-200">Drag & drop a file or <span className="text-blue-400 underline decoration-blue-400/50 underline-offset-4">browse</span></p>
                                      <p className="text-xs text-slate-500 mt-1.5 font-medium">Max size: 100MB • Client-side Encrypted</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}

                              <ConsentCheckbox checked={isConsentGiven} onChange={setIsConsentGiven} />

                              <motion.button onClick={handleFileLock} disabled={isFileUploading || !isConsentGiven || !selectedFile} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }} className="relative w-full h-12 flex items-center justify-center rounded-xl font-semibold text-white overflow-hidden shadow-[0_4px_20px_-4px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400/30 group">
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-700" />
                                <div className="relative z-10 flex items-center justify-center w-full">
                                  <AnimatePresence mode="wait">
                                    {isFileUploading ? (
                                      <motion.div key="uploading" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="flex items-center gap-2">
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}><Lock className="w-4 h-4 text-blue-100" /></motion.div>
                                        <span className="tracking-wide">Locking & Transmitting...</span>
                                      </motion.div>
                                    ) : (
                                      <motion.div key="idle" initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} className="flex items-center gap-2">
                                        <Key className="w-4 h-4 text-blue-100" />
                                        <span className="tracking-wide">Lock File & Generate Link</span>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {/* ---------------- CHAT TAB ---------------- */}
                    {activeTab === "chat" && (
                      <motion.div key="chat" initial={{ opacity: 0, x: 10, filter: "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: -10, filter: "blur(4px)" }} transition={{ duration: 0.25, ease: "easeInOut" }} className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="relative mb-6">
                          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-slate-950/50 border border-slate-700/60">
                            <MessageCircle className="h-8 w-8 text-blue-400 " />
                          </div>
                        </div>

                        <div className="space-y-2 mb-8">
                          <CardTitle className="text-xl font-bold tracking-tight text-slate-100">
                            Private Chat Room
                          </CardTitle>
                          <CardDescription className="text-slate-400 text-sm max-w-[260px] mx-auto leading-relaxed">
                            Start a secure, anonymous conversation. Real-time, auto-wiping chat rooms are currently in development.
                          </CardDescription>
                        </div>

                        <div className="w-full max-w-[280px] rounded-xl border border-slate-800/60 bg-slate-950/40 p-4 shadow-inner">
                          <div className="mb-2.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <span>Development Phase</span>
                            <span className="text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.4)]">75%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800/80 shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]">
                            <motion.div className="relative h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400" initial={{ width: "0%" }} animate={{ width: "75%" }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}>
                              <div className="absolute inset-0 rounded-full bg-white/20" />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* --- FOOTER --- */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="mt-10 text-center w-full max-w-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
                <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms & Conditions</Link>
                <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
                <Link href="/grievance" className="hover:text-slate-300 transition-colors">Grievance Officer</Link>
                <Link href="/dispute" className="hover:text-slate-300 transition-colors">Raise Dispute</Link>
              </div>
              <p className="text-xs text-slate-600">
                © 2026 DarkCodec. All rights reserved.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ConsentCheckbox({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center gap-3 p-4 mt-2 rounded-xl bg-black/40 border border-slate-800/60 shadow-inner cursor-pointer group" onClick={() => onChange(!checked)}>
      <div className={`relative w-5 h-5 shrink-0 rounded-[6px] border flex items-center justify-center transition-colors duration-300 ${checked ? 'bg-blue-600 border-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-slate-900 border-slate-700 group-hover:border-blue-500/50'}`}>
        <motion.div initial={false} animate={{ opacity: checked ? 1 : 0, scale: checked ? 1 : 0.5 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        </motion.div>
      </div>
      <div className="flex-1 text-xs text-slate-400">
        I agree to the <Link href="/terms" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Terms & Conditions</Link> and <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Privacy Policy</Link>.
      </div>
    </div>
  )
}