import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, PartnerInquiry } from '@/lib/data';
import { Resend } from 'resend';
import { verifyHcaptcha } from '@/lib/captcha';

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Honeypot: bots fill this hidden field, humans don't — silently discard
  if (body.website) return NextResponse.json({ success: true }, { status: 201 });

  // hCaptcha verification
  const captchaOk = await verifyHcaptcha(body.captchaToken);
  if (!captchaOk) return NextResponse.json({ error: 'Captcha verification failed.' }, { status: 400 });

  const inquiries = readJSON<PartnerInquiry[]>('hire.json');

  const inquiryType = body.inquiryType === 'internship' ? 'internship' : body.inquiryType === 'speaker' ? 'speaker' : 'project';

  const newInquiry: PartnerInquiry = {
    id: Date.now().toString(),
    inquiryType,
    companyName: body.companyName || '',
    contactName: body.contactName || '',
    email: body.email || '',
    description: body.description || '',
    submittedAt: new Date().toISOString(),
    // Project fields
    projectType: body.projectType || undefined,
    timeline: body.timeline || undefined,
    // Internship fields
    positionTitle: body.positionTitle || undefined,
    duration: body.duration || undefined,
    compensation: body.compensation || undefined,
    requiredSkills: body.requiredSkills || undefined,
    // Speaker fields
    topic: body.topic || undefined,
    availability: body.availability || undefined,
  };

  inquiries.push(newInquiry);
  writeJSON('hire.json', inquiries);

  const isInternship = newInquiry.inquiryType === 'internship';
  const isSpeaker = newInquiry.inquiryType === 'speaker';

  if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAIL) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const subject = isSpeaker
        ? `New Guest Speaker Request from ${newInquiry.companyName}`
        : isInternship
          ? `New Internship Posting from ${newInquiry.companyName}`
          : `New Project Inquiry from ${newInquiry.companyName}`;
      const html = isSpeaker ? `
          <h2>New Guest Speaker Request</h2>
          <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:500px">
            <tr><td style="color:#888;width:160px">Company</td><td><strong>${newInquiry.companyName}</strong></td></tr>
            <tr><td style="color:#888">Contact</td><td>${newInquiry.contactName}</td></tr>
            <tr><td style="color:#888">Email</td><td>${newInquiry.email}</td></tr>
            <tr><td style="color:#888">Topic</td><td>${newInquiry.topic || 'Not specified'}</td></tr>
            <tr><td style="color:#888">Availability</td><td>${newInquiry.availability || 'Not specified'}</td></tr>
            <tr><td style="color:#888;vertical-align:top">Bio / Description</td><td>${newInquiry.description}</td></tr>
            <tr><td style="color:#888">Submitted</td><td>${new Date(newInquiry.submittedAt).toLocaleString()}</td></tr>
          </table>
        ` : isInternship ? `
          <h2>New Internship Opportunity</h2>
          <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:500px">
            <tr><td style="color:#888;width:160px">Company</td><td><strong>${newInquiry.companyName}</strong></td></tr>
            <tr><td style="color:#888">Contact</td><td>${newInquiry.contactName}</td></tr>
            <tr><td style="color:#888">Email</td><td>${newInquiry.email}</td></tr>
            <tr><td style="color:#888">Position</td><td>${newInquiry.positionTitle}</td></tr>
            <tr><td style="color:#888">Duration</td><td>${newInquiry.duration}</td></tr>
            <tr><td style="color:#888">Compensation</td><td>${newInquiry.compensation}</td></tr>
            <tr><td style="color:#888">Required Skills</td><td>${newInquiry.requiredSkills || 'Not specified'}</td></tr>
            <tr><td style="color:#888;vertical-align:top">Description</td><td>${newInquiry.description}</td></tr>
            <tr><td style="color:#888">Submitted</td><td>${new Date(newInquiry.submittedAt).toLocaleString()}</td></tr>
          </table>
        ` : `
          <h2>New Project Inquiry</h2>
          <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:500px">
            <tr><td style="color:#888;width:160px">Company</td><td><strong>${newInquiry.companyName}</strong></td></tr>
            <tr><td style="color:#888">Contact</td><td>${newInquiry.contactName}</td></tr>
            <tr><td style="color:#888">Email</td><td>${newInquiry.email}</td></tr>
            <tr><td style="color:#888">Project Type</td><td>${newInquiry.projectType}</td></tr>
            <tr><td style="color:#888">Timeline</td><td>${newInquiry.timeline}</td></tr>
            <tr><td style="color:#888;vertical-align:top">Description</td><td>${newInquiry.description}</td></tr>
            <tr><td style="color:#888">Submitted</td><td>${new Date(newInquiry.submittedAt).toLocaleString()}</td></tr>
          </table>
        `;
      await resend.emails.send({
        from: 'LC3 Club <onboarding@resend.dev>',
        to: process.env.NOTIFICATION_EMAIL,
        subject,
        html,
      });
    } catch (err) {
      console.error('Email notification failed:', err);
    }
  }

  if (process.env.DISCORD_PROJECT_WEBHOOK_URL) {
    try {
      const fields = isSpeaker ? [
        { name: 'Company', value: newInquiry.companyName, inline: true },
        { name: 'Contact', value: newInquiry.contactName, inline: true },
        { name: 'Email', value: newInquiry.email, inline: true },
        { name: 'Topic', value: newInquiry.topic || '—', inline: true },
        { name: 'Availability', value: newInquiry.availability || '—', inline: true },
        { name: 'Bio / Description', value: newInquiry.description },
      ] : isInternship ? [
        { name: 'Company', value: newInquiry.companyName, inline: true },
        { name: 'Contact', value: newInquiry.contactName, inline: true },
        { name: 'Email', value: newInquiry.email, inline: true },
        { name: 'Position', value: newInquiry.positionTitle || '—', inline: true },
        { name: 'Duration', value: newInquiry.duration || '—', inline: true },
        { name: 'Compensation', value: newInquiry.compensation || '—', inline: true },
        ...(newInquiry.requiredSkills ? [{ name: 'Required Skills', value: newInquiry.requiredSkills }] : []),
        { name: 'Description', value: newInquiry.description },
      ] : [
        { name: 'Company', value: newInquiry.companyName, inline: true },
        { name: 'Contact', value: newInquiry.contactName, inline: true },
        { name: 'Email', value: newInquiry.email, inline: true },
        { name: 'Project Type', value: newInquiry.projectType || '—', inline: true },
        { name: 'Timeline', value: newInquiry.timeline || '—', inline: true },
        { name: 'Description', value: newInquiry.description },
      ];

      await fetch(process.env.DISCORD_PROJECT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: isSpeaker ? '🎤 New Guest Speaker Request' : isInternship ? '🎓 New Internship Opportunity' : '🤝 New Project Inquiry',
            color: isSpeaker ? 0x8b5cf6 : isInternship ? 0x10b981 : 0x3b82f6,
            fields,
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
  const inquiries = readJSON<PartnerInquiry[]>('hire.json');
  return NextResponse.json(inquiries);
}
