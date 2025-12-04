import { NextRequest, NextResponse } from 'next/server';
import { getMapping } from '../../api/preview-link/route';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const token = params.token;
  const mapping = getMapping(token);

  if (!mapping) {
    return new NextResponse('Invalid or expired preview token', { status: 404 });
  }

  const { domain, ip, protocol, path } = mapping;
  const upstreamUrl = `${protocol}://${ip}${path.startsWith('/') ? path : `/${path}`}`;

  let upstreamResp: Response;
  try {
    upstreamResp = await fetch(upstreamUrl, {
      headers: {
        Host: domain,
        'User-Agent': req.headers.get('user-agent') || 'HostPreview-Vercel',
      },
    });
  } catch (e: any) {
    return new NextResponse(
      `Error connecting to upstream: ${e?.message || 'unknown error'}`,
      { status: 502 }
    );
  }

  const headers = new Headers(upstreamResp.headers);
  headers.set('x-hostpreview-origin', `${domain}@${ip}`);

  return new NextResponse(upstreamResp.body, {
    status: upstreamResp.status,
    statusText: upstreamResp.statusText,
    headers,
  });
}

