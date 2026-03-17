import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Contact } from '@/lib/data';
import { Resend } from 'resend';

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

  // Send email notification if configured
  if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAIL) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'LC3 Club <onboarding@resend.dev>',
        to: process.env.NOTIFICATION_EMAIL,
        subject: `New Join Request from ${newContact.name}`,
        html: `
          <h2>New LC3 Club Interest Form Submission</h2>
          <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:500px">
            <tr><td style="color:#888;width:120px">Name</td><td><strong>${newContact.name}</strong></td></tr>
            <tr><td style="color:#888">Email</td><td>${newContact.email}</td></tr>
            <tr><td style="color:#888">Major</td><td>${newContact.major}</td></tr>
            <tr><td style="color:#888;vertical-align:top">Message</td><td>${newContact.reason}</td></tr>
            <tr><td style="color:#888">Submitted</td><td>${new Date(newContact.submittedAt).toLocaleString()}</td></tr>
          </table>
        `,
      });
    } catch (err) {
      // Don't fail the submission if email fails
      console.error('Email notification failed:', err);
    }
  }

  return NextResponse.json({ success: true }, { status: 201 });
}

export async function GET() {
  const contacts = readJSON<Contact[]>('contacts.json');
  return NextResponse.json(contacts);
}
