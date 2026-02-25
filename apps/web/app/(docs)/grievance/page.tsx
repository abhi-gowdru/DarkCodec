"use client"

import DocLayout from "@/components/layout/DocLayout"
import { LifeBuoy } from "lucide-react"

export default function GrievancePage() {
    return (
        <DocLayout
            title="Grievance Redressal"
            description="Official Resolution Mechanism & Officer Details"
            icon={LifeBuoy}
        >
            <p>
                In accordance with the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>,
                DarkCodec provides a structured grievance redressal mechanism for all users.
            </p>

            <h2 className="mt-5 font-bold">1. Grievance Officer</h2>
            <p className="mt-4 ml-4">
                If you have any complaints regarding access, usage of the platform, or content violations,
                you may reach out to our designated Grievance Officer (Resident of India).
            </p>

            <div className="p-8 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden group mb-12 mt-8">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                    <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] block">Full Name</span>
                        <span className="text-base font-bold text-white tracking-tight">Grievance Dept. (Privacy & Security)</span>
                    </div>
                    <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] block">Designation</span>
                        <span className="text-base font-bold text-white tracking-tight">Chief Compliance & Grievance Officer</span>
                    </div>
                    <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] block">Official Email</span>
                        <span className="text-base font-bold text-indigo-400 tracking-tight hover:text-indigo-300 transition-colors cursor-pointer underline underline-offset-4">grievance@darkcodec.abhigowdru.in</span>
                    </div>
                    <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] block">Jurisdiction</span>
                        <span className="text-base font-bold text-white tracking-tight">Bengaluru, India</span>
                    </div>
                </div>
            </div>

            <h2 className="mt-5 font-bold">2. Acknowledgement & Resolution</h2>
            <p className="mt-4 ml-4">Our commitment to timely resolution follows the mandated timelines:</p>
            <ul className="mt-4 ml-4">
                <li><strong>Acknowledgement:</strong> We will acknowledge your grievance via email within <strong>24 hours</strong> of receipt.</li>
                <li><strong>Resolution:</strong> We aim to resolve all grievances within <strong>15 days</strong> from the date of receipt.</li>
                <li><strong>Tracking:</strong> For Significant Social Media concerns, a unique ticket number will be provided for tracking.</li>
            </ul>

            <h2 className="mt-5 font-bold">3. Reporting Content (Technical Caveat)</h2>
            <p className="mt-4 ml-4">
                <strong>Important Note:</strong> DarkCodec is a Zero-Knowledge platform. We are technically
                <strong> incapable</strong> of viewing, scanning, or verifying the content within a secret link.
                Our ability to "moderate" content is limited to the deletion of encrypted blobs from our
                infrastructure upon receiving:
            </p>
            <ul className="mt-4 ml-4">
                <li>1. A valid court order from an Indian court.</li>
                <li>2. An official notification from a government agency under Section 79(3)(b) of the IT Act.</li>
                <li>3. Specific reports of impersonation or non-consensual sexual content (verified via external context).</li>
            </ul>

            <h2 className="mt-5 font-bold">4. Process for Authorities</h2>
            <p className="mt-4 ml-4">
                Law enforcement agencies seeking to transmit legal notices or orders should use the official
                email address provided above with the subject line "LEGAL NOTICE - [Ref Number]".
            </p>

            <h2 className="mt-5 font-bold">5. Quarterly Compliance Reports</h2>
            <p className="mt-4 ml-4">
                As an intermediary, we maintain internal records of grievances received and actions taken,
                and we publish compliance reports if required by the scale of our user base under SSMI guidelines.
            </p>
        </DocLayout>
    )
}
