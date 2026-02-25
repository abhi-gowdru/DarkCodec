"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Shield,
    Lock,
    Unlock,
    Eye,
    Download,
    FileText,
    AlertCircle,
    RefreshCcw,
    ArrowLeft,
    Flame,
    Check,
    Terminal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { decryptData, importKeyFromBase64Url } from "../../utils/crypto"
import Link from "next/link"

// Premium subtle background with slower, elegant movements
const PremiumBackground = () => (
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

export default function ViewSecret() {
    const params = useParams()
    const id = params.id as string

    const [step, setStep] = useState<"auth" | "decrypting" | "revealed" | "error">("auth")
    const [secretData, setSecretData] = useState<{
        type: "message" | "file",
        cipherText: string,
        iv: string,
        downloadUrl?: string
    } | null>(null)

    const [decryptedContent, setDecryptedContent] = useState<string | null>(null)
    const [fileMeta, setFileMeta] = useState<{ name: string, type: string } | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [progress, setProgress] = useState(0)
    const [isDownloading, setIsDownloading] = useState(false)
    const [downloadProgress, setDownloadProgress] = useState(0)
    const [isCopied, setIsCopied] = useState(false)
    const [isWindowFocused, setIsWindowFocused] = useState(true)
    const [isPressed, setIsPressed] = useState(false)

    useEffect(() => {
        const handleFocus = () => setIsWindowFocused(true)
        const handleBlur = () => {
            setIsWindowFocused(false)
            setIsPressed(false) // Hide if we lose focus
        }

        window.addEventListener('focus', handleFocus)
        window.addEventListener('blur', handleBlur)

        // Prevent shortcuts like Ctrl+S, Ctrl+P, Ctrl+C (as a deterrent)
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's')) {
                e.preventDefault()
                alert("This content is protected and cannot be printed or saved.")
            }
        }
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('focus', handleFocus)
            window.removeEventListener('blur', handleBlur)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const handleCopy = async () => {
        if (!decryptedContent) return
        await navigator.clipboard.writeText(decryptedContent)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    const handleReveal = async () => {
        const hash = window.location.hash.substring(1)
        if (!hash) {
            setStep("error")
            setErrorMessage("Decryption key missing from URL. Access denied.")
            return
        }

        setStep("decrypting")
        setProgress(15)

        try {
            const res = await fetch(`/api/secrets/${id}`)
            setProgress(45)

            if (!res.ok) {
                throw new Error(res.status === 404 ? "Secret not found, expired, or already destroyed." : "Failed to fetch secure payload.")
            }

            const payload = await res.json()
            const data = payload.data
            setSecretData(data)
            setProgress(70)

            const cryptoKey = await importKeyFromBase64Url(hash)

            if (data.type === 'message') {
                const decrypted = await decryptData(cryptoKey, data.cipherText, data.iv)
                setDecryptedContent(decrypted)
            } else {
                const parts = data.iv.includes('.') ? data.iv.split('.') : data.iv.split('::')

                if (parts.length >= 3) {
                    const [fileIv, metaIv, encryptedMeta] = parts
                    const decryptedMeta = await decryptData(cryptoKey, encryptedMeta, metaIv)
                    setFileMeta(JSON.parse(decryptedMeta))
                } else {
                    const [fileIv, encryptedMeta] = parts
                    try {
                        const decryptedMeta = await decryptData(cryptoKey, encryptedMeta, fileIv)
                        setFileMeta(JSON.parse(decryptedMeta))
                    } catch (e) {
                        setFileMeta({ name: "Secure_Encrypted_File.bin", type: "application/octet-stream" })
                    }
                }
            }

            setProgress(100)
            setTimeout(() => setStep("revealed"), 600)

        } catch (err: any) {
            console.error("Decryption failed:", err)
            setStep("error")
            setErrorMessage(err.message || "Cryptographic verification failed.")
        }
    }

    const handleFileDownload = async () => {
        if (!secretData?.downloadUrl || !fileMeta) return

        setIsDownloading(true)
        setDownloadProgress(0)

        try {
            const res = await fetch(secretData.downloadUrl)
            if (!res.ok) throw new Error("Failed to connect to secure file server")

            const reader = res.body?.getReader()
            const contentLength = +(res.headers.get('Content-Length') || 0)

            let receivedLength = 0
            let chunks = []

            while (true) {
                const { done, value } = await reader!.read()
                if (done) break

                chunks.push(value)
                receivedLength += value.length
                setDownloadProgress(Math.round((receivedLength / contentLength) * 100))
            }

            const encryptedBuffer = new Uint8Array(receivedLength)
            let position = 0
            for (let chunk of chunks) {
                encryptedBuffer.set(chunk, position)
                position += chunk.length
            }

            const hash = window.location.hash.substring(1)
            const cryptoKey = await importKeyFromBase64Url(hash)

            const parts = secretData.iv.includes('.') ? secretData.iv.split('.') : secretData.iv.split('::')
            const fileIvStr = parts[0] || ""

            const binaryString = globalThis.atob(fileIvStr)
            const iv = new Uint8Array(binaryString.length)
            for (let i = 0; i < binaryString.length; i++) {
                iv[i] = binaryString.charCodeAt(i)
            }

            const decryptedBuffer = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv },
                cryptoKey,
                encryptedBuffer
            )

            const blob = new Blob([decryptedBuffer], { type: fileMeta.type })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = fileMeta.name
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

        } catch (err) {
            console.error("File decryption failed:", err)
            alert("Local decryption failed. The encryption key may be invalid or the file is corrupted.")
        } finally {
            setIsDownloading(false)
            setDownloadProgress(0)
        }
    }

    // Shared transition settings for Framer Motion
    const fadeUp = {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -15, scale: 0.98 },
        transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
        }
    }

    return (
        <div className="relative min-h-screen text-neutral-50 font-sans selection:bg-indigo-500/30 flex flex-col items-center justify-center p-4 sm:p-8">
            <PremiumBackground />

            <div className="relative z-10 w-full max-w-lg">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mb-10 flex flex-col items-center"
                >
                    <Link href="/">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 text-neutral-400" />
                            <span className="text-[11px] font-semibold text-neutral-300 tracking-wider uppercase">Vault</span>
                        </motion.div>
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center">
                        <span className="bg-gradient-to-br from-white via-neutral-200 to-neutral-600 bg-clip-text text-transparent">
                            Secure Payload
                        </span>
                    </h1>
                </motion.div>

                <AnimatePresence mode="wait">
                    {step === "auth" && (
                        <motion.div key="auth" {...fadeUp}>
                            <Card className="border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl overflow-hidden relative">
                                {/* Subtle top gradient edge */}
                                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

                                <CardHeader className="text-center space-y-4 pt-10">
                                    <div className="mx-auto w-16 h-16 bg-gradient-to-b from-indigo-500/20 to-transparent border border-indigo-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]">
                                        <Lock className="w-7 h-7 text-indigo-400" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <CardTitle className="text-xl font-semibold text-white">Encrypted Transmission</CardTitle>
                                        <CardDescription className="text-neutral-400 text-sm">
                                            A zero-knowledge secret has been shared with you. Decryption requires your local key.
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-10 px-8">
                                    <Button
                                        onClick={handleReveal}
                                        className="w-full h-12 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold shadow-lg transition-all group"
                                    >
                                        <Unlock className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                        Decrypt & View Payload
                                    </Button>
                                    <p className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">
                                        <Shield className="w-3 h-3" /> End-to-End Encrypted
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === "decrypting" && (
                        <motion.div key="decrypting" {...fadeUp} className="text-center space-y-8 py-10">
                            <div className="relative flex items-center justify-center mx-auto w-24 h-24">
                                <motion.div
                                    className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl"
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <svg className="w-16 h-16 text-indigo-500/30" viewBox="0 0 100 100">
                                    <motion.circle
                                        cx="50" cy="50" r="45"
                                        fill="none" stroke="currentColor" strokeWidth="4"
                                        strokeDasharray="283"
                                        initial={{ strokeDashoffset: 283 }}
                                        animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                </svg>
                                <Lock className="absolute w-6 h-6 text-indigo-400 animate-pulse" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-widest">
                                    Unlocking Cryptography
                                </h3>
                                <div className="text-xs text-neutral-500 font-mono">{progress}% Complete</div>
                            </div>
                        </motion.div>
                    )}

                    {step === "revealed" && (
                        <motion.div key="revealed" {...fadeUp} className="w-full">
                            <Card className="border-white/10 bg-[#0a0a0a]/80 backdrop-blur-2xl shadow-2xl overflow-hidden relative w-full">
                                {/* Header section */}
                                <CardHeader className="border-b border-white/5 bg-white/[0.02] px-5 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                                            </div>
                                            <span className="text-sm font-semibold text-neutral-200 tracking-wide">Payload Unlocked</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 shadow-inner">
                                            <Flame className="w-3.5 h-3.5 text-red-400" />
                                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Burned</span>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent
                                    className={`p-5 sm:p-6 w-full transition-all duration-500 no-print ${!isWindowFocused ? 'blur-2xl pointer-events-none select-none' : ''
                                        }`}
                                    onContextMenu={(e) => e.preventDefault()}
                                >
                                    {secretData?.type === 'message' ? (
                                        <div className="space-y-5 w-full">
                                            {/* Privacy Overlay/Toggle */}
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2 text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                                                    <Eye className="w-3 h-3" /> Privacy Guard Active
                                                </div>
                                                <button
                                                    onMouseDown={() => setIsPressed(true)}
                                                    onMouseUp={() => setIsPressed(false)}
                                                    onMouseLeave={() => setIsPressed(false)}
                                                    onTouchStart={() => setIsPressed(true)}
                                                    onTouchEnd={() => setIsPressed(false)}
                                                    className={`px-3 py-1 rounded-md text-[10px] uppercase tracking-tighter transition-all ${isPressed ? 'bg-indigo-500 text-white' : 'bg-white/10 text-neutral-400 hover:bg-white/20'
                                                        }`}
                                                >
                                                    {isPressed ? "Release to Hide" : "Hold to Reveal"}
                                                </button>
                                            </div>

                                            {/* Text Output Terminal */}
                                            <div className={`relative flex flex-col rounded-xl border border-white/10 bg-black/50 overflow-hidden shadow-inner w-full transition-all duration-300 ${!isPressed ? 'blur-xl grayscale' : ''
                                                }`}>
                                                {/* Terminal Header */}
                                                <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.04] border-b border-white/5">
                                                    <div className="flex items-center gap-2 text-neutral-400">
                                                        <Terminal className="w-4 h-4" />
                                                        <span className="text-[10px] font-medium uppercase tracking-widest">Decrypted Output</span>
                                                    </div>
                                                </div>

                                                {/* Terminal Content - Constrained height, break-words, custom scrollbar */}
                                                <div className="p-4 max-h-[45vh] overflow-y-auto w-full 
                                                    [&::-webkit-scrollbar]:w-2
                                                    [&::-webkit-scrollbar-track]:bg-transparent
                                                    [&::-webkit-scrollbar-thumb]:bg-white/10
                                                    [&::-webkit-scrollbar-thumb]:rounded-full
                                                    hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
                                                >
                                                    <div className="text-sm text-neutral-200 whitespace-pre-wrap break-words font-mono leading-relaxed selection:bg-transparent select-none cursor-default">
                                                        {decryptedContent || "No content found."}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <Button
                                                    onClick={handleCopy}
                                                    variant="outline"
                                                    className="flex-1 h-12 bg-transparent border-white/10 hover:bg-white/5 text-neutral-200 transition-all group focus-visible:ring-1 focus-visible:ring-indigo-500"
                                                >
                                                    <AnimatePresence mode="wait">
                                                        {isCopied ? (
                                                            <motion.div
                                                                key="copied"
                                                                initial={{ opacity: 0, y: 5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -5 }}
                                                                className="flex items-center text-emerald-400"
                                                            >
                                                                <Check className="w-4 h-4 mr-2" /> Copied
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div
                                                                key="copy"
                                                                initial={{ opacity: 0, y: 5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -5 }}
                                                                className="flex items-center group-hover:text-white"
                                                            >
                                                                Copy Text
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </Button>

                                                <Button
                                                    onClick={() => setStep("auth")}
                                                    variant="outline"
                                                    className="px-4 h-12 bg-transparent border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-neutral-400 transition-all"
                                                    title="Lock content immediately"
                                                >
                                                    <Lock className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 w-full">
                                            {/* Privacy Overlay for files */}
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2 text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                                                    <Shield className="w-3 h-3" /> Secure File Link
                                                </div>
                                                <div className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">
                                                    Ready for Decryption
                                                </div>
                                            </div>

                                            {/* File Meta Data Block */}
                                            <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02] shadow-inner w-full">
                                                <div className="flex-shrink-0 p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                    {fileMeta?.type?.startsWith('image/') ? <Eye className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                                </div>

                                                {/* min-w-0 is CRITICAL here so flex children can truncate properly */}
                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <span
                                                        className="text-sm font-semibold text-neutral-100 truncate w-full"
                                                        title={fileMeta?.name} // A11y: Hover to see full name
                                                    >
                                                        {fileMeta?.name || "Encrypted_Payload.bin"}
                                                    </span>
                                                    <span className="text-xs text-neutral-500 font-mono mt-0.5 truncate w-full">
                                                        {fileMeta?.type || "application/octet-stream"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions & Progress */}
                                            <div className="flex gap-3 relative w-full">
                                                <Button
                                                    onClick={handleFileDownload}
                                                    disabled={isDownloading}
                                                    className="flex-1 h-12 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold transition-all disabled:opacity-80 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                                                >
                                                    {isDownloading ? (
                                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                                                            <RefreshCcw className="w-4 h-4 mr-2" />
                                                        </motion.div>
                                                    ) : (
                                                        <Download className="w-4 h-4 mr-2" />
                                                    )}
                                                    {isDownloading ? `Decrypting Locally (${downloadProgress}%)` : "Download & Decrypt"}
                                                </Button>

                                                <Button
                                                    onClick={() => setStep("auth")}
                                                    variant="outline"
                                                    className="px-4 h-12 bg-transparent border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-neutral-400 transition-all rounded-xl"
                                                    title="Lock content immediately"
                                                >
                                                    <Lock className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            {/* Absolute positioning or reserved height prevents layout shift when this appears */}
                                            <div className="h-1.5 w-full">
                                                {isDownloading && (
                                                    <div className="w-full h-full bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                                                        <motion.div
                                                            className="h-full bg-indigo-500 rounded-full"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${downloadProgress}%` }}
                                                            transition={{ ease: "linear", duration: 0.1 }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Info Banner */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="mt-6 p-4 rounded-xl bg-indigo-500/[0.03] border border-indigo-500/10 flex items-start gap-3 w-full"
                            >
                                <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                                <div className="space-y-1.5 text-left">
                                    <p className="text-[11px] text-indigo-300/90 font-semibold uppercase tracking-wider">Client-Side Architecture</p>
                                    <p className="text-[12px] text-neutral-400/80 leading-relaxed">
                                        This content was decrypted securely inside your browser. The raw data never touched our servers in plaintext. Always verify file sources before execution.
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {step === "error" && (
                        <motion.div key="error" {...fadeUp} className="w-full">
                            <Card className="border-red-500/20 bg-[#0a0a0a]/80 backdrop-blur-2xl shadow-2xl relative overflow-hidden w-full">
                                {/* Premium gradient top edge */}
                                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

                                {/* Subtle ambient background glow for the error state */}
                                <div className="absolute -top-24 -inset-x-24 h-48 bg-red-500/10 rounded-full blur-[60px] pointer-events-none" />

                                <CardContent className="pt-10 pb-8 px-5 sm:px-8 text-center space-y-7 relative z-10">
                                    {/* Icon with animated ambient glow */}
                                    <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                                        <motion.div
                                            className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl"
                                            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                        <div className="relative w-full h-full bg-gradient-to-b from-red-500/10 to-transparent border border-red-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]">
                                            <AlertCircle className="w-7 h-7 text-red-400" />
                                        </div>
                                    </div>

                                    {/* Typography with safe width limits and word breaking */}
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold text-white tracking-tight">Access Restricted</h3>
                                        <p className="text-sm text-neutral-400 max-w-[280px] mx-auto leading-relaxed break-words">
                                            {errorMessage || "The secure link has expired, was destroyed, or the decryption key is invalid."}
                                        </p>
                                    </div>

                                    {/* Action Button with micro-interactions */}
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full h-12 border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-neutral-200 dark:text-neutral-200  hover:text-white dark:hover:text-white transition-all group focus-visible:ring-1 focus-visible:ring-red-500/50 focus-visible:ring-offset-0"
                                    >
                                        <Link href="/" className="flex items-center justify-center gap-2">
                                            <ArrowLeft className="w-4 h-4 text-neutral-400 group-hover:-translate-x-1 transition-transform duration-300" />
                                            Return to Vault
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    )
}