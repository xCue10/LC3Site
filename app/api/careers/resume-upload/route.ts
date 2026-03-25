import { NextRequest, NextResponse } from 'next/server';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse/lib/pdf-parse.js') as (buf: Buffer) => Promise<{ text: string }>;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'pdf') {
      const data = await pdfParse(buffer);
      return NextResponse.json({ text: data.text });
    }

    // For .txt and plain text files, decode directly
    if (ext === 'txt') {
      return NextResponse.json({ text: buffer.toString('utf-8') });
    }

    return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF or TXT file.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed to parse file. Please try again or paste your resume text.' }, { status: 500 });
  }
}
