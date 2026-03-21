import { NextRequest, NextResponse } from 'next/server';
import * as tls from 'tls';
import { ScanResult, BadgeId } from '@/lib/shield-types';
import { calculateGrade } from '@/lib/shield-storage';

function makeId() { return crypto.randomUUID(); }

function checkCertificate(hostname: string): Promise<{
  valid: boolean;
  daysRemaining: number;
  expiryDate: Date;
  subject: string;
  issuer: string;
  protocol: string;
  cipher: { name: string; version: string };
  authorized: boolean;
  authError?: string;
}> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({
      host: hostname,
      port: 443,
      servername: hostname,
      rejectUnauthorized: false,
      timeout: 10000,
    }, () => {
      const cert = socket.getPeerCertificate(true);
      const authorized = socket.authorized;
      const authError = socket.authorizationError?.toString();
      const protocol = socket.getProtocol() || 'unknown';
      const cipher = socket.getCipher() || { name: 'unknown', version: 'unknown' };

      const expiryDate = new Date(cert.valid_to);
      const now = new Date();
      const daysRemaining = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      socket.destroy();
      resolve({
        valid: daysRemaining > 0,
        daysRemaining,
        expiryDate,
        subject: (Array.isArray(cert.subject?.CN) ? cert.subject.CN[0] : cert.subject?.CN) || hostname,
        issuer: (Array.isArray(cert.issuer?.O) ? cert.issuer.O[0] : cert.issuer?.O) || (Array.isArray(cert.issuer?.CN) ? cert.issuer.CN[0] : cert.issuer?.CN) || 'Unknown',
        protocol: protocol || 'unknown',
        cipher: { name: (cipher as any).name || 'unknown', version: (cipher as any).version || 'unknown' },
        authorized,
        authError,
      });
    });

    socket.on('error', reject);
    socket.setTimeout(10000, () => {
      socket.destroy();
      reject(new Error('Connection timed out'));
    });
  });
}

