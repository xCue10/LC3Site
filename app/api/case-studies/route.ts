import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, CaseStudiesConfig } from '@/lib/data';

const defaults: CaseStudiesConfig = { live: false, sectionTitle: 'Past Work', caseStudies: [] };

export async function GET() {
  const config = readJSON<CaseStudiesConfig>('case-studies.json', defaults);
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const current = readJSON<CaseStudiesConfig>('case-studies.json', defaults);
  const config: CaseStudiesConfig = {
    live: body.live ?? current.live,
    sectionTitle: body.sectionTitle ?? current.sectionTitle,
    caseStudies: Array.isArray(body.caseStudies) ? body.caseStudies : current.caseStudies,
  };
  writeJSON('case-studies.json', config);
  return NextResponse.json(config);
}
