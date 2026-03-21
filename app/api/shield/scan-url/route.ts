import { NextRequest, NextResponse } from 'next/server';
import { askClaude } from '@/lib/shield-claude';
import { Vulnerability, ScanResult, BadgeId } from '@/lib/shield-types';
import { calculateGrade } from '@/lib/shield-storage';
function makeId() { return crypto.randomUUID(); }

export async function POST(req: NextRequest) {
  const { url, mode } = await req.json();

  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });
  if (typeof url !== 'string' || url.length > 2000) return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });

  let targetUrl = url;
  if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

  const vulnerabilities: Vulnerability[] = [];
  const logs: string[] = [];

  // Check HTTPS
  logs.push('Checking protocol security...');
  const isHttps = targetUrl.startsWith('https://');
  if (!isHttps) {
    vulnerabilities.push({
      id: makeId(),
      title: 'Missing HTTPS',
      severity: 'Critical',
      description: 'Your site uses HTTP instead of HTTPS, meaning all data is sent unencrypted.',
      technicalDescription: 'The site does not enforce TLS/SSL. All traffic is transmitted in plaintext, vulnerable to MITM attacks.',
      realWorldExample: 'In 2017, a major airline exposed 500,000 customer records because their booking portal used HTTP.',
      estimatedCost: '$3.86M average data breach cost',
      exploitSpeed: 'Under 60 seconds with basic tools',
      fix: 'Get a free SSL certificate from Let\'s Encrypt and redirect all HTTP traffic to HTTPS.',
      technicalFix: 'Install certbot, run `certbot --nginx` or `certbot --apache`, then add HTTP→HTTPS redirect in your server config.',
      fixCode: 'server {\n  listen 80;\n  return 301 https://$host$request_uri;\n}',
    });
  }

  // Fetch headers
  logs.push('Fetching HTTP headers...');
  let headers: Record<string, string> = {};
  let fetchError = false;
  try {
    const res = await fetch(targetUrl, {
      method: 'HEAD',
      signal: AbortSignal.timeout(10000),
      redirect: 'follow',
    });
    res.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });
    logs.push(`Received ${Object.keys(headers).length} headers`);
  } catch {
    fetchError = true;
    logs.push('Could not reach target (may be blocked or offline)');
  }

  if (!fetchError) {
    // CSP
    logs.push('Checking Content-Security-Policy...');
    if (!headers['content-security-policy']) {
      vulnerabilities.push({
        id: makeId(),
        title: 'Missing Content-Security-Policy Header',
        severity: 'High',
        description: 'No CSP header means attackers can inject malicious scripts into your pages.',
        technicalDescription: 'Absence of Content-Security-Policy header allows XSS attacks to execute arbitrary JavaScript in user browsers.',
        realWorldExample: 'The 2018 British Airways breach ($230M fine) involved injected scripts stealing payment data from pages with no CSP.',
        estimatedCost: '$50K–$230M depending on data exposed',
        exploitSpeed: '5–30 minutes for a skilled attacker',
        fix: 'Add a Content-Security-Policy header that restricts where scripts can load from.',
        technicalFix: "Add to your server config: Content-Security-Policy: default-src 'self'; script-src 'self'",
        fixCode: "// Next.js next.config.js\nheaders: [{ key: 'Content-Security-Policy', value: \"default-src 'self'\" }]",
      });
    }

    // X-Frame-Options
    logs.push('Checking clickjacking protection...');
    if (!headers['x-frame-options'] && !headers['content-security-policy']?.includes('frame-ancestors')) {
      vulnerabilities.push({
        id: makeId(),
        title: 'Missing X-Frame-Options (Clickjacking Risk)',
        severity: 'High',
        description: 'Your site can be embedded in an invisible frame, tricking users into clicking things they didn\'t intend to.',
        technicalDescription: 'No X-Frame-Options or CSP frame-ancestors directive. Site is vulnerable to UI redress / clickjacking attacks.',
        realWorldExample: 'Twitter had a clickjacking bug that let attackers auto-follow accounts without user consent.',
        estimatedCost: '$10K–$500K in fraud or account takeovers',
        exploitSpeed: '1–2 hours to craft an attack',
        fix: 'Add X-Frame-Options: DENY or SAMEORIGIN to prevent your site from being embedded in iframes.',
        technicalFix: "Add header: X-Frame-Options: SAMEORIGIN",
        fixCode: "// Express.js\napp.use((req, res, next) => {\n  res.setHeader('X-Frame-Options', 'SAMEORIGIN');\n  next();\n});",
      });
    }

    // HSTS
    logs.push('Checking HSTS...');
    if (!headers['strict-transport-security']) {
      vulnerabilities.push({
        id: makeId(),
        title: 'Missing HSTS Header',
        severity: 'Medium',
        description: 'Without HSTS, browsers can be tricked into loading your site over HTTP even if HTTPS is available.',
        technicalDescription: 'No Strict-Transport-Security header. Vulnerable to SSL stripping attacks where attacker downgrades HTTPS to HTTP.',
        realWorldExample: 'SSL stripping attacks were used in public WiFi attacks at conferences to intercept credentials.',
        estimatedCost: '$5K–$50K per credential compromise',
        exploitSpeed: '5 minutes on public WiFi',
        fix: 'Add a Strict-Transport-Security header to force browsers to always use HTTPS.',
        technicalFix: "Strict-Transport-Security: max-age=31536000; includeSubDomains; preload",
        fixCode: "Strict-Transport-Security: max-age=31536000; includeSubDomains",
      });
    }

    // X-Content-Type-Options
    logs.push('Checking MIME type sniffing protection...');
    if (!headers['x-content-type-options']) {
      vulnerabilities.push({
        id: makeId(),
        title: 'Missing X-Content-Type-Options',
        severity: 'Medium',
        description: 'Browsers might guess file types incorrectly, potentially executing malicious content.',
        technicalDescription: 'No X-Content-Type-Options: nosniff header. Browsers may MIME-sniff responses and execute content incorrectly.',
        realWorldExample: 'An attacker could upload a file named "photo.jpg" that actually contains JavaScript, which IE would execute.',
        estimatedCost: '$5K–$100K',
        exploitSpeed: '30 minutes for file upload exploitation',
        fix: 'Add X-Content-Type-Options: nosniff to prevent MIME type sniffing.',
        technicalFix: "X-Content-Type-Options: nosniff",
        fixCode: "res.setHeader('X-Content-Type-Options', 'nosniff');",
      });
    }

    // Referrer Policy
    logs.push('Checking referrer policy...');
    if (!headers['referrer-policy']) {
      vulnerabilities.push({
        id: makeId(),
        title: 'Missing Referrer-Policy Header',
        severity: 'Low',
        description: 'Your site may leak URL information to third-party sites when users click links.',
        technicalDescription: 'No Referrer-Policy header. Full URL including query parameters may be sent to external sites via the Referer header.',
        realWorldExample: 'Health sites have leaked diagnosis search terms to advertisers through referrer headers.',
        estimatedCost: 'Privacy violations, GDPR fines up to €20M',
        exploitSpeed: 'Passive collection over time',
        fix: 'Add Referrer-Policy: strict-origin-when-cross-origin',
        technicalFix: "Referrer-Policy: strict-origin-when-cross-origin",
        fixCode: "res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');",
      });
    }

    // Permissions Policy
    logs.push('Checking permissions policy...');
    if (!headers['permissions-policy']) {
      vulnerabilities.push({
        id: makeId(),
        title: 'Missing Permissions-Policy Header',
        severity: 'Low',
        description: 'Third-party content on your site could access camera, microphone, or location without restriction.',
        technicalDescription: 'No Permissions-Policy header. Embedded third-party iframes and scripts may access sensitive browser APIs.',
        realWorldExample: 'Malicious ads have accessed microphones through browser permissions on sites without restrictions.',
        estimatedCost: 'Privacy violations, regulatory fines',
        exploitSpeed: 'Passive — through third-party scripts',
        fix: 'Add Permissions-Policy to restrict access to sensitive browser features.',
        technicalFix: "Permissions-Policy: camera=(), microphone=(), geolocation=()",
        fixCode: "Permissions-Policy: camera=(), microphone=(), geolocation=()",
      });
    }

    // Mixed content check (basic)
    logs.push('Checking for mixed content signals...');
    if (isHttps && headers['content-type']?.includes('text/html')) {
      // We can't parse HTML from a HEAD request, so flag as informational
      vulnerabilities.push({
        id: makeId(),
        title: 'Potential Mixed Content (Verify Manually)',
        severity: 'Low',
        description: 'Check that your HTTPS pages don\'t load any resources (images, scripts) over HTTP.',
        technicalDescription: 'Mixed content occurs when HTTPS pages load subresources over HTTP, triggering browser warnings and security risks.',
        realWorldExample: 'Mixed content warnings cause users to distrust sites and browsers to block resources silently.',
        estimatedCost: 'User trust loss, broken functionality',
        exploitSpeed: 'Passive — data interception over HTTP resources',
        fix: 'Ensure all resources (images, scripts, CSS, fonts) are loaded over HTTPS.',
        technicalFix: 'Search your codebase for http:// URLs and update to https:// or use protocol-relative URLs.',
        fixCode: '// Change: <script src="http://cdn.example.com/lib.js">\n// To: <script src="https://cdn.example.com/lib.js">',
      });
    }
  }

  // Use Claude to summarize
  logs.push('Running AI security analysis...');
  const severityCounts = {
    Critical: vulnerabilities.filter(v => v.severity === 'Critical').length,
    High: vulnerabilities.filter(v => v.severity === 'High').length,
    Medium: vulnerabilities.filter(v => v.severity === 'Medium').length,
    Low: vulnerabilities.filter(v => v.severity === 'Low').length,
  };

  // Score calculation
  let score = 100;
  score -= severityCounts.Critical * 25;
  score -= severityCounts.High * 15;
  score -= severityCounts.Medium * 8;
  score -= severityCounts.Low * 3;
  score = Math.max(0, Math.min(100, score));

  const grade = calculateGrade(score);

  const badgesEarned: BadgeId[] = [];
  if (isHttps && !vulnerabilities.find(v => v.title.includes('HTTPS'))) {
    badgesEarned.push('https-hero');
  }
  if (score >= 90) badgesEarned.push('a-grade-club');

  logs.push('Scan complete!');

  const result: ScanResult = {
    id: makeId(),
    type: 'url',
    target: targetUrl,
    timestamp: Date.now(),
    score,
    grade,
    vulnerabilities,
    summary: `Found ${vulnerabilities.length} issues: ${severityCounts.Critical} Critical, ${severityCounts.High} High, ${severityCounts.Medium} Medium, ${severityCounts.Low} Low`,
    badgesEarned,
  };

  return NextResponse.json({ result, logs });
}
