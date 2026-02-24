import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.WORKER_API_URL || 'http://localhost:8787';
const WORKER_KEY = process.env.WORKER_API_KEY;

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        // Retrieval is public by design, but proxied to hide Worker URL
        const response = await fetch(`${WORKER_URL}/api/secrets/${id}`, {
            method: 'GET',
            headers: {
                'X-API-Key': WORKER_KEY || '',
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });

    } catch (error) {
        console.error('[API Proxy Error]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
