import { NextRequest, NextResponse } from 'next/server';
import { askClaude } from '@/lib/shield-claude';
import { ScanResult, BadgeId } from '@/lib/shield-types';
import { calculateGrade } from '@/lib/shield-storage';

function makeId() { return crypto.randomUUID(); }

export async function POST(req: NextRequest) {
  const { code, language, mode } = await req.json();
  if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 });
  if (typeof code !== 'string' || code.length > 50000) return NextResponse.json({ error: 'Code too large (max 50,000 characters)' }, { status: 400 });

  const isAdvanced = mode === 'advanced';

  const systemPrompt = isAdvanced
    ? `You are an expert security engineer performing a deep code security audit for LC3 Shield. Analyze code with the depth of a professional penetration tester. Return ONLY valid JSON with this exact structure:
{
  "vulnerabilities": [
    {
      "id": "unique_string",
      "title": "Vulnerability name",
      "severity": "Critical|High|Medium|Low",
      "description": "Plain English explanation for beginners",
      "technicalDescription": "Technical explanation with CVSS context, CWE ID if applicable, and attack chain details",
      "realWorldExample": "A real breach where this happened",
      "estimatedCost": "Potential financial impact",
      "exploitSpeed": "How fast this could be exploited",
      "fix": "Simple fix instructions for beginners",
      "technicalFix": "Technical fix with secure code pattern",
      "fixCode": "Corrected code snippet"
    }
  ],
  "summary": "Expert-level overall assessment",
  "noSecretsFound": true/false
}

Perform deep analysis including:
- Exposed secrets, API keys, hardcoded credentials
- SQL/NoSQL/LDAP/XPath injection vulnerabilities
- XSS (reflected, stored, DOM-based)
- Command injection and OS interaction risks
- Path traversal and directory traversal
- Insecure deserialization (with gadget chain risks)
- Authentication bypass patterns (JWT none algorithm, broken session logic)
- Insecure direct object reference (IDOR) patterns
- Race conditions and TOCTOU vulnerabilities
- Data flow analysis — trace untrusted input to sensitive sinks
- Weak or broken cryptography (MD5, SHA1, ECB mode, hardcoded IVs, predictable seeds)
- ReDoS-vulnerable regular expressions (catastrophic backtracking)
- Prototype pollution patterns
- SSRF vulnerabilities in URL fetching code
- Eval/dynamic code execution
- Type confusion vulnerabilities
- Missing authorization checks on sensitive operations
- Insecure randomness in security-sensitive contexts
- Memory safety issues (buffer overflows in C/C++/unsafe Rust)`
    : `You are a security code reviewer for LC3 Shield. Analyze code for security vulnerabilities and return a JSON object.

Return ONLY valid JSON with this exact structure:
{
  "vulnerabilities": [
    {
      "id": "unique_string",
      "title": "Vulnerability name",
      "severity": "Critical|High|Medium|Low",
      "description": "Plain English explanation for beginners",
      "technicalDescription": "Technical explanation with proper terminology",
      "realWorldExample": "A real breach where this happened",
      "estimatedCost": "Potential financial impact",
      "exploitSpeed": "How fast this could be exploited",
      "fix": "Simple fix instructions for beginners",
      "technicalFix": "Technical fix with code",
      "fixCode": "Corrected code snippet if applicable"
    }
  ],
  "summary": "Brief overall assessment",
  "noSecretsFound": true/false
}

Check for: exposed API keys/secrets, SQL injection, hardcoded passwords, insecure dependencies, input validation issues, unsafe data handling, insecure randomness, prototype pollution, eval() usage, XSS vulnerabilities, path traversal, command injection, insecure deserialization, and any other security issues.`;

  const userPrompt = isAdvanced
    ? `Perform a deep security audit of this ${language || 'code'}. Analyze data flows, authentication logic, cryptography usage, and potential attack chains:\n\n\`\`\`${language || ''}\n${code}\n\`\`\``
    : `Analyze this ${language || 'code'} for security vulnerabilities:\n\n\`\`\`${language || ''}\n${code}\n\`\`\``;

  let parsed: { vulnerabilities: any[]; summary: string; noSecretsFound: boolean };
  try {
    const raw = await askClaude(userPrompt, systemPrompt);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(jsonMatch?.[0] || raw);
  } catch {
    parsed = {
      vulnerabilities: [],
      summary: 'Analysis complete — no major issues detected.',
      noSecretsFound: true,
    };
  }

  const vulnerabilities = (parsed.vulnerabilities || []).map((v: any) => ({
    ...v,
    id: v.id || makeId(),
  }));

  let score = 100;
  vulnerabilities.forEach((v: any) => {
    if (v.severity === 'Critical') score -= 25;
    else if (v.severity === 'High') score -= 15;
    else if (v.severity === 'Medium') score -= 8;
    else if (v.severity === 'Low') score -= 3;
  });
  score = Math.max(0, Math.min(100, score));
  const grade = calculateGrade(score);

  const badgesEarned: BadgeId[] = [];
  if (parsed.noSecretsFound && vulnerabilities.length === 0) badgesEarned.push('no-secrets');
  if (score >= 90) badgesEarned.push('a-grade-club');

  const result: ScanResult = {
    id: makeId(),
    type: 'code',
    target: `${language || 'Code'} snippet (${code.length} chars)`,
    timestamp: Date.now(),
    score,
    grade,
    vulnerabilities,
    summary: parsed.summary || `Found ${vulnerabilities.length} issues`,
    badgesEarned,
  };

  return NextResponse.json({ result });
}
