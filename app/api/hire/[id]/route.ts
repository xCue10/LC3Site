import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, PartnerInquiry } from '@/lib/data';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiries = readJSON<PartnerInquiry[]>('hire.json');
  const filtered = inquiries.filter((i) => i.id !== id);
  if (filtered.length === inquiries.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  writeJSON('hire.json', filtered);
  return NextResponse.json({ success: true });
}
