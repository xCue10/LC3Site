import { NextRequest, NextResponse } from 'next/server';
import { askClaude } from '@/lib/shield-claude';
import { ScanResult, BadgeId } from '@/lib/shield-types';
import { calculateGrade } from '@/lib/shield-storage';

function makeId() { return crypto.randomUUID(); }

function decodeBase64(str: string): any {
  try {
    const padded = str + '=='.slice((str.length % 4) || 4);
    const decoded = Buffer.from(padded, 'base64url').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    try {
      return JSON.parse(Buffer.from(str, 'base64').toString('utf-8'));
    } catch {
      return null;
    }
  }
}

export async function POST(req: NextRequest) {
  const { token, mode } = await req.json();
  if (!token) return NextResponse.json({ error: 'JWT token required' }, { status: 400 });

  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return NextResponse.json({ error: 'Invalid JWT format (must have 3 parts separated by dots)' }, { status: 400 });
  }

  const [headerB64, payloadB64] = parts;
  const header = decodeBase64(headerB64);
  const payload = decodeBase64(payloadB64);

  if (!header || !payload) {
    return NextResponse.json({ error: 'Could not decode JWT — invalid format' }, { status: 400 });
  }

  const vulnerabilities: any[] = [];
  const now = Math.floor(Date.now() / 1000);

  // Check algorithm
  const alg = header.alg?.toLowerCase();
  if (alg === 'none' || !alg) {
    vulnerabilities.push({
      id: makeId(),
      title: 'None Algorithm Attack (Critical!)',
      severity: 'Critical',
      description: 'This JWT uses "none" as its algorithm, meaning there is NO signature verification. Anyone can forge this token and pretend to be any user.',
      technicalDescription: 'JWT header specifies alg:"none". The signature is not verified by vulnerable JWT libraries. This allows token forgery without needing the secret key.',
      realWorldExample: 'In 2018, Auth0 disclosed a critical vulnerability where their JWT library accepted "none" algorithm tokens, allowing full account takeover.',
      estimatedCost: 'Full authentication bypass — unlimited damage',
      exploitSpeed: 'Under 30 seconds with any JWT tool',
      fix: 'Your server must reject any JWT that doesn\'t use a strong algorithm like RS256 or HS256.',
      technicalFix: 'Explicitly whitelist allowed algorithms: jwt.verify(token, secret, { algorithms: ["HS256"] })',
      fixCode: '// Node.js jsonwebtoken\njwt.verify(token, secret, { algorithms: ["HS256"] });\n\n// NEVER allow "none" algorithm\n// Reject tokens where header.alg === "none"',
    });
  } else if (alg === 'hs256' || alg === 'hs384' || alg === 'hs512') {
    vulnerabilities.push({
      id: makeId(),
      title: 'Symmetric Algorithm (HS256) — Secret Must Be Strong',
      severity: 'Low',
      description: 'This token uses HS256 which is acceptable, but requires a strong secret key. If the secret is weak, attackers can brute-force it.',
      technicalDescription: 'HMAC-based JWT algorithms (HS256/384/512) use a shared secret for both signing and verification. Weak secrets are vulnerable to offline dictionary/brute-force attacks.',
      realWorldExample: 'JWT secrets like "secret", "password", or short strings are trivially cracked using tools like hashcat in seconds.',
      estimatedCost: '$10K–$1M if authentication is bypassed',
      exploitSpeed: 'Minutes for weak secrets; impractical for 256-bit random secrets',
      fix: 'Make sure your JWT secret is at least 256 bits (32 bytes) of random data.',
      technicalFix: 'Generate secure secret: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
      fixCode: "const secret = require('crypto').randomBytes(32).toString('hex');\n// Store in environment variable, not code",
    });
  }

  // Check expiration
  if (!payload.exp) {
    vulnerabilities.push({
      id: makeId(),
      title: 'Missing Expiration (exp) Claim',
      severity: 'High',
      description: 'This token never expires! If stolen, an attacker can use it forever.',
      technicalDescription: 'No "exp" (expiration time) claim in JWT payload. Tokens without expiration are valid indefinitely, creating permanent credential theft risk.',
      realWorldExample: 'Non-expiring API tokens have been found in breach data years after the initial compromise, still granting access.',
      estimatedCost: 'Ongoing unauthorized access — $500K+ over time',
      exploitSpeed: 'Immediate and permanent once stolen',
      fix: 'Always add an expiration time to your JWTs. Use short lifetimes (15 minutes to 1 hour for access tokens).',
      technicalFix: 'jwt.sign(payload, secret, { expiresIn: "15m" })',
      fixCode: "// Good practice:\njwt.sign({ userId: user.id }, secret, {\n  expiresIn: '15m',  // Short-lived access token\n  issuer: 'your-app',\n  audience: 'your-api'\n});",
    });
  } else {
    const expDate = new Date(payload.exp * 1000);
    const ageSeconds = now - (payload.iat || 0);

    if (payload.exp < now) {
      vulnerabilities.push({
        id: makeId(),
        title: 'Token Has Expired',
        severity: 'Info',
        description: `This token expired on ${expDate.toLocaleString()}. It should no longer be accepted.`,
        technicalDescription: `JWT exp claim (${payload.exp}) is in the past. Token expired ${Math.round((now - payload.exp) / 60)} minutes ago.`,
        realWorldExample: 'Accepting expired tokens is a common misconfiguration that extends attack windows.',
        estimatedCost: 'Negligible if properly rejected',
        exploitSpeed: 'Only exploitable if server accepts expired tokens',
        fix: 'Make sure your server validates the exp claim and rejects expired tokens.',
        technicalFix: 'jwt.verify() in Node.js automatically checks expiration by default.',
        fixCode: '// jsonwebtoken automatically rejects expired tokens\njwt.verify(token, secret); // throws TokenExpiredError if expired',
      });
    }

    if (ageSeconds > 86400 * 30 && payload.exp > now) {
      vulnerabilities.push({
        id: makeId(),
        title: 'Token Lifetime is Too Long',
        severity: 'Medium',
        description: 'This token is valid for more than 30 days. Long-lived tokens are risky because if stolen, the attacker has access for a long time.',
        technicalDescription: `Token was issued ${Math.round(ageSeconds / 86400)} days ago and is still valid. Long token lifetimes increase the damage window if credentials are stolen.`,
        realWorldExample: 'Long-lived auth tokens discovered in breach dumps remained valid months after initial theft.',
        estimatedCost: 'Extended unauthorized access window',
        exploitSpeed: 'Immediate once token is stolen',
        fix: 'Use short-lived access tokens (15–60 minutes) with refresh tokens for a better security model.',
        technicalFix: 'Implement refresh token rotation with short access token lifetimes.',
        fixCode: '// Access token: 15 minutes\njwt.sign(payload, secret, { expiresIn: "15m" });\n\n// Refresh token: 7 days, stored securely\njwt.sign({ userId }, refreshSecret, { expiresIn: "7d" });',
      });
    }
  }

  // Check issuer and audience
  if (!payload.iss) {
    vulnerabilities.push({
      id: makeId(),
      title: 'Missing Issuer (iss) Claim',
      severity: 'Low',
      description: 'The token doesn\'t say who created it. This makes it harder to validate and easier to mix up with tokens from other services.',
      technicalDescription: 'No "iss" (issuer) claim. Without issuer validation, tokens from different services may be accepted interchangeably.',
      realWorldExample: 'Confused deputy attacks can occur when different services accept each other\'s tokens without issuer checks.',
      estimatedCost: '$10K–$100K in cross-service exploitation',
      exploitSpeed: '1–4 hours for targeted attacks',
      fix: 'Add an "iss" (issuer) claim identifying your application and validate it on every request.',
      technicalFix: 'jwt.sign(payload, secret, { issuer: "your-app.com" })\njwt.verify(token, secret, { issuer: "your-app.com" })',
      fixCode: "jwt.sign(payload, secret, { issuer: 'api.yourapp.com' });",
    });
  }

  if (!payload.aud) {
    vulnerabilities.push({
      id: makeId(),
      title: 'Missing Audience (aud) Claim',
      severity: 'Low',
      description: 'The token doesn\'t specify which service it\'s for. A token meant for one API could potentially be used with another.',
      technicalDescription: 'No "aud" (audience) claim. Without audience validation, tokens can be replayed across different services.',
      realWorldExample: 'Tokens without audience claims have been used in API confusion attacks where one service\'s token grants access to another.',
      estimatedCost: 'Cross-service unauthorized access',
      exploitSpeed: '30 minutes for cross-service token replay',
      fix: 'Add an audience claim specifying which service this token is for.',
      technicalFix: 'jwt.sign(payload, secret, { audience: "api.yourapp.com" })',
      fixCode: "jwt.sign(payload, secret, { audience: 'api.yourapp.com' });",
    });
  }

  // Check for sensitive data in payload
  const sensitiveKeys = ['password', 'secret', 'ssn', 'creditcard', 'card', 'cvv', 'pin', 'key', 'token', 'private'];
  const foundSensitive = Object.keys(payload).filter(k =>
    sensitiveKeys.some(sk => k.toLowerCase().includes(sk))
  );

  if (foundSensitive.length > 0) {
    vulnerabilities.push({
      id: makeId(),
      title: `Sensitive Data in Payload: ${foundSensitive.join(', ')}`,
      severity: 'High',
      description: 'JWTs are NOT encrypted by default — they are only encoded (Base64). Anyone who intercepts this token can read the payload.',
      technicalDescription: `JWT payload contains fields (${foundSensitive.join(', ')}) that may contain sensitive data. JWT payloads are base64url-encoded, not encrypted. Any party with the token can decode the payload.`,
      realWorldExample: 'APIs have exposed PII, SSNs, and credit card data via JWT payloads visible in browser developer tools and network logs.',
      estimatedCost: 'PII exposure: GDPR fines up to €20M or 4% of global revenue',
      exploitSpeed: 'Immediate — just decode the base64',
      fix: 'Never store sensitive data in a JWT. Store a user ID reference instead and look up sensitive data server-side.',
      technicalFix: 'Use JWE (JSON Web Encryption) if you must encrypt the payload, or use opaque session tokens instead.',
      fixCode: '// WRONG:\njwt.sign({ password: "secret123", ssn: "123-45-6789" }, key);\n\n// RIGHT:\njwt.sign({ userId: "user_abc123" }, key);\n// Look up sensitive data server-side using userId',
    });
  }

  // Use Claude for additional explanation
  const claudeAnalysis = await askClaude(
    `Analyze this JWT:\nHeader: ${JSON.stringify(header, null, 2)}\nPayload: ${JSON.stringify(payload, null, 2)}\n\nProvide a brief ${mode === 'advanced' ? 'technical' : 'beginner-friendly'} security assessment in 2-3 sentences.`,
    'You are a JWT security expert. Be concise and helpful.'
  );

  let score = 100;
  vulnerabilities.forEach((v: any) => {
    if (v.severity === 'Critical') score -= 30;
    else if (v.severity === 'High') score -= 20;
    else if (v.severity === 'Medium') score -= 10;
    else if (v.severity === 'Low') score -= 5;
  });
  score = Math.max(0, Math.min(100, score));
  const grade = calculateGrade(score);

  const badgesEarned: BadgeId[] = [];
  if (score >= 90) badgesEarned.push('a-grade-club');

  const result: ScanResult = {
    id: makeId(),
    type: 'jwt',
    target: 'JWT Token',
    timestamp: Date.now(),
    score,
    grade,
    vulnerabilities,
    summary: claudeAnalysis,
    badgesEarned,
  };

  return NextResponse.json({ result, decodedHeader: header, decodedPayload: payload });
}
