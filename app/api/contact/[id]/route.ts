import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Contact } from '@/lib/data';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contacts = readJSON<Contact[]>('contacts.json');
  const filtered = contacts.filter((c) => c.id !== id);
  if (filtered.length === contacts.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  writeJSON('contacts.json', filtered);
  return NextResponse.json({ success: true });
}
