"use client"

import { motion } from "framer-motion"
import {
    Shield,
    FileText,
    Gavel,
    LifeBuoy,
    Home
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

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

interface DocLayoutProps {
    children: ReactNode
    title: string
    description: string
    icon: any
}

export default function DocLayout({ children, title, description, icon: Icon }: DocLayoutProps) {
    const pathname = usePathname()

    const navItems = [
        { name: "Privacy Policy", href: "/privacy", icon: Shield },
        { name: "Terms of Service", href: "/terms", icon: FileText },
        { name: "Grievance", href: "/grievance", icon: LifeBuoy },
        { name: "Dispute Resolution", href: "/dispute", icon: Gavel },
    ]

    return (
        <div className="relative min-h-screen text-neutral-50 font-sans selection:bg-indigo-500/30 flex flex-col">
            <BackgroundAnimation />

            <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0a]/60 backdrop-blur-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link href="/">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 group cursor-pointer"
                        >
                            <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                                <Home className="w-4 h-4 text-neutral-400" />
                            </div>
                        </motion.div>
                    </Link>

                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 flex flex-col lg:flex-row gap-16 lg:gap-24">
                {/* Sidebar Navigation */}
                <aside className="w-full lg:w-64 flex-shrink-0">
                    <div className="sticky top-32 space-y-10">
                        <div className="space-y-4">
                            <nav className="space-y-1.5">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <div className={`
                                                flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group cursor-pointer
                                                ${isActive
                                                    ? 'bg-white/10 text-white border border-white/10 shadow-[0_4px_20px_-5px_rgba(255,255,255,0.1)]'
                                                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03] border border-transparent'}
                                            `}>
                                                <item.icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'group-hover:text-neutral-300'}`} />
                                                <span className="text-sm font-semibold">{item.name}</span>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </nav>
                        </div>

                        <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                            <h4 className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-2">Legal Support</h4>
                            <p className="text-[12px] text-neutral-500 leading-relaxed mb-5">
                                Dedicated support for regulatory and privacy inquiries.
                            </p>
                            <Link href="/grievance">
                                <button className="w-full py-2.5 bg-white text-black hover:bg-neutral-200 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95">
                                    Contact Officer
                                </button>
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Content Area */}
                <section className="flex-1 max-w-3xl min-w-0">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <header className="mb-16">
                            <div className="flex items-center gap-5 mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl relative group overflow-hidden">
                                    <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Icon className="w-8 h-8 text-neutral-200 relative z-10" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">{title}</h1>
                                    <p className="text-base text-neutral-500 font-medium">{description}</p>
                                </div>
                            </div>
                            <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
                        </header>

                        <div className="prose prose-invert prose-neutral max-w-none 
                            prose-h2:text-2xl prose-h2:font-bold prose-h2:tracking-tight prose-h2:text-white prose-h2:mt-20 prose-h2:mb-8
                            prose-h3:text-lg prose-h3:font-bold prose-h3:text-neutral-100 prose-h3:mt-12 prose-h3:mb-6
                            prose-p:text-neutral-400 prose-p:text-[15px] prose-p:leading-[1.8] prose-p:mb-8 prose-p:text-justify
                            prose-ul:list-disc prose-ul:pl-6 prose-ul:text-neutral-400 prose-ul:mb-10
                            prose-li:mb-4 prose-li:leading-relaxed prose-li:text-justify prose-strong:text-white prose-strong:font-bold
                            prose-a:text-indigo-400 prose-a:font-medium prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-indigo-300 transition-colors
                        ">
                            {children}
                        </div>

                        <footer className="mt-28 pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8">
                            <div className="flex flex-col items-center sm:items-start gap-1">
                                <p className="text-[11px] text-neutral-600 font-bold uppercase tracking-widest">
                                    Last Updated: February 24, 2026
                                </p>
                                <p className="text-[11px] text-neutral-700">
                                    © {new Date().getFullYear()} DarkCodec Secure Infrastructure.
                                </p>
                            </div>
                            <div className="flex items-center gap-8">
                                <Link href="/privacy" className="text-xs font-medium text-neutral-500 hover:text-white transition-colors">Privacy</Link>
                                <Link href="/terms" className="text-xs font-medium text-neutral-500 hover:text-white transition-colors">Terms</Link>
                                <Link href="/grievance" className="text-xs font-medium text-neutral-500 hover:text-white transition-colors">Grievance</Link>
                            </div>
                        </footer>
                    </motion.div>
                </section>
            </main>
        </div>
    )
}
