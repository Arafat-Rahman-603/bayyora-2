import { NextResponse } from 'next/server'

/**
 * Health & Readiness Endpoint (/api/health)
 * Cached for 10s at the edge (AUD-031).
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'bayyora-web',
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    },
  )
}
