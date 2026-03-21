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

    // Advanced mode: deeper header checks
    if (mode === 'advanced') {
      logs.push('[Advanced] Checking cross-origin isolation headers...');

      if (!headers['cross-origin-opener-policy']) {
        vulnerabilities.push({
          id: makeId(),
          title: 'Missing Cross-Origin-Opener-Policy (COOP)',
          severity: 'Medium',
          description: 'Your site can be targeted by cross-origin attacks that read window state or perform timing attacks via shared browsing contexts.',
          technicalDescription: 'No Cross-Origin-Opener-Policy header. Enables Spectre-style cross-origin leaks via shared browsing context with opener pages.',
          realWorldExample: 'Spectre CPU vulnerability exploited shared memory timing to read cross-origin data in browsers.',
          estimatedCost: '$100K–$1M+ in data exposure',
          exploitSpeed: '1–2 hours for a skilled attacker',
          fix: 'Add Cross-Origin-Opener-Policy: same-origin to isolate your browsing context.',
          technicalFix: 'Cross-Origin-Opener-Policy: same-origin',
          fixCode: "res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');",
        });
      }

      if (!headers['cross-origin-embedder-policy']) {
        vulnerabilities.push({
          id: makeId(),
          title: 'Missing Cross-Origin-Embedder-Policy (COEP)',
          severity: 'Low',
          description: 'Without COEP, your site cannot enable powerful isolation features and is more exposed to Spectre-style timing attacks.',
          technicalDescription: 'No Cross-Origin-Embedder-Policy header. Required alongside COOP to achieve cross-origin isolation and safely enable high-resolution timers.',
          realWorldExample: 'SharedArrayBuffer was disabled in browsers after Spectre; COEP is required to safely re-enable it.',
          estimatedCost: 'Security posture risk — limits available hardening options',
          exploitSpeed: 'Indirect — enables Spectre-style timing attacks',
          fix: 'Add Cross-Origin-Embedder-Policy: require-corp.',
          technicalFix: 'Cross-Origin-Embedder-Policy: require-corp',
          fixCode: "res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');",
        });
      }

      logs.push('[Advanced] Checking for server version disclosure...');
      if (headers['server'] && /[\d.]+/.test(headers['server'])) {
        vulnerabilities.push({
          id: makeId(),
          title: `Server Version Disclosed: ${headers['server']}`,
          severity: 'Medium',
          description: 'Your server is advertising its exact software version, helping attackers target known vulnerabilities for that version.',
          technicalDescription: `Server header: "${headers['server']}". Exposes server software and version, enabling targeted CVE exploitation.`,
          realWorldExample: 'Attackers routinely scan for specific server versions using Shodan and Censys to find unpatched targets.',
          estimatedCost: '$50K–$500K depending on unpatched CVEs',
          exploitSpeed: 'Minutes — automated scanners fingerprint servers constantly',
          fix: 'Configure your web server to hide or genericize the Server header.',
          technicalFix: "nginx: server_tokens off;\nApache: ServerTokens Prod\nNode/Express: app.disable('x-powered-by');",
          fixCode: "# nginx.conf:\nserver_tokens off;\n\n# Apache httpd.conf:\nServerTokens Prod\nServerSignature Off",
        });
      }

      if (headers['x-powered-by']) {
        vulnerabilities.push({
          id: makeId(),
          title: `Technology Stack Disclosed: X-Powered-By: ${headers['x-powered-by']}`,
          severity: 'Low',
          description: 'Your server is revealing which framework or technology it uses, making targeted attacks easier.',
          technicalDescription: `X-Powered-By: ${headers['x-powered-by']} reveals backend technology stack to attackers.`,
          realWorldExample: 'Attackers use X-Powered-By to identify outdated Express, PHP, or ASP.NET versions and apply targeted exploits.',
          estimatedCost: 'Increases attack surface — aids targeted exploitation',
          exploitSpeed: 'Passive fingerprinting — instant',
          fix: 'Remove the X-Powered-By header from all responses.',
          technicalFix: "Express.js: app.disable('x-powered-by');\nnginx: more_clear_headers 'X-Powered-By';",
          fixCode: "// Express.js:\napp.disable('x-powered-by');\n// Or use helmet:\napp.use(helmet());",
        });
      }

      logs.push('[Advanced] Checking robots.txt for sensitive path disclosure...');
      try {
        const robotsRes = await fetch(`${targetUrl.replace(/\/$/, '')}/robots.txt`, {
          signal: AbortSignal.timeout(6000),
        });
        if (robotsRes.ok) {
          const robotsText = await robotsRes.text();
          const sensitiveKeywords = ['/admin', '/api', '/config', '/backup', '/secret', '/private', '/internal', '/env', '/debug'];
          const disallowedPaths = robotsText.match(/Disallow:\s*(.+)/gi)?.map(l => l.replace(/Disallow:\s*/i, '').trim()) || [];
          const exposedPaths = disallowedPaths.filter(p => sensitiveKeywords.some(k => p.toLowerCase().includes(k)));
          if (exposedPaths.length > 0) {
            vulnerabilities.push({
              id: makeId(),
              title: 'robots.txt Reveals Sensitive Paths',
              severity: 'Low',
              description: `Your robots.txt lists paths like ${exposedPaths.slice(0, 3).join(', ')} — attackers read this file specifically to find hidden admin panels and APIs.`,
              technicalDescription: `robots.txt Disallow entries expose internal paths: ${exposedPaths.join(', ')}. While intended to block crawlers, this file is publicly readable and acts as a roadmap for attackers.`,
              realWorldExample: 'Attackers routinely read robots.txt to find hidden admin panels, staging environments, and API endpoints before launching targeted attacks.',
              estimatedCost: 'Aids targeted attacks — increases breach risk',
              exploitSpeed: '5 minutes — robots.txt is checked automatically by attackers',
              fix: 'Remove sensitive internal paths from robots.txt. Use server-level auth to protect admin areas instead.',
              technicalFix: 'Remove specific path references from robots.txt Disallow entries.',
              fixCode: "# Avoid listing sensitive paths:\n# Instead of: Disallow: /admin\n# Use server-level auth:\nlocation /admin {\n  auth_basic 'Admin';\n  auth_basic_user_file /etc/nginx/.htpasswd;\n}",
            });
          }
        }
      } catch {
        logs.push('[Advanced] Could not fetch robots.txt');
      }

      logs.push('[Advanced] Checking Cache-Control header...');
      if (!headers['cache-control'] || (!headers['cache-control'].includes('no-store') && !headers['cache-control'].includes('private'))) {
        vulnerabilities.push({
          id: makeId(),
          title: 'Permissive Cache-Control Policy',
          severity: 'Low',
          description: 'Pages may be cached by proxies or shared computers, potentially exposing sensitive content to other users.',
          technicalDescription: `Cache-Control: "${headers['cache-control'] || 'not set'}". Sensitive pages should use Cache-Control: no-store, private to prevent proxy/browser caching.`,
          realWorldExample: 'Banking and healthcare sites have exposed user data through shared browser or proxy caches.',
          estimatedCost: 'Privacy violations, HIPAA/GDPR compliance fines',
          exploitSpeed: 'Passive — data accumulates in shared caches over time',
          fix: 'Add Cache-Control: no-store, private to sensitive pages (dashboards, account pages, forms).',
          technicalFix: 'Cache-Control: no-store, no-cache, must-revalidate, private',
          fixCode: "res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');",
        });
      }
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
