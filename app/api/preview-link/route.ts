// app/api/preview-link/route.ts
import { NextRequest, NextResponse } from 'next/server';

export type Mapping = {
  domain: string;
  ip: string;
  protocol: 'http' | 'https';
  path: string;
};

const mappings = new Map<string, Mapping>();

function validateDomain(domain: string) {
  return /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(domain);
}

function validateIP(ip: string) {
  return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ detail: 'Invalid JSON' }, { status: 400 });
  }

  const domain = String(body.domain || '').trim();
  const ip = String(body.ip || '').trim();

  const rawProtocol = String(body.protocol || '').trim().toLowerCase();
  const protocol: 'http' | 'https' =
    rawProtocol === 'http' || rawProtocol === 'https' ? rawProtocol : 'https';

  const rawPath = (body.path ?? '').toString().trim();
  const path =
    rawPath === '' ? '/' : rawPath.startsWith('/') ? rawPath : `/${rawPath}`;

  if (!validateDomain(domain)) {
    return NextResponse.json({ detail: 'Invalid domain' }, { status: 400 });
  }
  if (!validateIP(ip)) {
    return NextResponse.json({ detail: 'Invalid IP' }, { status: 400 });
  }

  const token = `hp_${Math.random().toString(36).slice(2, 10)}`;
  mappings.set(token, { domain, ip, protocol, path });

  return NextResponse.json({ previewUrl: `/preview/${token}` });
}

export function getMapping(token: string) {
  return mappings.get(token) || null;
}
