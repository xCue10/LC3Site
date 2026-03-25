import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Plain text — decode directly, no AI needed
    if (ext === 'txt') {
      return NextResponse.json({ text: buffer.toString('utf-8') });
    }

    // PDF — send to Claude as a document block for extraction
    if (ext === 'pdf') {
      const base64 = buffer.toString('base64');
      const response = await client.messages.create({
        model: 'claude-sonnet-4-5-20251001',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'document',
              source: { type: 'base64', media_type: 'application/pdf', data: base64 },
            } as Parameters<typeof client.messages.create>[0]['messages'][0]['content'][0],
            {
              type: 'text',
              text: 'Extract all text from this resume exactly as written, preserving the layout and structure as plain text. Return only the extracted text — no commentary, no formatting changes.',
            },
          ],
        }],
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      return NextResponse.json({ text });
    }

    return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF or TXT file.' }, { status: 400 });
  } catch (err) {
    console.error('[resume-upload]', err);
    return NextResponse.json({ error: 'Failed to read file. Please try again or paste your resume text.' }, { status: 500 });
  }
}
