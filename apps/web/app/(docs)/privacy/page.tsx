"use client"

import DocLayout from "@/components/layout/DocLayout"
import { Shield } from "lucide-react"

export default function PrivacyPage() {
    return (
        <DocLayout
            title="Privacy Policy"
            description="Zero-Knowledge Data Protection & Privacy Framework"
            icon={Shield}
        >
            <p>
                At <strong>DarkCodec</strong>, privacy isn&apos;t just a feature—it&apos;s our core architecture.
                This Privacy Policy explains how we handle the minimal data we collect while maintaining our
                strict Zero-Knowledge protocol, in compliance with the Information Technology Act, 2000 (India)
                and the Digital Personal Data Protection Act, 2023 (DPDP Act).
            </p>

            <h2 className="mt-5 font-bold">1. Our Zero-Knowledge Guarantee</h2>
            <p className="mt-4 ml-4">
                We utilize client-side AES-256-GCM encryption. This means that your messages, files,
                and metadata are encrypted on <strong>your device</strong> before they ever reach our infrastructure.
                The decryption keys never leave your browser and are never stored on our servers.
            </p>
            <ul className="mt-4 ml-4">
                <li><strong>1. No Plaintext Access:</strong> DarkCodec staff, infrastructure, or any third party cannot read your content.</li>
                <li><strong>2. No Key Storage:</strong> If you lose your secret link or password, your data is permanently inaccessible. We cannot "reset" access.</li>
                <li><strong>3. Opaque Infrastructure:</strong> Our database and storage buckets only contain undecipherable encrypted blobs.</li>
            </ul>

            <h2 className="mt-5 font-bold">2. Data Collection (Intermediary Obligations)</h2>
            <p className="mt-4 ml-4">
                As an intermediary under Indian IT Rules, we store only the information necessary to provide the service and maintain security:
            </p>
            <ul className="mt-4 ml-4">
                <li><strong>1. Encrypted Payload:</strong> The encrypted data you upload (Stored in Cloudflare R2).</li>
                <li><strong>2. Accountability Metadata:</strong> Timestamps (creation and expiry) and non-sensitive technical flags (e.g., burn-after-read status).</li>
                <li><strong>3. Security Logs:</strong> Temporary logs of IP addresses to prevent DDoS attacks and spamming. These logs are purged periodically.</li>
            </ul>

            <h2 className="mt-5 font-bold">3. Information Sharing and Disclosure</h2>
            <p className="mt-4 ml-4">
                Because we do not have access to your keys, we cannot provide your decrypted content to any third party, including law enforcement or government authorities.
                In the event of a valid legal order under Indian Law, we may be compelled to provide only the <strong>encrypted blobs</strong> and <strong>metadata</strong> associated with an ID.
            </p>

            <h2 className="mt-5 font-bold">4. Data Retention</h2>
            <p className="mt-4 ml-4">
                Our system is designed for ephemerality. Data is stored on our servers only for the duration set by the user or until the "burn-after-read" trigger is activated.
            </p>
            <ul className="mt-4 ml-4">
                <li><strong>Automatic Deletion:</strong> Once a secret expires, it is permanently deleted from both our D1 database and R2 storage.</li>
                <li><strong>Irrecoverability:</strong> Once data is deleted, it cannot be recovered. We do not maintain offline backups of your secrets.</li>
            </ul>

            <h2 className="mt-5 font-bold">5. Rights under DPDP Act 2023</h2>
            <p className="mt-4 ml-4">
                Under the Indian Digital Personal Data Protection Act, you have the right to:
            </p>
            <ul className="mt-4 ml-4">
                <li><strong>Right to Correction/Erasure:</strong> You can erase your data at any time by triggering the secret&apos;s destruction mechanism.</li>
                <li><strong>Right of Grievance Redressal:</strong> We provide a dedicated officer to address any privacy concerns (see our Grievance page).</li>
            </ul>

            <h2 className="mt-5 font-bold">6. Compliance</h2>
            <p className="mt-4 ml-4">
                This policy is updated as of February 24, 2026, to align with the latest Intermediary Guidelines and the DPDP Act in India.
                By using DarkCodec, you consent to this zero-knowledge processing of your data.
            </p>
        </DocLayout>
    )
}
