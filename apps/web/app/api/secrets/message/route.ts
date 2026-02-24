import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.WORKER_API_URL || 'http://localhost:8787';
const WORKER_KEY = process.env.WORKER_API_KEY;
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;

async function verifyTurnstile(token: string) {
    if (!TURNSTILE_SECRET) return true; // Skip if not configured

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(TURNSTILE_SECRET)}&response=${encodeURIComponent(token)}`,
    });

    const data = await res.json();
    return data.success;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { turnstileToken, ...payload } = body;

        // 1. Mandatory Bot Protection
        if (!turnstileToken || !(await verifyTurnstile(turnstileToken))) {
            return NextResponse.json({ error: 'Security challenge failed. Please try again.' }, { status: 403 });
        }

        // 2. Proxy to Worker with Internal Key
        const response = await fetch(`${WORKER_URL}/api/secrets/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': WORKER_KEY || '',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });

    } catch (error) {
        console.error('[API Proxy Error]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
