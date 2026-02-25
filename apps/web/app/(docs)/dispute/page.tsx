"use client"

import DocLayout from "@/components/layout/DocLayout"
import { Gavel } from "lucide-react"

export default function DisputePage() {
    return (
        <DocLayout
            title="Dispute Resolution"
            description="Arbitration Agreement & Jurisdiction Framework"
            icon={Gavel}
        >
            <p>
                At <strong>DarkCodec</strong>, we aim to resolve any concerns through our Grievance Redressal mechanism.
                However, if a formal dispute arises, this policy outlines the mandatory procedures for resolution,
                designed to minimize litigation overhead and provide a structured framework.
            </p>

            <h2 className="mt-5 font-bold">1. Mandatory Informal Resolution</h2>
            <p className="mt-4 ml-4">
                Before initiating any formal legal proceeding or arbitration, you agree to first attempt
                to resolve the dispute informally by contacting our legal team at
                <code className="text-indigo-400"> legal@darkcodec.abhigowdru.in</code>. We will attempt to settle the matter via good-faith
                negotiations for a period of at least 30 days.
            </p>

            <h2 className="mt-5 font-bold">2. Binding Arbitration Agreement</h2>
            <p className="mt-4 ml-4">
                <strong>If a dispute cannot be resolved informally, you and DarkCodec agree to resolve
                    any claims through binding arbitration rather than in court.</strong>
            </p>
            <ul className="mt-4 ml-4">
                <li><strong>Seat of Arbitration:</strong> The seat and legal place of arbitration shall be <strong>Bengaluru, India</strong>.</li>
                <li><strong>Arbitration Rules:</strong> The arbitration will be conducted in accordance with the Arbitration and Conciliation Act, 1996 (as amended).</li>
                <li><strong>Language:</strong> The language of the arbitration shall be English.</li>
                <li><strong>Finality:</strong> The arbitrator&apos;s award shall be final and binding on both parties, and may be entered as a judgment in any court of competent jurisdiction.</li>
            </ul>

            <h2 className="mt-5 font-bold">3. Class Action Waiver</h2>
            <p className="mt-4 ml-4">
                <strong>You and DarkCodec agree that any proceedings to resolve or litigate any dispute
                    will be conducted solely on an individual basis.</strong> Neither you nor DarkCodec
                will seek to have any dispute heard as a class action, representative action, or
                collective proceeding.
            </p>

            <h2 className="mt-5 font-bold">4. Exclusive Jurisdiction</h2>
            <p className="mt-4 ml-4">
                To the extent any dispute is permitted to be heard in a court (e.g., small claims or
                appeals of arbitration awards), both parties agree to the exclusive jurisdiction of
                the courts located in <strong>Bengaluru, India</strong>.
            </p>

            <h2 className="mt-5 font-bold">5. Online Dispute Resolution (ODR)</h2>
            <p className="mt-4 ml-4">
                In alignement with NITI Aayog guidelines and the push for digital resolution in India,
                DarkCodec reserves the right to conduct arbitration or mediation via certified
                Online Dispute Resolution (ODR) platforms to ensure speed and cost-effectiveness.
            </p>

            <h2 className="mt-5 font-bold">6. Governing Law</h2>
            <p className="mt-4 ml-4">
                This agreement and any disputes arising out of it shall be governed by and construed
                in accordance with the laws of the <strong>Republic of India</strong>, without regard
                to conflict of law principles.
            </p>

            <h2 className="mt-5 font-bold">7. Equitable Relief</h2>
            <p className="mt-4 ml-4">
                Notwithstanding the arbitration clause, DarkCodec reserves the right to seek
                injunctive or other equitable relief in a court of competent jurisdiction to
                prevent the actual or threatened infringement, misappropriation, or violation
                of our intellectual property rights or infrastructure security.
            </p>
        </DocLayout>
    )
}
