import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, SiteSettings } from '@/lib/data';

const defaults: SiteSettings = {
  recruitingBanner: '',
  meetingDay: '',
  meetingTime: '',
  meetingLocation: '',
};

export async function GET() {
  const settings = readJSON<SiteSettings>('settings.json', defaults);
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const settings: SiteSettings = {
    recruitingBanner: body.recruitingBanner ?? '',
    meetingDay: body.meetingDay ?? '',
    meetingTime: body.meetingTime ?? '',
    meetingLocation: body.meetingLocation ?? '',
    socialLinks: Array.isArray(body.socialLinks) ? body.socialLinks : [],
    socialLinksLive: body.socialLinksLive ?? false,
    lastUpdated: new Date().toISOString(),
  };
  writeJSON('settings.json', settings);
  return NextResponse.json(settings);
}
