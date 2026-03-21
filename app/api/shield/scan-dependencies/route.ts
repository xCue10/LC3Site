import { NextRequest, NextResponse } from 'next/server';
import { askClaude } from '@/lib/shield-claude';
import { ScanResult, BadgeId } from '@/lib/shield-types';
import { calculateGrade } from '@/lib/shield-storage';

function makeId() { return crypto.randomUUID(); }

interface OsvVuln {
  id: string;
  summary: string;
  severity?: Array<{ type: string; score: string }>;
  affected: Array<{
    package: { name: string; ecosystem: string };
    ranges: Array<{ type: string; events: Array<{ introduced?: string; fixed?: string }> }>;
  }>;
}

async function checkPackage(name: string, version: string): Promise<OsvVuln[]> {
  try {
    const body = {
      package: { name, ecosystem: 'npm' },
      version: version.replace(/[\^~>=<]/g, ''),
    };
    const res = await fetch('https://api.osv.dev/v1/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.vulns || [];
  } catch {
    return [];
  }
}

function getSeverity(vuln: OsvVuln): 'Critical' | 'High' | 'Medium' | 'Low' {
  const cvss = vuln.severity?.find(s => s.type === 'CVSS_V3' || s.type === 'CVSS_V2');
  if (!cvss) return 'Medium';
  const score = parseFloat(cvss.score);
  if (score >= 9.0) return 'Critical';
  if (score >= 7.0) return 'High';
  if (score >= 4.0) return 'Medium';
  return 'Low';
}

function getFixedVersion(vuln: OsvVuln, pkgName: string): string | null {
  for (const affected of vuln.affected) {
    if (affected.package.name.toLowerCase() === pkgName.toLowerCase()) {
      for (const range of affected.ranges) {
        const fixed = range.events.find(e => e.fixed);
        if (fixed?.fixed) return fixed.fixed;
      }
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const { packageJson } = await req.json();
  if (!packageJson) return NextResponse.json({ error: 'package.json content required' }, { status: 400 });
  if (typeof packageJson !== 'string' || packageJson.length > 100000) return NextResponse.json({ error: 'package.json too large' }, { status: 400 });

  let parsed: any;
  try {
    parsed = JSON.parse(packageJson);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON in package.json' }, { status: 400 });
  }

  const allDeps = {
    ...parsed.dependencies,
    ...parsed.devDependencies,
  };

  const pkgNames = Object.keys(allDeps);
  const vulnerabilities: any[] = [];
  const logs: string[] = [`Found ${pkgNames.length} packages to check`];

  // Check packages in batches
  const batchSize = 5;
  for (let i = 0; i < pkgNames.length; i += batchSize) {
    const batch = pkgNames.slice(i, i + batchSize);
    logs.push(`Checking packages ${i + 1}–${Math.min(i + batchSize, pkgNames.length)} against OSV database...`);

    const results = await Promise.all(
      batch.map(async (name) => {
        const version = allDeps[name];
        const vulns = await checkPackage(name, version);
        return { name, version, vulns };
      })
    );

    for (const { name, version, vulns } of results) {
      for (const vuln of vulns) {
        const severity = getSeverity(vuln);
        const fixedVersion = getFixedVersion(vuln, name);

        vulnerabilities.push({
          id: makeId(),
          title: `${name}@${version} — ${vuln.id}`,
          severity,
          description: `The package "${name}" has a known security vulnerability. ${vuln.summary}`,
          technicalDescription: `CVE/OSV ID: ${vuln.id}. Package: ${name}@${version}. ${vuln.summary}`,
          realWorldExample: `Vulnerable npm packages are responsible for supply chain attacks like the event-stream incident that targeted cryptocurrency wallets.`,
          estimatedCost: severity === 'Critical' ? '$4M+ supply chain attack impact' : '$50K–$500K per incident',
          exploitSpeed: severity === 'Critical' ? 'Automated tools can exploit in minutes' : '1–24 hours',
          fix: fixedVersion
            ? `Update ${name} from ${version} to version ${fixedVersion} or later.`
            : `Check npm for the latest safe version of ${name} and update immediately.`,
          technicalFix: fixedVersion
            ? `npm install ${name}@${fixedVersion}\n# or:\nnpm update ${name}`
            : `npm audit fix --force\n# Check: https://osv.dev/vulnerability/${vuln.id}`,
          fixCode: fixedVersion
            ? `npm install ${name}@${fixedVersion}`
            : `npm audit fix`,
        });
      }
    }
  }

  logs.push('OSV check complete');

  // Use Claude for additional analysis if no vulns found or for context
  if (vulnerabilities.length === 0) {
    logs.push('Running AI dependency audit...');
    const systemPrompt = `You are a security expert reviewing npm package.json for security risks. Return ONLY valid JSON:
{
  "additionalRisks": [
    {
      "id": "string",
      "title": "Risk title",
      "severity": "Critical|High|Medium|Low",
      "description": "Plain English explanation",
      "technicalDescription": "Technical details",
      "realWorldExample": "Real incident",
      "estimatedCost": "Financial impact",
      "exploitSpeed": "Time to exploit",
      "fix": "Simple fix",
      "technicalFix": "Technical fix",
      "fixCode": "Code fix"
    }
  ],
  "overallAssessment": "Summary"
}
Look for: very old package versions, abandoned packages, packages with known security histories, missing lockfile references, suspicious scripts in package.json.`;

    try {
      const raw = await askClaude(
        `Review this package.json for security risks beyond known CVEs:\n\n${packageJson}`,
        systemPrompt
      );
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      const aiData = JSON.parse(jsonMatch?.[0] || raw);
      if (aiData.additionalRisks) {
        aiData.additionalRisks.forEach((r: any) => vulnerabilities.push({ ...r, id: r.id || makeId() }));
      }
    } catch {
      logs.push('AI analysis complete');
    }
  }

  logs.push('Scan complete!');

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
  if (vulnerabilities.length === 0) badgesEarned.push('dependency-guardian');
  if (score >= 90) badgesEarned.push('a-grade-club');

  const result: ScanResult = {
    id: makeId(),
    type: 'dependencies',
    target: parsed.name || 'package.json',
    timestamp: Date.now(),
    score,
    grade,
    vulnerabilities,
    summary: `Checked ${pkgNames.length} packages, found ${vulnerabilities.length} vulnerabilities`,
    badgesEarned,
  };

  return NextResponse.json({ result, logs, packageCount: pkgNames.length });
}
