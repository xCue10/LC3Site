import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Contact } from '@/lib/data';
import { Resend } from 'resend';
import { verifyHcaptcha } from '@/lib/captcha';

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Honeypot: bots fill this hidden field, humans don't — silently discard
  if (body.website) return NextResponse.json({ success: true }, { status: 201 });

  // hCaptcha verification
  const captchaOk = await verifyHcaptcha(body.captchaToken);
  if (!captchaOk) return NextResponse.json({ error: 'Captcha verification failed.' }, { status: 400 });

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

  if (process.env.DISCORD_MEMBER_WEBHOOK_URL) {
    try {
      await fetch(process.env.DISCORD_MEMBER_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '📥 New Join Request',
            color: 0x7c3aed,
            fields: [
              { name: 'Name', value: newContact.name, inline: true },
              { name: 'Email', value: newContact.email, inline: true },
              { name: 'Major', value: newContact.major, inline: true },
              { name: 'Message', value: newContact.reason },
            ],
            timestamp: new Date().toISOString(),
          }],
        }),
      });
    } catch (err) {
      console.error('Discord notification failed:', err);
    }
  }

  return NextResponse.json({ success: true }, { status: 201 });
}

export async function GET() {
  const contacts = readJSON<Contact[]>('contacts.json');
  return NextResponse.json(contacts);
}
