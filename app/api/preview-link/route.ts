import { NextRequest, NextResponse } from 'next/server';
import { getMapping } from '../../api/preview-link/route';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;

  const mapping = getMapping(token);
  if (!mapping) {
    return new NextResponse('Invalid or expired preview token', { status: 404 });
  }

  const { domain, ip, protocol, path } = mapping;

  // Always call the IP, but use Host: domain (like your curl)
  const upstreamUrl = `${protocol}://${ip}${path}`;

  try {
    const upstreamResp = await fetch(upstreamUrl, {
      // Important: Host header must be the domain, not the IP
      headers: {
        Host: domain,
        'User-Agent': req.headers.get('user-agent') || 'HostPreview-Vercel',
      },
      // Let Vercel negotiate HTTP/1.1 vs HTTP/2 automatically
      redirect: 'follow',
    });

    const headers = new Headers(upstreamResp.headers);
    headers.set('x-hostpreview-origin', `${domain}@${ip}`);
    headers.delete('content-security-policy');
    headers.delete('x-frame-options');

    return new NextResponse(upstreamResp.body, {
      status: upstreamResp.status,
      statusText: upstreamResp.statusText,
      headers,
    });
  } catch (e: any) {
    console.error('Upstream fetch failed', upstreamUrl, e?.message || e);
    return new NextResponse(
      'Error connecting to upstream: fetch failed',
      { status: 502 }
    );
  }
}
