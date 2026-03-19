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
      `https://api.cloudinary.com/v1_1/${cloud}/resources/image?prefix=lc3-gallery&type=upload&max_results=500`,
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

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = 'lc3-gallery';
  const signature = sign({ folder, timestamp }, secret);

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', key);
  form.append('timestamp', timestamp);
  form.append('folder', folder);
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
