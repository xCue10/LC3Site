import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, FooterContent } from '@/lib/data';

const defaults: FooterContent = {
  tagline: 'Building the future through code, collaboration, and curiosity.',
  ctaHeading: 'Ready to join LC3?',
  ctaSubtitle: 'Open to all CSN students — no experience needed.',
  ctaButtonLabel: 'Apply to Join',
};

export async function GET() {
  const data = readJSON<FooterContent>('footer.json', defaults);
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const data: FooterContent = {
    tagline: body.tagline ?? defaults.tagline,
    ctaHeading: body.ctaHeading ?? defaults.ctaHeading,
    ctaSubtitle: body.ctaSubtitle ?? defaults.ctaSubtitle,
    ctaButtonLabel: body.ctaButtonLabel ?? defaults.ctaButtonLabel,
  };
  writeJSON('footer.json', data);
  return NextResponse.json(data);
}
