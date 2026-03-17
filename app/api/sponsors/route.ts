import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, SponsorsConfig } from '@/lib/data';

const defaults: SponsorsConfig = { live: false, sectionTitle: 'Supported By', sponsors: [] };

export async function GET() {
  const config = readJSON<SponsorsConfig>('sponsors.json', defaults);
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const current = readJSON<SponsorsConfig>('sponsors.json', defaults);
  const config: SponsorsConfig = {
    live: body.live ?? current.live,
    sectionTitle: body.sectionTitle ?? current.sectionTitle,
    sponsors: Array.isArray(body.sponsors) ? body.sponsors : current.sponsors,
  };
  writeJSON('sponsors.json', config);
  return NextResponse.json(config);
}
