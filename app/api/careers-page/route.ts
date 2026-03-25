import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/data';

interface CareersPageConfig {
  live: boolean;
  heading: string;
  tagline: string;
  description: string;
  features: string[];
}

const defaults: CareersPageConfig = {
  live: false,
  heading: 'LC3 Careers',
  tagline: 'Coming Soon',
  description: 'LC3 Careers is an AI-powered job board built for LC3 Club members at the College of Southern Nevada.',
  features: [],
};

export async function GET() {
  const config = readJSON<CareersPageConfig>('careers.json', defaults);
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const current = readJSON<CareersPageConfig>('careers.json', defaults);
  const config: CareersPageConfig = {
    live: typeof body.live === 'boolean' ? body.live : current.live,
    heading: body.heading ?? current.heading,
    tagline: body.tagline ?? current.tagline,
    description: body.description ?? current.description,
    features: Array.isArray(body.features) ? body.features : current.features,
  };
  writeJSON('careers.json', config);
  return NextResponse.json(config);
}
