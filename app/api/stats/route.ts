import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Stats } from '@/lib/data';

export async function GET() {
  const stats = readJSON<Stats>('stats.json');
  return NextResponse.json(stats);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const stats: Stats = {
    activeMembers: body.activeMembers ?? '0',
    eventsHosted: body.eventsHosted ?? '0',
    projectsBuilt: body.projectsBuilt ?? '0',
    yearsActive: body.yearsActive ?? '0',
  };
  writeJSON('stats.json', stats);
  return NextResponse.json(stats);
}
