import type { Metadata } from "next";
import localFont from "next/font/local";
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "DarkCodec | Zero-Knowledge Secret Sharing & End-to-End Encryption",
    template: "%s | DarkCodec",
  },
  description: "Securely share sensitive data with DarkCodec. A production-ready, zero-knowledge platform where privacy is non-negotiable. We never see your keys; we never see your data.",
  keywords: [
    "DarkCodec", 
    "Zero-Knowledge Secret Sharing", 
    "End-to-End Encrypted Sharing", 
    "Secure Data Transmission", 
    "Privacy-First Secret Management", 
    "Swiss Security Philosophy",
    "AES-256 Encryption",
    "Secure Credentials Sharing"
  ],
  authors: [{ name: "DarkCodec Security" }],
  creator: "DarkCodec",
  metadataBase: new URL("https://darkcodec.abhigowdru.in"), // Update with your actual domain
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://darkcodec.abhigowdru.in",
    title: "DarkCodec - Zero-Knowledge Secret Sharing",
    description: "Production-ready security for your most sensitive data. Swiss-style privacy with absolute zero-knowledge architecture.",
    siteName: "DarkCodec",
    images: [
      {
        url: "/og-security.png", 
        width: 1200,
        height: 630,
        alt: "DarkCodec: Privacy is Non-Negotiable",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DarkCodec | Encrypted Secret Sharing",
    description: "Because if we can't see it, we can't leak it. Zero-knowledge secret sharing for the modern web.",
    images: ["/og-security-banner.png"],
  },
  category: "Security",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
