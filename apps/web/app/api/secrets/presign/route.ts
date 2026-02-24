import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.WORKER_API_URL || 'http://localhost:8787';
const WORKER_KEY = process.env.WORKER_API_KEY;

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();

        const response = await fetch(`${WORKER_URL}/api/secrets/presign`, {
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
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
