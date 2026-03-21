import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODEL = 'claude-sonnet-4-20250514';

export async function askClaude(prompt: string, systemPrompt?: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: systemPrompt || 'You are a cybersecurity expert assistant for LC3 Shield, a security scanning tool used by beginner developers and students. Be helpful, clear, and encouraging.',
    messages: [{ role: 'user', content: prompt }],
  });
  return response.content[0].type === 'text' ? response.content[0].text : '';
}

export async function streamClaude(
  prompt: string,
  systemPrompt: string,
  onChunk: (text: string) => void
): Promise<void> {
  const stream = await anthropic.messages.stream({
    model: MODEL,
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  });
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      onChunk(chunk.delta.text);
    }
  }
}
