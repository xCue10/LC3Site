import { NextRequest, NextResponse } from 'next/server';
import { anthropic, MODEL } from '@/lib/shield-claude';

export async function POST(req: NextRequest) {
  const { messages, context, mode } = await req.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: 'Messages required' }, { status: 400 });
  }

  const systemPrompt = mode === 'advanced'
    ? `You are an expert cybersecurity mentor for LC3 Shield, a security scanning tool. You use proper technical terminology and assume the user has development experience. Be precise and detailed. Context from current scan: ${context || 'General security questions'}.`
    : `You are a friendly cybersecurity mentor for LC3 Shield, a security scanning tool used by beginner developers and students. Use simple language, analogies, and be encouraging. Avoid jargon unless you explain it. Always be supportive and positive. Context from current scan: ${context || 'General security questions'}.`;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const reply = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
