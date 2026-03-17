import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Contact } from '@/lib/data';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFY_EMAIL = 'aayeq10@gmail.com';

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

  if (process.env.RESEND_API_KEY) {
    await resend.emails.send({
      from: 'LC3 Club <onboarding@resend.dev>',
      to: NOTIFY_EMAIL,
      subject: `New Interest Form Submission — ${newContact.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; background: #0f0f1a; color: #f1f5f9; padding: 32px; border-radius: 12px;">
          <h2 style="color: #8b5cf6; margin-top: 0;">New LC3 Interest Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; width: 80px;">Name</td>
              <td style="padding: 8px 0; font-weight: 600;">${newContact.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${newContact.email}" style="color: #3b82f6;">${newContact.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Major</td>
              <td style="padding: 8px 0;">${newContact.major}</td>
            </tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #13131f; border-radius: 8px; border-left: 3px solid #8b5cf6;">
            <p style="color: #94a3b8; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Why they want to join</p>
            <p style="margin: 0; line-height: 1.6;">${newContact.reason}</p>
          </div>
          <p style="margin-top: 24px; color: #475569; font-size: 12px;">Submitted ${new Date(newContact.submittedAt).toLocaleString()}</p>
        </div>
      `,
    });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}

export async function GET() {
  const contacts = readJSON<Contact[]>('contacts.json');
  return NextResponse.json(contacts);
}
