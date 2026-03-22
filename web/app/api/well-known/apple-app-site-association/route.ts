/**
 * Serves the Apple App Site Association file with the correct Content-Type.
 * Apple's CDN caches this; ensure it returns application/json.
 * This route is a fallback — the static file in /public/.well-known/ is preferred.
 * Next.js static file serving should handle it directly, but this ensures
 * the correct Content-Type header is always set.
 */
import { NextResponse } from 'next/server';

const AASA = {
  applinks: {
    apps: [],
    details: [
      {
        appID: 'TEAMID.com.librato.ai',
        paths: ['/discern', '/discern/*', '/journal', '/journal/*', '/upgrade'],
      },
    ],
  },
  webcredentials: {
    apps: ['TEAMID.com.librato.ai'],
  },
};

export async function GET() {
  return NextResponse.json(AASA, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
