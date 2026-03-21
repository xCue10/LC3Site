import { NextRequest, NextResponse } from 'next/server';
import { askClaude } from '@/lib/shield-claude';
import { ScanResult, BadgeId } from '@/lib/shield-types';
import { calculateGrade } from '@/lib/shield-storage';
import { OWASP_QUESTIONS } from '@/lib/owasp-questions';

function makeId() { return crypto.randomUUID(); }

export async function POST(req: NextRequest) {
  const { answers, mode } = await req.json();
  // answers: Record<questionId, 'yes' | 'no' | 'unsure'>

  const vulnerabilities: any[] = [];

  for (const q of OWASP_QUESTIONS) {
    const answer = answers[q.id];
    const failed = q.yesIsSafe ? (answer === 'no' || answer === 'unsure') : (answer === 'yes');
    const isUnsure = answer === 'unsure';

    if (failed) {
      const severity = isUnsure ? (q.failSeverity === 'Critical' ? 'High' : q.failSeverity) : q.failSeverity;

      // Get AI explanation
      const explanation = await askClaude(
        `For OWASP category "${q.category}", question: "${q.question}" — the developer answered "${answer}". Provide a JSON response:
{
  "description": "Simple 2-sentence explanation for beginners of why this is risky",
  "technicalDescription": "Technical explanation with OWASP details",
  "realWorldExample": "One real breach example",
  "estimatedCost": "Typical financial impact",
  "exploitSpeed": "How quickly this can be exploited",
  "fix": "Simple 2-sentence fix for beginners",
  "technicalFix": "Technical implementation fix",
  "fixCode": "Example code fixing this issue"
}`,
        'You are a cybersecurity expert. Return only valid JSON.'
      );

      let details: any = {};
      try {
        const jsonMatch = explanation.match(/\{[\s\S]*\}/);
        details = JSON.parse(jsonMatch?.[0] || '{}');
      } catch {
        details = {
          description: `Your application may be vulnerable to ${q.category}. This is one of the OWASP Top 10 most critical web security risks.`,
          technicalDescription: `OWASP ${q.category}: The application does not appear to implement this security control properly.`,
          realWorldExample: `${q.category} vulnerabilities appear in major breaches every year.`,
          estimatedCost: 'Varies — can be millions in data breach costs',
          exploitSpeed: 'Depends on vulnerability specifics',
          fix: 'Implement the required security control as described in OWASP guidance.',
          technicalFix: 'See OWASP documentation: owasp.org/Top10',
          fixCode: '// See OWASP cheat sheet for specific implementation',
        };
      }

      vulnerabilities.push({
        id: makeId(),
        title: `${q.category}: ${q.question.slice(0, 60)}${q.question.length > 60 ? '...' : ''}`,
        severity,
        ...details,
      });
    }
  }

  const passedCount = Object.values(answers).filter(a => a === 'yes').length;
  const totalQuestions = OWASP_QUESTIONS.length;
  const score = Math.round((passedCount / totalQuestions) * 100);
  const grade = calculateGrade(score);

  const badgesEarned: BadgeId[] = [];
  if (vulnerabilities.length === 0) badgesEarned.push('owasp-aware');
  if (score >= 90) badgesEarned.push('a-grade-club');

  const result: ScanResult = {
    id: makeId(),
    type: 'owasp',
    target: 'OWASP Top 10 Self-Assessment',
    timestamp: Date.now(),
    score,
    grade,
    vulnerabilities,
    summary: `Completed OWASP Top 10 assessment: ${passedCount}/${totalQuestions} controls passed`,
    badgesEarned,
  };

  return NextResponse.json({ result });
}
