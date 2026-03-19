import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function cfg() {
  return {
    cloud: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    key: process.env.CLOUDINARY_API_KEY ?? '',
    secret: process.env.CLOUDINARY_API_SECRET ?? '',
  };
}

function basicAuth(key: string, secret: string) {
  return Buffer.from(`${key}:${secret}`).toString('base64');
}

function sign(params: Record<string, string | number>, secret: string) {
  const str = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  return crypto.createHash('sha1').update(str + secret).digest('hex');
}

export async function GET() {
  const { cloud, key, secret } = cfg();
  if (!cloud || !key || !secret) return NextResponse.json([]);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud}/resources/image?prefix=lc3-gallery&type=upload&max_results=500&context=true`,
      { headers: { Authorization: `Basic ${basicAuth(key, secret)}` } }
    );
    if (!res.ok) return NextResponse.json([]);
    const data = await res.json();
    return NextResponse.json(data.resources ?? []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const { cloud, key, secret } = cfg();
  if (!cloud || !key || !secret) {
    return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 });
  }

  const incoming = await req.formData();
  const file = incoming.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const eventVal = (incoming.get('event') as string | null)?.trim() ?? '';
  const captionVal = (incoming.get('caption') as string | null)?.trim() ?? '';

  const esc = (v: string) => v.replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/=/g, '\\=');
  const context = [
    `event=${esc(eventVal)}`,
    `caption=${esc(captionVal)}`,
  ].join('|');

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = 'lc3-gallery';
  // context must be included in signature params
  const signParams: Record<string, string> = { context, folder, timestamp };
  const signature = sign(signParams, secret);

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', key);
  form.append('timestamp', timestamp);
  form.append('folder', folder);
  form.append('context', context);
  form.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: 'POST',
    body: form,
  });
  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: data.error?.message ?? 'Upload failed' }, { status: 400 });
  }
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const { cloud, key, secret } = cfg();
  if (!cloud || !key || !secret) {
    return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 });
  }

  const { public_id, event, caption } = await req.json();
  if (!public_id) return NextResponse.json({ error: 'No public_id' }, { status: 400 });

  // Cloudinary context format: key=value|key2=value2
  // Escape special chars in values
  const esc = (v: string) => v.replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/=/g, '\\=');
  const context = [
    `event=${esc(event ?? '')}`,
    `caption=${esc(caption ?? '')}`,
  ].join('|');

  // Cloudinary Admin API expects form-encoded with literal brackets (URLSearchParams encodes [] as %5B%5D which Cloudinary rejects)
  const bodyStr = `context=${encodeURIComponent(context)}&public_ids[]=${encodeURIComponent(public_id)}`;

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud}/resources/image/context`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth(key, secret)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: bodyStr,
    }
  );
  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: data.error?.message ?? 'Update failed' }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { cloud, key, secret } = cfg();
  if (!cloud || !key || !secret) {
    return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 });
  }

  const { public_id } = await req.json();
  if (!public_id) return NextResponse.json({ error: 'No public_id' }, { status: 400 });

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = sign({ public_id, timestamp }, secret);

  const form = new FormData();
  form.append('public_id', public_id);
  form.append('api_key', key);
  form.append('timestamp', timestamp);
  form.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/destroy`, {
    method: 'POST',
    body: form,
  });
  const data = await res.json();
  return NextResponse.json(data);
}
