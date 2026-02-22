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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import {
  FileText,
  MessageSquare,
  MessageCircle,
  Shield,
  Lock,
  Key,
  Fingerprint,
  Upload,
  Send,
  Users,
  ArrowRight,
  PlusCircle,
  Check,
  Flame,
  Clock
} from "lucide-react"
import Link from "next/link"

// Subtle background animation
const BackgroundAnimation = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.15),rgba(255,255,255,0))]" />
    <motion.div
      className="absolute inset-0"
      animate={{
        background: [
          "radial-gradient(circle at 20% 50%, rgba(37, 99, 235, 0.03) 0%, transparent 50%)",
          "radial-gradient(circle at 80% 50%, rgba(37, 99, 235, 0.03) 0%, transparent 50%)",
          "radial-gradient(circle at 20% 50%, rgba(37, 99, 235, 0.03) 0%, transparent 50%)",
        ],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
    />
  </div>
)

export function TabsLine({ activeTab, onValueChange }: { activeTab: string; onValueChange: (value: string) => void }) {
  const tabs = [
    { id: "message", label: "Message", icon: MessageSquare },
    { id: "file", label: "File", icon: FileText },
    { id: "chat", label: "Chat", icon: MessageCircle },
  ];

  return (
    // Outer Track: Deep, dark glassmorphism container
    <div className="flex w-full p-1.5 bg-slate-950/80 backdrop-blur-2xl border border-slate-800/80 rounded-2xl shadow-[inset_0_1px_4px_rgba(0,0,0,0.4)] relative">

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onValueChange(tab.id)}
            // Ensure the button itself is relative to trap the absolute sliding pill
            className={`relative flex-1 flex items-center justify-center py-3 text-sm font-semibold transition-colors duration-300 outline-none rounded-xl z-10 ${isActive
              ? "text-white"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {/* The Magic: Framer Motion Sliding Indicator */}
            {isActive && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-600 rounded-xl shadow-[0_2px_10px_rgba(37,99,235,0.3)] border border-blue-400/30"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}

            {/* Tab Content (Icon + Text) placed above the sliding pill */}
            <span className="relative z-20 flex items-center gap-2">
              <Icon
                className={`w-4 h-4 transition-transform duration-300 ${isActive ? "text-blue-100 scale-110" : "scale-100"
                  }`}
              />
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

  const handleEncrypt = () => {
    setIsEncrypting(true);
    setTimeout(() => setIsEncrypting(false), 1500);
  };

  return (
    <div className="relative min-h-screen text-slate-50 font-sans selection:bg-blue-500/30">
      <BackgroundAnimation />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 text-center flex flex-col items-center"
        >
          {/* Security badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 backdrop-blur-md cursor-default"
          >
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-blue-400 tracking-wide uppercase">
              End-to-End Encrypted
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight">
            <span className="bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
              Secure Vault
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-sm">
            Military-grade encryption for your most sensitive communications.
          </p>
        </motion.div>

        {/* Layout wrapper for smooth height transitions */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="border-slate-800/60 bg-slate-900/50 backdrop-blur-2xl shadow-2xl shadow-blue-900/5 ring-1 ring-white/5 w-full max-w-md">
            <CardHeader className="pt-6 px-6">
              <TabsLine activeTab={activeTab} onValueChange={setActiveTab} />
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-4 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                {/* Message Tab */}
                {activeTab === "message" && (
                  <motion.div
                    key="message"
                    initial={{ opacity: 0, x: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="space-y-5"
                  >
                    <div>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-100">
                        <MessageSquare className="w-4 h-4 text-blue-400" />
                        Create Secret Message
                      </CardTitle>
                      <CardDescription className="text-slate-400 mt-1.5 text-sm">
                        Lock your sensitive info into a secure, shareable link.
                      </CardDescription>
                    </div>

                    <div className="space-y-5">
                      {/* 1. Message Textarea */}
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                          Your Secret Message
                        </Label>
                        <Textarea
                          id="message"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Enter passwords, private notes, or sensitive data you want to share safely..."
                          className="min-h-[120px] bg-slate-950/80 border-slate-700/60 focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 text-slate-100 placeholder:text-slate-600 resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] rounded-xl transition-all duration-300"
                        />
                      </div>

                      {/* 2. Premium Security Controls (Settings Group Pattern) */}
                      <div className="flex flex-col rounded-xl border border-slate-700/60 bg-slate-950/40 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] overflow-hidden divide-y divide-slate-800/60">

                        {/* Row 1: Burn After Read */}
                        <div
                          className="flex items-center justify-between p-3.5 sm:p-4 cursor-pointer hover:bg-slate-800/20 transition-colors group"
                          onClick={() => setIsBurnAfterRead(!isBurnAfterRead)}
                        >
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

                          {/* iOS-Style Animated Switch */}
                          <div className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out ${isBurnAfterRead ? 'bg-orange-500' : 'bg-slate-700'}`}>
                            <motion.div
                              layout
                              className="inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0"
                              animate={{ x: isBurnAfterRead ? 20 : 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </div>
                        </div>

                        {/* Row 2: Expiration Timer */}
                        <div className="flex items-center justify-between p-3.5 sm:p-4">
                          <div className="flex items-center gap-3.5">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              <Clock className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-100">
                                Expiration
                              </span>
                              <span className="text-[11px] font-medium text-slate-500 mt-0.5">
                                Auto-destruct if not opened
                              </span>
                            </div>
                          </div>

                          {/* Framer Motion Segmented Control */}
                          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 shadow-inner">
                            {['1H', '1D', '1W'].map((time) => (
                              <button
                                key={time}
                                onClick={() => setExpireTime(time)}
                                className="relative px-3 py-1.5 text-xs font-bold rounded-md z-10 outline-none"
                                style={{ WebkitTapHighlightColor: "transparent" }}
                              >
                                {expireTime === time && (
                                  <motion.div
                                    layoutId="expire-pill"
                                    className="absolute inset-0 bg-slate-800 rounded-md border border-slate-700 shadow-sm"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                  />
                                )}
                                <span className={`relative z-20 transition-colors duration-300 tracking-wider ${expireTime === time ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                                  {time}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 3. Consent Checkbox */}
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="border-slate-800/60"
                      >
                        <ConsentCheckbox checked={isConsentGiven} onChange={setIsConsentGiven} />
                      </motion.div>

                      {/* 4. Primary Submit Button */}
                      <motion.button
                        onClick={handleEncrypt}
                        disabled={isEncrypting || !isConsentGiven || messageText.trim() === ""}
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="relative w-full h-12 flex items-center justify-center rounded-xl font-semibold text-white overflow-hidden shadow-[0_4px_20px_-4px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_8px_30px_-4px_rgba(37,99,235,0.6)] border border-blue-400/30 group transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-700" />
                        <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] pointer-events-none" />

                        <div className="relative z-10 flex items-center justify-center w-full">
                          <AnimatePresence mode="wait">
                            {isEncrypting ? (
                              <motion.div
                                key="encrypting"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="flex items-center gap-2"
                              >
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                  <Lock className="w-4 h-4 text-blue-100 drop-shadow-md" />
                                </motion.div>
                                <span className="tracking-wide text-blue-50 drop-shadow-md">Locking Message...</span>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="idle"
                                initial={{ opacity: 0, y: -15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 15 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="flex items-center gap-2"
                              >
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

                {/* File Tab */}
                {activeTab === "file" && (
                  <motion.div
                    key="file"
                    initial={{ opacity: 0, x: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="space-y-6"
                  >
                    {/* Header */}
                    <div>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-100">
                        <FileText className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                        Lock a File
                      </CardTitle>
                      <CardDescription className="text-slate-400 mt-1.5 text-sm">
                        Safely share sensitive documents, images, and media.
                      </CardDescription>
                    </div>

                    <div className="space-y-5">
                      {/* The Premium Animated Dropzone */}
                      <motion.div
                        className="relative w-full rounded-2xl border-2 border-dashed border-slate-700/60 bg-slate-950/40 p-8 text-center cursor-pointer overflow-hidden group shadow-[inset_0_2px_20px_rgba(0,0,0,0.2)]"
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        variants={{
                          rest: { scale: 1, borderColor: "rgba(51, 65, 85, 0.6)", backgroundColor: "rgba(2, 6, 23, 0.4)" },
                          hover: { scale: 1.015, borderColor: "rgba(59, 130, 246, 0.5)", backgroundColor: "rgba(30, 58, 138, 0.15)" },
                          tap: { scale: 0.98, borderColor: "rgba(59, 130, 246, 0.8)", backgroundColor: "rgba(30, 58, 138, 0.25)" }
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />

                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12)_0%,transparent_65%)] transition-opacity duration-500 pointer-events-none"
                        />

                        <div className="relative z-10 flex flex-col items-center justify-center gap-5">
                          <motion.div
                            variants={{
                              rest: { y: 0, boxShadow: "0px 4px 10px rgba(0,0,0,0.3)" },
                              hover: { y: -6, boxShadow: "0px 12px 24px rgba(37,99,235,0.25)" },
                              tap: { y: 0, boxShadow: "0px 2px 5px rgba(37,99,235,0.4)" }
                            }}
                            className="p-4 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/50 group-hover:border-blue-500/30 group-hover:from-blue-900/40 group-hover:to-slate-900 transition-colors duration-300 relative"
                          >
                            <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] pointer-events-none" />

                            <motion.div
                              variants={{
                                rest: { scale: 1 },
                                hover: { scale: 1.1 },
                                tap: { scale: 0.9 }
                              }}
                            >
                              <Upload className="w-7 h-7 text-slate-400 group-hover:text-blue-400 drop-shadow-md transition-colors duration-300" />
                            </motion.div>
                          </motion.div>

                          <div>
                            <p className="text-sm font-semibold text-slate-300 group-hover:text-slate-200 transition-colors">
                              Drag & drop a file or <span className="text-blue-400 group-hover:text-blue-300 group-hover:underline decoration-blue-400/50 underline-offset-4 transition-all">browse</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-1.5 font-medium group-hover:text-slate-400 transition-colors">
                              Max size: 100MB • Completely private
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Primary Action Button */}
                      <motion.button
                        disabled={!isConsentGiven} // Re-using the consent logic here
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        variants={{
                          rest: { scale: 1 },
                          hover: { scale: 1.015 },
                          tap: { scale: 0.98 }
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="relative w-full h-12 flex items-center justify-center rounded-xl font-semibold text-slate-300 bg-slate-950/50 border border-slate-700/60 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500/50 hover:shadow-[0_4px_20px_-4px_rgba(37,99,235,0.2)] hover:bg-slate-900/80 transition-all duration-300"
                      >
                        <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] pointer-events-none" />

                        <div className="relative z-10 flex items-center justify-center gap-2">
                          <motion.div
                            variants={{
                              rest: { rotate: 0, scale: 1 },
                              hover: { rotate: 90, scale: 1.1 }
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <Key className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors duration-300 drop-shadow-sm" />
                          </motion.div>

                          <span className="tracking-wide group-hover:text-blue-50 transition-colors duration-300 drop-shadow-sm">
                            Lock & Generate Link
                          </span>
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Chat Tab */}
                {activeTab === "chat" && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="space-y-6"
                  >
                    {/* Header */}
                    <div>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-100">
                        <MessageCircle className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                        Private Chat Room
                      </CardTitle>
                      <CardDescription className="text-slate-400 mt-1.5 text-sm">
                        Start a secure, anonymous conversation with someone.
                      </CardDescription>
                    </div>

                    <div className="space-y-5">

                      {/* 1. Primary Action: Create Room */}
                      <motion.button
                        disabled={!isConsentGiven}
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="relative w-full h-12 flex items-center justify-center rounded-xl font-semibold text-white overflow-hidden shadow-[0_4px_20px_-4px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_8px_30px_-4px_rgba(37,99,235,0.6)] border border-blue-400/30 group transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-700" />
                        <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] pointer-events-none" />

                        <div className="relative z-10 flex items-center justify-center gap-2 drop-shadow-md">
                          <PlusCircle className="w-4 h-4 text-blue-100 group-hover:rotate-90 transition-transform duration-500" />
                          <span className="tracking-wide">Start a Private Chat</span>
                        </div>
                      </motion.button>

                      {/* 2. Sleek Divider */}
                      <div className="flex items-center gap-3 opacity-60 px-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-700"></div>
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Or Join Existing</span>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-700"></div>
                      </div>

                      {/* 3. Join Flow: Inline Input + Button */}
                      <div className="relative group">
                        <Label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1 block mb-2">
                          Chat Invite Code
                        </Label>

                        <div className="relative flex gap-2">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

                          <Input
                            type="text"
                            placeholder="• • • • • •"
                            className="relative flex-1 bg-slate-950/80 border-slate-700/60 focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 text-slate-100 h-12 text-center text-xl tracking-[0.3em] font-mono shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] rounded-xl transition-all duration-300 placeholder:text-slate-700 placeholder:tracking-widest"
                            maxLength={6}
                          />

                          <motion.button
                            disabled={!isConsentGiven}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="relative h-12 px-5 flex items-center justify-center rounded-xl bg-slate-900/80 border border-slate-700/60 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-500 hover:bg-slate-800 transition-all duration-300 shadow-sm shrink-0"
                          >
                            <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] pointer-events-none" />
                            <span className="relative z-10 text-sm font-semibold text-slate-300 group-hover:text-white transition-colors flex items-center gap-1.5">
                              Join <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </motion.button>
                        </div>
                      </div>

                      {/* 4. Glowing Security Notice */}
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 group cursor-default"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-l-xl opacity-80" />
                        <div className="flex items-center gap-3">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="p-1.5 rounded-full bg-emerald-500/10 shrink-0"
                          >
                            <Shield className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
                          </motion.div>
                          <div>
                            <p className="text-[13px] font-medium text-emerald-100/90 leading-tight">
                              Auto-Wipe Enabled
                            </p>
                            <p className="text-[11px] text-emerald-500/80 mt-0.5 leading-snug">
                              All messages are permanently destroyed the moment you leave the room.
                            </p>
                          </div>
                        </div>
                      </motion.div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        {/* UPGRADED COMPLIANCE FOOTER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 text-center w-full max-w-2xl space-y-4"
        >

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms & Conditions</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/grievance" className="hover:text-slate-300 transition-colors">Grievance Officer</Link>
            <Link href="/dispute" className="hover:text-slate-300 transition-colors">Raise Dispute</Link>
          </div>

          <p className="text-[10px] text-slate-600">
            © 2026 Secure Vault Technologies. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export function ConsentCheckbox({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div
      className="flex items-center gap-3 p-4 mt-2 rounded-xl bg-slate-950/40 border border-slate-800/60 shadow-inner cursor-pointer group"
      onClick={() => onChange(!checked)}
    >
      {/* Animated Checkbox */}
      <div className={`relative w-5 h-5 shrink-0 rounded-[6px] border flex items-center justify-center transition-colors duration-300 ${checked ? 'bg-blue-600 border-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-slate-900 border-slate-700 group-hover:border-blue-500/50'}`}>
        <motion.div
          initial={false}
          animate={{ opacity: checked ? 1 : 0, scale: checked ? 1 : 0.5 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        </motion.div>
      </div>

      {/* Legal Typography */}
      <div className="flex-1 text-xs text-slate-400">
        I agree to the <Link href="/terms" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Terms & Conditions</Link> and <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Privacy Policy</Link>.
      </div>
    </div>
  )
}