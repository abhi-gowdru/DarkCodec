"use client"

import DocLayout from "@/components/layout/DocLayout"
import { FileText } from "lucide-react"

export default function TermsPage() {
    return (
        <DocLayout
            title="Terms of Service"
            description="Legal Agreement and Limitation of Liability"
            icon={FileText}
        >
            <p>
                By accessing or using <strong>DarkCodec</strong>, you agree to be bound by these Terms of Service.
                Please read them carefully. As a zero-knowledge communication platform, your core responsibility
                is the management of your encryption keys.
            </p>

            <h2 className="mt-5 font-bold">1. User Responsibilities (Crucial)</h2>
            <p className="mt-4 ml-4">
                DarkCodec provides a technical interface for zero-knowledge data storage.
                <strong>You are the sole owner and guardian of your encryption keys.</strong>
            </p>
            <ul className="mt-4 ml-4">
                <li><strong>1. Key Sovereignty:</strong> We do not have access to, nor store, your passwords or secret links.</li>
                <li><strong>2. Loss of Access:</strong> If you lose your decryption key, the data is permanently lost. DarkCodec is not liable for data loss due to lost keys.</li>
                <li><strong>3. Security of Link:</strong> You are responsible for ensuring the secure delivery and storage of the secret link once generated.</li>
            </ul>

            <h2 className="mt-5 font-bold">2. Limitation of Liability</h2>
            <p className="mt-4 ml-4">
                <strong>To the maximum extent permitted by applicable law (including the IT Act 2000), DarkCodec, its affiliates,
                    and its developers shall not be liable for:</strong>
            </p>
            <ul className="mt-4 ml-4">
                <li>1. Any incidental, indirect, special, or consequential damages.</li>
                <li>2. Loss of profits, revenue, or data.</li>
                <li>3. Liability arising from service downtime, data corruption, or unauthorized access to your device.</li>
                <li>4. Content shared by users. Since all content is encrypted, the user assumes 100% liability for the nature and legality of the data stored.</li>
            </ul>

            <h2 className="mt-5 font-bold">3. Indemnification</h2>
            <p className="mt-4 ml-4">
                You agree to indemnify, defend, and hold harmless DarkCodec and its personnel from and against any
                claims, liabilities, damages, and expenses (including legal fees) arising out of or in any way
                connected with your use of the service or your violation of these Terms.
            </p>

            <h2 className="mt-5 font-bold">4. Prohibited Content & Usage</h2>
            <p className="mt-4 ml-4">
                While we cannot view your content, you agree not to use DarkCodec for:
            </p>
            <ul className="mt-4 ml-4">
                <li>1. Storing or transmitting illegal materials under Indian or International Law.</li>
                <li>2. Distributing malware, viruses, or any malicious code.</li>
                <li>3. Facilitating child sexual abuse material (CSAM) or any content that violates human rights.</li>
                <li>4. Attempting to DDoS or breach our infrastructure.</li>
            </ul>

            <h2 className="mt-5 font-bold">5. Service Termination</h2>
            <p className="mt-4 ml-4">
                We reserve the right to modify, suspend, or terminate the service (or any part thereof)
                at any time, for any reason, without notice or liability. We may block IPs or domains
                that we identify as malicious or abusive.
            </p>

            <h2 className="mt-5 font-bold">6. Intellectual Property</h2>
            <p className="mt-4 ml-4">
                DarkCodec retains all rights, title, and interest in and to the platform&apos;s code, designs,
                and trademarks. Your use of the service does not grant you ownership of any of these assets.
            </p>

            <h2 className="mt-5 font-bold">7. Governing Law</h2>
            <p className="mt-4 ml-4">
                These terms are governed by the laws of <strong>India</strong>. Any disputes shall be settled
                in the courts located in Bengaluru, India.
            </p>
        </DocLayout>
    )
}
