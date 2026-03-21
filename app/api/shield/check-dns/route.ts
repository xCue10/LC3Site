import { NextRequest, NextResponse } from 'next/server';
import { promises as dns } from 'dns';
import { ScanResult, BadgeId } from '@/lib/shield-types';
import { calculateGrade } from '@/lib/shield-storage';

function makeId() { return crypto.randomUUID(); }

export async function POST(req: NextRequest) {
  const { domain, mode } = await req.json();
  if (!domain) return NextResponse.json({ error: 'Domain required' }, { status: 400 });

  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
  const vulnerabilities: any[] = [];
  const logs: string[] = [`Analyzing DNS records for ${cleanDomain}...`];

  // Check SPF
  logs.push('Checking SPF record...');
  let spfFound = false;
  try {
    const txtRecords = await dns.resolveTxt(cleanDomain);
    const spfRecord = txtRecords.flat().find(r => r.startsWith('v=spf1'));
    if (spfRecord) {
      spfFound = true;
      logs.push(`SPF found: ${spfRecord}`);
      // Check for common misconfigs
      if (spfRecord.includes('+all')) {
        vulnerabilities.push({
          id: makeId(),
          title: 'SPF Record Uses +all (Allows Anyone to Send)',
          severity: 'Critical',
          description: 'Your SPF record has "+all" which means ANY mail server in the world can send email as your domain. This makes spoofing trivial.',
          technicalDescription: 'SPF record contains "+all" mechanism. This passes SPF for all senders, effectively nullifying SPF protection.',
          realWorldExample: 'Phishing campaigns routinely exploit domains with permissive SPF to send convincing spoofed emails.',
          estimatedCost: 'Brand damage, phishing liability — $1.6M average BEC fraud cost',
          exploitSpeed: 'Immediate — any mail server can impersonate your domain',
          fix: 'Change "+all" to "~all" (soft fail) or "-all" (hard fail) in your SPF record.',
          technicalFix: `Change: v=spf1 ... +all\nTo: v=spf1 include:your-mail-provider.com -all`,
          fixCode: 'TXT @ "v=spf1 include:_spf.google.com -all"',
        });
      }
    } else {
      vulnerabilities.push({
        id: makeId(),
        title: 'Missing SPF Record',
        severity: 'High',
        description: 'SPF tells email servers which computers are allowed to send email from your domain. Without it, anyone can send fake emails pretending to be from your company.',
        technicalDescription: 'No SPF (Sender Policy Framework) TXT record found. Enables email spoofing and phishing attacks using your domain.',
        realWorldExample: 'Business Email Compromise (BEC) attacks cost $2.9 billion in 2023, often enabled by missing SPF records.',
        estimatedCost: '$1.6M average BEC fraud loss',
        exploitSpeed: '10 minutes to set up a spoofing attack',
        fix: 'Add a TXT record to your domain with your SPF policy listing your authorized mail servers.',
        technicalFix: `Add DNS TXT record:\n${cleanDomain} TXT "v=spf1 include:your-mail-provider.com -all"`,
        fixCode: `// Example for Google Workspace:\n${cleanDomain} TXT "v=spf1 include:_spf.google.com -all"\n\n// Example for Microsoft 365:\n${cleanDomain} TXT "v=spf1 include:spf.protection.outlook.com -all"`,
      });
    }
  } catch {
    logs.push('Could not resolve TXT records for SPF/DMARC');
    vulnerabilities.push({
      id: makeId(),
      title: 'Missing SPF Record',
      severity: 'High',
      description: 'Could not find an SPF record for this domain. This may allow email spoofing.',
      technicalDescription: 'DNS TXT record lookup failed or no SPF record present.',
      realWorldExample: 'Missing SPF records enable domain impersonation in phishing campaigns.',
      estimatedCost: '$1.6M average BEC fraud',
      exploitSpeed: '10 minutes',
      fix: 'Add an SPF TXT record to your DNS.',
      technicalFix: `${cleanDomain} TXT "v=spf1 include:_spf.google.com -all"`,
      fixCode: `${cleanDomain} TXT "v=spf1 include:_spf.google.com -all"`,
    });
  }

  // Check DMARC
  logs.push('Checking DMARC record...');
  try {
    const dmarcRecords = await dns.resolveTxt(`_dmarc.${cleanDomain}`);
    const dmarcRecord = dmarcRecords.flat().find(r => r.startsWith('v=DMARC1'));
    if (dmarcRecord) {
      logs.push(`DMARC found: ${dmarcRecord}`);
      if (dmarcRecord.includes('p=none')) {
        vulnerabilities.push({
          id: makeId(),
          title: 'DMARC Policy is "None" (Not Enforced)',
          severity: 'Medium',
          description: 'Your DMARC record exists but is set to monitoring-only mode (p=none). This means spoofed emails are still delivered.',
          technicalDescription: 'DMARC policy p=none only monitors, does not reject or quarantine unauthorized emails. Provides no active protection.',
          realWorldExample: 'Many organizations run p=none for months before enforcing, leaving them vulnerable to ongoing phishing.',
          estimatedCost: 'Ongoing phishing risk — $1.6M average BEC loss',
          exploitSpeed: 'Ongoing vulnerability',
          fix: 'After monitoring for a few weeks, upgrade to p=quarantine then p=reject.',
          technicalFix: `_dmarc.${cleanDomain} TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@${cleanDomain}"`,
          fixCode: `// Progression:\n// Phase 1 (monitoring): p=none\n// Phase 2 (quarantine): p=quarantine\n// Phase 3 (reject - fully protected): p=reject\n_dmarc.${cleanDomain} TXT "v=DMARC1; p=reject; rua=mailto:dmarc@${cleanDomain}"`,
        });
      } else {
        logs.push('DMARC policy is enforced — good!');
      }
    } else {
      throw new Error('No DMARC record');
    }
  } catch {
    vulnerabilities.push({
      id: makeId(),
      title: 'Missing DMARC Record',
      severity: 'High',
      description: 'DMARC tells email servers what to do with emails that fail SPF or DKIM checks. Without it, fake emails from your domain go straight to inboxes.',
      technicalDescription: 'No DMARC (Domain-based Message Authentication, Reporting & Conformance) record at _dmarc subdomain.',
      realWorldExample: 'Domains without DMARC are 5x more likely to be used in phishing campaigns.',
      estimatedCost: '$1.6M average BEC loss',
      exploitSpeed: '5 minutes to spoof emails',
      fix: 'Add a DMARC TXT record starting with monitoring mode (p=none) and gradually increase enforcement.',
      technicalFix: `Add DNS TXT record:\n_dmarc.${cleanDomain} TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@${cleanDomain}"`,
      fixCode: `_dmarc.${cleanDomain} TXT "v=DMARC1; p=reject; rua=mailto:dmarc@${cleanDomain}; ruf=mailto:dmarc@${cleanDomain}; pct=100"`,
    });
  }

  // Check DKIM (check common selectors)
  logs.push('Checking DKIM records...');
  const dkimSelectors = ['default', 'google', 'mail', 'email', 'k1', 'selector1', 'selector2'];
  let dkimFound = false;
  for (const selector of dkimSelectors) {
    try {
      const dkimRecords = await dns.resolveTxt(`${selector}._domainkey.${cleanDomain}`);
      if (dkimRecords.length > 0) {
        dkimFound = true;
        logs.push(`DKIM found with selector: ${selector}`);
        break;
      }
    } catch {
      // Try next selector
    }
  }

  if (!dkimFound) {
    vulnerabilities.push({
      id: makeId(),
      title: 'DKIM Not Detected',
      severity: 'Medium',
      description: 'DKIM adds a digital signature to your emails so receivers can verify they really came from you. We couldn\'t find a DKIM record (it may exist with a non-standard selector).',
      technicalDescription: `DKIM (DomainKeys Identified Mail) records not found for common selectors (${dkimSelectors.join(', ')}) under _domainkey.${cleanDomain}.`,
      realWorldExample: 'Without DKIM, even emails you legitimately send may be flagged as spam or rejected by modern mail servers.',
      estimatedCost: 'Deliverability issues + increased phishing risk',
      exploitSpeed: 'Passive — enables email spoofing',
      fix: 'Enable DKIM in your email provider (Google Workspace, Microsoft 365, etc.) and add the DNS TXT record they provide.',
      technicalFix: `Enable DKIM in your email provider dashboard and add the TXT record:\n{selector}._domainkey.${cleanDomain} TXT "v=DKIM1; k=rsa; p=<your-public-key>"`,
      fixCode: `// Example DKIM record structure:\nmail._domainkey.${cleanDomain} TXT "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4..."`,
    });
  }

  // Check DNSSEC (check for DS records)
  logs.push('Checking DNSSEC...');
  try {
    await dns.resolve(cleanDomain, 'DS' as any);
    logs.push('DNSSEC appears to be configured');
  } catch {
    vulnerabilities.push({
      id: makeId(),
      title: 'DNSSEC Not Enabled',
      severity: 'Low',
      description: 'DNSSEC prevents attackers from redirecting your domain traffic by signing your DNS records. It\'s like a seal of authenticity for DNS.',
      technicalDescription: 'No DS (Delegation Signer) records found. DNSSEC not enabled. Vulnerable to DNS cache poisoning and BGP hijacking attacks.',
      realWorldExample: 'In 2019, attackers used DNS hijacking to steal email and VPN credentials from major companies without DNSSEC.',
      estimatedCost: '$500K+ in traffic interception and credential theft',
      exploitSpeed: '2–24 hours for DNS poisoning attacks',
      fix: 'Enable DNSSEC through your domain registrar. Most major registrars (Cloudflare, GoDaddy, Namecheap) support this with one click.',
      technicalFix: 'Enable DNSSEC in your domain registrar dashboard. If using Cloudflare, go to DNS → DNSSEC tab.',
      fixCode: '# If using Cloudflare DNS:\n# 1. Log into Cloudflare dashboard\n# 2. Select domain\n# 3. Go to DNS tab\n# 4. Click "Enable DNSSEC"\n# 5. Add DS record to your registrar',
    });
  }

  // Advanced mode: CAA records, MX analysis, subdomain takeover
  if (mode === 'advanced') {
    logs.push('[Advanced] Checking CAA records...');
    try {
      const caaRecords = await dns.resolve(cleanDomain, 'CAA' as any);
      if (caaRecords && (caaRecords as any[]).length > 0) {
        logs.push('[Advanced] CAA records found — certificate issuance is restricted');
      } else {
        throw new Error('No CAA records');
      }
    } catch {
      vulnerabilities.push({
        id: makeId(),
        title: 'Missing CAA Records (Any CA Can Issue Certificates)',
        severity: 'Medium',
        description: 'Without CAA records, any certificate authority in the world can issue an SSL certificate for your domain — including ones that might be compromised or tricked.',
        technicalDescription: 'No CAA (Certification Authority Authorization) DNS records found. Any CA can issue certificates for this domain. CAA records restrict which CAs are authorized.',
        realWorldExample: 'In 2017, Symantec improperly issued thousands of certificates. Sites with CAA records were protected; those without were not.',
        estimatedCost: 'Fraudulent certificate issuance enabling MITM attacks — $3.86M+ breach cost',
        exploitSpeed: '1–7 days to obtain a fraudulent certificate via a compromised CA',
        fix: 'Add CAA DNS records specifying which certificate authorities are allowed to issue certificates for your domain.',
        technicalFix: `Add DNS CAA records:\n${cleanDomain} CAA 0 issue "letsencrypt.org"\n${cleanDomain} CAA 0 issue "digicert.com"\n${cleanDomain} CAA 0 issuewild ";"`,
        fixCode: `; Only allow Let's Encrypt:\n${cleanDomain} CAA 0 issue "letsencrypt.org"\n${cleanDomain} CAA 0 issuewild ";"\n${cleanDomain} CAA 0 iodef "mailto:security@${cleanDomain}"`,
      });
    }

    logs.push('[Advanced] Checking MX records...');
    try {
      const mxRecords = await dns.resolveMx(cleanDomain);
      if (mxRecords.length === 0) {
        vulnerabilities.push({
          id: makeId(),
          title: 'No MX Records — Domain Cannot Receive Email',
          severity: 'Low',
          description: 'Your domain has no mail server records. This can be a security risk if you use email-based password resets or verification, as someone could set up mail servers to intercept those.',
          technicalDescription: 'No MX records found. Absence of MX records means no mail server is configured, but it also means email sent to this domain may bounce unpredictably.',
          realWorldExample: 'Expired or missing MX records have allowed attackers to register abandoned mail infrastructure and receive password reset emails.',
          estimatedCost: 'Account takeover risk via password reset flows',
          exploitSpeed: 'Hours to days to set up receiving mail infrastructure',
          fix: 'Add MX records pointing to your mail provider, or explicitly configure a "null MX" record (RFC 7505) to reject all mail.',
          technicalFix: `# Null MX to explicitly reject mail:\n${cleanDomain} MX 0 .\n\n# Or point to your mail provider:\n${cleanDomain} MX 10 mail.your-provider.com`,
          fixCode: `; Null MX (explicitly rejects all email):\n${cleanDomain} IN MX 0 .`,
        });
      } else {
        logs.push(`[Advanced] ${mxRecords.length} MX record(s) found`);
      }
    } catch {
      logs.push('[Advanced] Could not resolve MX records');
    }

    logs.push('[Advanced] Checking for subdomain takeover risk on www...');
    try {
      const wwwCname = await dns.resolveCname(`www.${cleanDomain}`);
      if (wwwCname.length > 0) {
        const cnameTarget = wwwCname[0];
        // Check if the CNAME target itself resolves
        try {
          await dns.resolve(cnameTarget);
          logs.push(`[Advanced] www CNAME target ${cnameTarget} resolves — no takeover risk`);
        } catch {
          vulnerabilities.push({
            id: makeId(),
            title: `Potential Subdomain Takeover: www.${cleanDomain}`,
            severity: 'High',
            description: `Your www subdomain points to "${cnameTarget}" but that address no longer exists. An attacker could register it and take over your subdomain.`,
            technicalDescription: `www.${cleanDomain} CNAME → ${cnameTarget} (dangling CNAME — target does not resolve). Attacker can claim ${cnameTarget} on the target platform and serve content under your domain.`,
            realWorldExample: 'Hundreds of major company subdomains have been taken over via dangling CNAMEs pointing to decommissioned Heroku, GitHub Pages, or Azure services.',
            estimatedCost: '$100K–$1M+ in phishing attacks, credential theft, brand damage',
            exploitSpeed: 'Hours to days to claim the dangling target',
            fix: `Remove the CNAME record for www.${cleanDomain} or point it to an active, controlled address.`,
            technicalFix: `Delete or update the CNAME record:\nwww.${cleanDomain} CNAME → [your active server]`,
            fixCode: `; Remove dangling CNAME and point to your server:\nwww.${cleanDomain} A [your-server-ip]\n; Or delete the www record entirely if unused`,
          });
        }
      }
    } catch {
      // No CNAME for www — that's fine
      logs.push('[Advanced] www has no CNAME record');
    }
  }

  logs.push('DNS analysis complete!');

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
  if (vulnerabilities.length === 0) badgesEarned.push('dns-defender');
  if (score >= 90) badgesEarned.push('a-grade-club');

  const result: ScanResult = {
    id: makeId(),
    type: 'dns',
    target: cleanDomain,
    timestamp: Date.now(),
    score,
    grade,
    vulnerabilities,
    summary: `DNS security analysis for ${cleanDomain}: ${vulnerabilities.length} issues found`,
    badgesEarned,
  };

  return NextResponse.json({ result, logs });
}
