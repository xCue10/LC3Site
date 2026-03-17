import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Contact } from '@/lib/data';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const contacts = readJSON<Contact[]>('contacts.json');
  const newContact: Contact = {
    id: Date.now().toString(),
    name: body.name || '',
    email: body.email || '',
    major: body.major || '',
    reason: body.reason || '',
    submittedAt: new Date().toISOString(),
  };
  contacts.push(newContact);
  writeJSON('contacts.json', contacts);
  return NextResponse.json({ success: true }, { status: 201 });
}

export async function GET() {
  const contacts = readJSON<Contact[]>('contacts.json');
  return NextResponse.json(contacts);
}
