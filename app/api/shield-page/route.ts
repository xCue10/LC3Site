import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/data';

interface ShieldPageConfig {
  live: boolean;
  heading: string;
  tagline: string;
  description: string;
  features: string[];
}

const defaults: ShieldPageConfig = {
  live: false,
  heading: 'LC3 Shield',
  tagline: 'Coming Soon',
  description: 'LC3 Shield is a hands-on cybersecurity scanner built for LC3 Club members and CSN students.',
  features: [],
};

export async function GET() {
  const config = readJSON<ShieldPageConfig>('shield.json', defaults);
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const current = readJSON<ShieldPageConfig>('shield.json', defaults);
  const config: ShieldPageConfig = {
    live: typeof body.live === 'boolean' ? body.live : current.live,
    heading: body.heading ?? current.heading,
    tagline: body.tagline ?? current.tagline,
    description: body.description ?? current.description,
    features: Array.isArray(body.features) ? body.features : current.features,
  };
  writeJSON('shield.json', config);
  return NextResponse.json(config);
}
