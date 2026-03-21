import { NextRequest, NextResponse } from 'next/server';
import { askClaude } from '@/lib/shield-claude';
import { ScanResult, BadgeId } from '@/lib/shield-types';
import { calculateGrade } from '@/lib/shield-storage';

function makeId() { return crypto.randomUUID(); }

export interface OWASPQuestion {
  id: string;
  category: string;
  question: string;
  yesIsSafe: boolean;
  failSeverity: 'Critical' | 'High' | 'Medium' | 'Low';
}

export const OWASP_QUESTIONS: OWASPQuestion[] = [
  // A01: Broken Access Control
  { id: 'ac1', category: 'Broken Access Control', question: 'Do you verify user permissions on every API endpoint before returning data?', yesIsSafe: true, failSeverity: 'Critical' },
  { id: 'ac2', category: 'Broken Access Control', question: 'Do users see only data they are authorized to view (no IDOR issues)?', yesIsSafe: true, failSeverity: 'Critical' },
  { id: 'ac3', category: 'Broken Access Control', question: 'Is directory browsing disabled on your web server?', yesIsSafe: true, failSeverity: 'High' },
  // A02: Cryptographic Failures
  { id: 'cf1', category: 'Cryptographic Failures', question: 'Are all user passwords hashed with a strong algorithm (bcrypt, Argon2) — NOT MD5 or SHA1?', yesIsSafe: true, failSeverity: 'Critical' },
  { id: 'cf2', category: 'Cryptographic Failures', question: 'Is all sensitive data encrypted both at rest and in transit?', yesIsSafe: true, failSeverity: 'High' },
  { id: 'cf3', category: 'Cryptographic Failures', question: 'Do you avoid transmitting sensitive data in URL parameters or GET requests?', yesIsSafe: true, failSeverity: 'High' },
  // A03: Injection
  { id: 'inj1', category: 'Injection', question: 'Do you use parameterized queries or prepared statements for ALL database operations?', yesIsSafe: true, failSeverity: 'Critical' },
  { id: 'inj2', category: 'Injection', question: 'Do you validate and sanitize all user input before processing it?', yesIsSafe: true, failSeverity: 'High' },
  { id: 'inj3', category: 'Injection', question: 'Do you avoid using eval() or passing user input to shell commands?', yesIsSafe: true, failSeverity: 'Critical' },
  // A04: Insecure Design
  { id: 'id1', category: 'Insecure Design', question: 'Do you have rate limiting on login endpoints and sensitive operations?', yesIsSafe: true, failSeverity: 'High' },
  { id: 'id2', category: 'Insecure Design', question: 'Do you have security requirements documented before writing code?', yesIsSafe: true, failSeverity: 'Medium' },
  // A05: Security Misconfiguration
  { id: 'sc1', category: 'Security Misconfiguration', question: 'Have you changed all default passwords on frameworks, databases, and admin panels?', yesIsSafe: true, failSeverity: 'Critical' },
  { id: 'sc2', category: 'Security Misconfiguration', question: 'Is error reporting showing detailed errors to end users disabled in production?', yesIsSafe: true, failSeverity: 'Medium' },
  { id: 'sc3', category: 'Security Misconfiguration', question: 'Do you have all unnecessary features, ports, and services disabled?', yesIsSafe: true, failSeverity: 'Medium' },
  // A06: Vulnerable Components
  { id: 'vc1', category: 'Vulnerable Components', question: 'Do you regularly update all dependencies and check for known vulnerabilities?', yesIsSafe: true, failSeverity: 'High' },
  { id: 'vc2', category: 'Vulnerable Components', question: 'Do you only use dependencies from trusted, maintained sources?', yesIsSafe: true, failSeverity: 'Medium' },
  // A07: Authentication Failures
  { id: 'af1', category: 'Authentication Failures', question: 'Do you enforce strong password requirements?', yesIsSafe: true, failSeverity: 'High' },
  { id: 'af2', category: 'Authentication Failures', question: 'Do you implement account lockout after multiple failed login attempts?', yesIsSafe: true, failSeverity: 'High' },
  { id: 'af3', category: 'Authentication Failures', question: 'Do session tokens expire after inactivity?', yesIsSafe: true, failSeverity: 'Medium' },
  // A08: Data Integrity Failures
  { id: 'di1', category: 'Data Integrity Failures', question: 'Do you verify the integrity of data received from untrusted sources?', yesIsSafe: true, failSeverity: 'High' },
  { id: 'di2', category: 'Data Integrity Failures', question: 'Do you use integrity checks (SRI) for third-party scripts loaded from CDNs?', yesIsSafe: true, failSeverity: 'Medium' },
  // A09: Logging Failures
  { id: 'lf1', category: 'Logging Failures', question: 'Do you log failed login attempts, privilege escalation, and input validation failures?', yesIsSafe: true, failSeverity: 'Medium' },
  { id: 'lf2', category: 'Logging Failures', question: 'Are you monitoring logs for suspicious activity?', yesIsSafe: true, failSeverity: 'Medium' },
  { id: 'lf3', category: 'Logging Failures', question: 'Do your logs avoid storing sensitive data like passwords or full credit card numbers?', yesIsSafe: true, failSeverity: 'High' },
  // A10: SSRF
  { id: 'ssrf1', category: 'SSRF', question: 'Do you validate and restrict URLs when your app makes requests based on user input?', yesIsSafe: true, failSeverity: 'High' },
  { id: 'ssrf2', category: 'SSRF', question: 'Do you block requests to internal/private IP ranges from user-controlled URLs?', yesIsSafe: true, failSeverity: 'Critical' },
];

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
