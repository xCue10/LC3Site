import { NextResponse } from 'next/server';
import { askClaude } from '@/lib/shield-claude';

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const tips = [
    'Always use HTTPS for your websites',
    'Never hardcode API keys in your code',
    'Use parameterized queries to prevent SQL injection',
    'Keep your dependencies updated regularly',
    'Use strong, unique passwords for every service',
    'Enable two-factor authentication everywhere possible',
    'Validate and sanitize all user input',
    'Use environment variables for sensitive configuration',
    'Review your GitHub repos for accidentally committed secrets',
    'Monitor your error logs for unusual patterns',
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  try {
    const tip = await askClaude(
      `Give a single, practical daily security tip for beginner web developers. The theme for today: "${randomTip}". Make it 2-3 sentences maximum. Be specific and actionable. Include one concrete example. No markdown formatting.`,
      'You are a friendly cybersecurity mentor for LC3 Shield. Give practical, encouraging security tips.'
    );
    return NextResponse.json({ tip, date: today });
  } catch {
    return NextResponse.json({
      tip: `Today's tip: ${randomTip}. This is one of the most important security practices for any developer. Start implementing it today!`,
      date: today,
    });
  }
}
