"use client"

import { useParams } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
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
    Clock,
    ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { decryptData, importKeyFromBase64Url } from "../../utils/crypto"
import Link from "next/link"

const BackgroundAnimation = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,58,138,0.15)_0%,transparent_100%)]" />
        {[0, 1, 2].map((i) => (
            <motion.div
                key={i}
                className="absolute rounded-full border border-blue-500/10"
                initial={{ width: "20vw", height: "20vw", opacity: 0 }}
                animate={{
                    width: ["20vw", "100vw"],
                    height: ["20vw", "100vw"],
                    opacity: [0, 0.2, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 2.6,
                }}
            />
        ))}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
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

    const handleReveal = async () => {
        const hash = window.location.hash.substring(1)
        if (!hash) {
            setStep("error")
            setErrorMessage("Decryption key missing from URL. Access denied.")
            return
        }

        setStep("decrypting")
        setProgress(10)

        try {
            // Proxied fetch for security and to hide Worker URL
            const res = await fetch(`/api/secrets/${id}`)
            setProgress(40)

            if (!res.ok) {
                throw new Error(res.status === 404 ? "Secret not found, expired, or already destroyed." : "Failed to fetch secret.")
            }

            const payload = await res.json()
            const data = payload.data
            setSecretData(data)
            setProgress(60)

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
                        setFileMeta({ name: "unnamed_file", type: "application/octet-stream" })
                    }
                }
            }

            setProgress(100)
            setTimeout(() => setStep("revealed"), 500)

        } catch (err: any) {
            console.error("Decryption failed:", err)
            setStep("error")
            setErrorMessage(err.message || "Failed to decrypt secret.")
        }
    }

    const handleFileDownload = async () => {
        if (!secretData?.downloadUrl || !fileMeta) return

        setIsDownloading(true)
        setDownloadProgress(0)

        try {
            const res = await fetch(secretData.downloadUrl)
            if (!res.ok) throw new Error("Failed to reach file server")

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
            alert("Failed to decrypt file. The key might be invalid.")
        } finally {
            setIsDownloading(false)
            setDownloadProgress(0)
        }
    }

    return (
        <div className="relative min-h-screen text-slate-50 font-sans selection:bg-blue-500/30 flex flex-col items-center justify-center p-4">
            <BackgroundAnimation />

            <div className="relative z-10 w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center flex flex-col items-center"
                >
                    <Link href="/">
                        <motion.div whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 backdrop-blur-md cursor-pointer">
                            <ArrowLeft className="w-3 h-3 text-blue-400" />
                            <span className="text-xs font-semibold text-blue-400 tracking-wide uppercase">Back to Vault</span>
                        </motion.div>
                    </Link>
                    <h1 className="text-3xl font-extrabold tracking-tight">
                        <span className="bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">Secure Fragment</span>
                    </h1>
                </motion.div>

                <AnimatePresence mode="wait">
                    {step === "auth" && (
                        <motion.div key="auth" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                            <Card className="border-slate-800/60 bg-slate-900/50 backdrop-blur-2xl shadow-2xl ring-1 ring-white/5 overflow-hidden">
                                <CardHeader className="text-center space-y-2">
                                    <div className="mx-auto w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-2">
                                        <Lock className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <CardTitle className="text-xl font-bold text-slate-100">Encrypted Message</CardTitle>
                                    <CardDescription className="text-slate-400">
                                        A secure secret has been shared with you. To view it, click the button below.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-8 px-8">
                                    <Button
                                        onClick={handleReveal}
                                        className="w-full h-12 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 font-semibold border border-blue-400/30 shadow-[0_4px_20px_-4px_rgba(37,99,235,0.4)] transition-all"
                                    >
                                        <Unlock className="w-4 h-4 mr-2" />
                                        Reveal Secret
                                    </Button>
                                    <p className="mt-4 text-[10px] text-center text-slate-500 uppercase tracking-widest font-bold">
                                        Zero-Knowledge E2EE Protected
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === "decrypting" && (
                        <motion.div key="decrypting" className="text-center space-y-6">
                            <div className="relative flex items-center justify-center">
                                <motion.div
                                    className="absolute w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                                    <RefreshCcw className="w-10 h-10 text-blue-400" />
                                </motion.div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-slate-100 uppercase tracking-widest">Decrypting Instance...</h3>
                                <div className="w-48 mx-auto h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                                    <motion.div
                                        className="h-full bg-blue-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === "revealed" && (
                        <motion.div key="revealed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                            <Card className="border-slate-800/60 bg-slate-900/50 backdrop-blur-2xl shadow-all ring-1 ring-white/10 overflow-hidden">
                                <CardHeader className="border-b border-slate-800/60 bg-slate-950/30">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                <Shield className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Secure Output</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/20">
                                            <Flame className="w-3 h-3 text-orange-400" />
                                            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-tighter">Destroyed after viewing</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {secretData?.type === 'message' ? (
                                        <div className="relative group">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur opacity-25" />
                                            <div className="relative bg-slate-950/80 border border-slate-800 p-5 rounded-xl min-h-[120px] shadow-inner font-mono text-sm text-slate-200 whitespace-pre-wrap selection:bg-blue-500/40">
                                                {decryptedContent}
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-slate-500 hover:text-white"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(decryptedContent || "");
                                                    }}
                                                >
                                                    Copy to Clipboard
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                                                <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                                                    {fileMeta?.type.startsWith('image/') ? <Eye className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-bold text-slate-100 truncate">{fileMeta?.name}</span>
                                                    <span className="text-xs text-slate-500 uppercase tracking-wide">{fileMeta?.type}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <Button
                                                    onClick={handleFileDownload}
                                                    disabled={isDownloading}
                                                    className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-[0_4px_15px_rgba(37,99,235,0.3)] transition-all"
                                                >
                                                    {isDownloading ? (
                                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                                                            <RefreshCcw className="w-4 h-4 mr-2" />
                                                        </motion.div>
                                                    ) : (
                                                        <Download className="w-4 h-4 mr-2" />
                                                    )}
                                                    {isDownloading ? `Decrypting ${downloadProgress}%` : "Download & Decrypt File"}
                                                </Button>

                                                {isDownloading && (
                                                    <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-blue-500"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${downloadProgress}%` }}
                                                        />
                                                    </div>
                                                )}

                                                <p className="text-[10px] text-center text-slate-500 font-medium">
                                                    The file is decrypted entirely in your browser. Our servers never see the raw file data or your key.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                            <div className="mt-6 text-center">
                                <p className="text-xs text-slate-500">
                                    This content was encrypted locally and never touched our database in plaintext.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {step === "error" && (
                        <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                            <Card className="border-red-900/50 bg-slate-950 ring-1 ring-red-500/20">
                                <CardContent className="pt-8 pb-8 px-8 text-center space-y-4">
                                    <div className="mx-auto w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
                                        <AlertCircle className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold text-slate-100">Access Restricted</h3>
                                        <p className="text-sm text-slate-400">{errorMessage}</p>
                                    </div>
                                    <Button asChild variant="outline" className="w-full border-slate-800 hover:bg-slate-900 mt-2">
                                        <Link href="/">Back to Home</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