export async function POST(req: NextRequest) {
  const { domain } = await req.json();
  if (!domain) return NextResponse.json({ error: 'Domain required' }, { status: 400 });

  const hostname = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
  const vulnerabilities: any[] = [];
  const logs: string[] = [`Connecting to ${hostname}:443...`];

  let certInfo: Awaited<ReturnType<typeof checkCertificate>> | null = null;
  try {
    certInfo = await checkCertificate(hostname);
    logs.push(`Certificate valid until: ${certInfo.expiryDate.toLocaleDateString()}`);
    logs.push(`Issued by: ${certInfo.issuer}`);
    logs.push(`Protocol: ${certInfo.protocol}`);
    logs.push(`Cipher: ${certInfo.cipher.name}`);
  } catch (e: any) {
    logs.push(`Could not connect: ${e.message}`);
    vulnerabilities.push({
      id: makeId(),
      title: 'SSL/TLS Connection Failed',
      severity: 'Critical',
      description: 'Could not establish a secure SSL/TLS connection. Your site may not support HTTPS or the connection was refused.',
      technicalDescription: `TLS handshake failed: ${e.message}`,
      realWorldExample: 'Sites without working HTTPS are flagged by all modern browsers and lose user trust immediately.',
      estimatedCost: '100% loss of user trust, SEO penalties',
      exploitSpeed: 'Immediate — all traffic is unencrypted',
      fix: 'Install a valid SSL certificate. Use Let\'s Encrypt (free) or a commercial certificate authority.',
      technicalFix: 'Run: certbot --nginx -d yourdomain.com',
      fixCode: '# Install certbot and get free certificate:\nsudo apt install certbot python3-certbot-nginx\nsudo certbot --nginx -d yourdomain.com',
    });
  }

  if (certInfo) {
    // Check certificate validity
    if (!certInfo.authorized && certInfo.authError) {
      vulnerabilities.push({
        id: makeId(),
        title: 'SSL Certificate Not Trusted',
        severity: 'Critical',
        description: 'Your SSL certificate is not trusted by browsers. Visitors will see a scary security warning and most will leave immediately.',
        technicalDescription: `Certificate authorization failed: ${certInfo.authError}`,
        realWorldExample: 'Untrusted certificates trigger browser warnings that cause 60%+ of users to immediately abandon the site.',
        estimatedCost: '60%+ conversion loss, potential MITM vulnerability',
        exploitSpeed: 'Ongoing — all visitors see the error',
        fix: 'Get a certificate from a trusted Certificate Authority (CA) like Let\'s Encrypt.',
        technicalFix: 'sudo certbot --nginx -d yourdomain.com',
        fixCode: '# Get free trusted certificate:\nsudo certbot --nginx -d yourdomain.com -d www.yourdomain.com',
      });
    }

    // Check expiry
    if (!certInfo.valid || certInfo.daysRemaining < 0) {
      vulnerabilities.push({
        id: makeId(),
        title: 'SSL Certificate Expired',
        severity: 'Critical',
        description: 'Your SSL certificate has expired! All browsers will show a security warning, blocking visitors from accessing your site.',
        technicalDescription: `Certificate expired on ${certInfo.expiryDate.toISOString()}. ${Math.abs(certInfo.daysRemaining)} days ago.`,
        realWorldExample: 'Expired certificates have caused major outages at companies like LinkedIn and even the US government.',
        estimatedCost: 'Complete site inaccessibility, brand damage',
        exploitSpeed: 'Immediate — MITM attacks possible without valid cert',
        fix: 'Renew your SSL certificate immediately. If using Let\'s Encrypt, run: sudo certbot renew',
        technicalFix: 'sudo certbot renew --force-renewal',
        fixCode: '# Renew immediately:\nsudo certbot renew --force-renewal\n\n# Set up auto-renewal (add to crontab):\n0 12 * * * /usr/bin/certbot renew --quiet',
      });
    } else if (certInfo.daysRemaining <= 30) {
      vulnerabilities.push({
        id: makeId(),
        title: `SSL Certificate Expiring Soon (${certInfo.daysRemaining} days)`,
        severity: certInfo.daysRemaining <= 7 ? 'High' : 'Medium',
        description: `Your SSL certificate expires in ${certInfo.daysRemaining} days. Set up auto-renewal before it expires and breaks your site.`,
        technicalDescription: `Certificate expires ${certInfo.expiryDate.toISOString()}. ${certInfo.daysRemaining} days remaining.`,
        realWorldExample: 'Certificate expiry has caused outages at major companies including Spotify and Azure.',
        estimatedCost: 'Downtime cost: $5,600/minute for large sites',
        exploitSpeed: `In ${certInfo.daysRemaining} days — all traffic becomes vulnerable`,
        fix: 'Renew your certificate now and set up automatic renewal.',
        technicalFix: 'sudo certbot renew\n# Add to crontab for auto-renewal',
        fixCode: '# Auto-renewal crontab:\n0 12 * * * /usr/bin/certbot renew --quiet',
      });
    } else {
      logs.push(`Certificate valid for ${certInfo.daysRemaining} more days — good!`);
    }

    // Check TLS version
    const protocol = certInfo.protocol.toLowerCase();
    if (protocol.includes('tlsv1') && !protocol.includes('tlsv1.2') && !protocol.includes('tlsv1.3')) {
      vulnerabilities.push({
        id: makeId(),
        title: `Outdated TLS Version: ${certInfo.protocol}`,
        severity: 'High',
        description: 'Your server is using an old, insecure TLS version. Think of it like using an old lock that criminals know how to pick.',
        technicalDescription: `Server negotiated ${certInfo.protocol}. TLS 1.0 and 1.1 have known vulnerabilities (POODLE, BEAST, CRIME) and are deprecated by PCI DSS and major browsers.`,
        realWorldExample: 'POODLE attack in 2014 exploited TLS 1.0/1.1 to decrypt HTTPS cookies, affecting millions of sites.',
        estimatedCost: '$3.86M average breach cost if exploited',
        exploitSpeed: 'Minutes with known exploit tools',
        fix: 'Configure your server to only allow TLS 1.2 and TLS 1.3.',
        technicalFix: 'nginx: ssl_protocols TLSv1.2 TLSv1.3;\nApache: SSLProtocol -all +TLSv1.2 +TLSv1.3',
        fixCode: '# nginx.conf:\nssl_protocols TLSv1.2 TLSv1.3;\nssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;\nssl_prefer_server_ciphers off;',
      });
    }

    // Check for weak ciphers
    const weakCiphers = ['RC4', 'DES', '3DES', 'NULL', 'EXPORT', 'MD5', 'anon'];
    const isWeakCipher = weakCiphers.some(c => certInfo!.cipher.name.toUpperCase().includes(c));
    if (isWeakCipher) {
      vulnerabilities.push({
        id: makeId(),
        title: `Weak Cipher Suite: ${certInfo.cipher.name}`,
        severity: 'High',
        description: 'Your server uses an old, weak encryption method that can be cracked. Update your cipher configuration.',
        technicalDescription: `Server negotiated cipher ${certInfo.cipher.name} which is considered cryptographically weak.`,
        realWorldExample: 'SWEET32 attack exploited 3DES cipher to decrypt HTTPS traffic in 2016.',
        estimatedCost: '$3.86M+ if traffic is decrypted',
        exploitSpeed: '2–72 hours depending on attack',
        fix: 'Configure your server to use only modern, strong cipher suites.',
        technicalFix: 'Use Mozilla SSL Configuration Generator: ssl-config.mozilla.org',
        fixCode: '# nginx - Modern configuration:\nssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384;\nssl_protocols TLSv1.2 TLSv1.3;',
      });
    }

    // Check HSTS via headers
    logs.push('Checking HSTS header...');
    try {
      const res = await fetch(`https://${hostname}`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(8000),
        redirect: 'follow',
      });
      const hsts = res.headers.get('strict-transport-security');
      if (!hsts) {
        vulnerabilities.push({
          id: makeId(),
          title: 'Missing HSTS Header',
          severity: 'Medium',
          description: 'Without HSTS, attackers on public WiFi can trick browsers into loading your site over HTTP instead of HTTPS.',
          technicalDescription: 'No Strict-Transport-Security header. Enables SSL stripping attacks where HTTPS connections are downgraded to HTTP.',
          realWorldExample: 'SSL stripping on public WiFi networks can intercept credentials even from sites with valid certificates.',
          estimatedCost: '$5K–$50K per credential theft',
          exploitSpeed: '5 minutes on compromised network',
          fix: 'Add the Strict-Transport-Security header to all HTTPS responses.',
          technicalFix: 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
          fixCode: '# nginx:\nadd_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;',
        });
      } else {
        logs.push(`HSTS configured: ${hsts}`);
      }
    } catch {
      logs.push('Could not check HSTS header');
    }
  }

  logs.push('SSL/TLS analysis complete!');

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
  if (score >= 90) badgesEarned.push('a-grade-club');

  const result: ScanResult = {
    id: makeId(),
    type: 'ssl',
    target: hostname,
    timestamp: Date.now(),
    score,
    grade,
    vulnerabilities,
    summary: certInfo
      ? `Certificate valid for ${certInfo.daysRemaining} days, issued by ${certInfo.issuer}. Protocol: ${certInfo.protocol}`
      : `SSL connection analysis failed for ${hostname}`,
    badgesEarned,
  };

  return NextResponse.json({ result, logs, certInfo: certInfo ? {
    daysRemaining: certInfo.daysRemaining,
    expiryDate: certInfo.expiryDate,
    issuer: certInfo.issuer,
    protocol: certInfo.protocol,
    cipher: certInfo.cipher,
  } : null });
}
