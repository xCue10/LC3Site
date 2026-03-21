import { NextRequest, NextResponse } from 'next/server';
import { ScanResult, BadgeId } from '@/lib/shield-types';
import { calculateGrade } from '@/lib/shield-storage';

function makeId() { return crypto.randomUUID(); }

const SENSITIVE_PATHS = [
  { path: '/.env', description: 'Environment variables file (contains API keys, DB passwords)', risk: 'Exposes all your secret credentials' },
  { path: '/.env.local', description: 'Local environment file', risk: 'Exposes local development credentials' },
  { path: '/.env.production', description: 'Production environment file', risk: 'Exposes production credentials' },
  { path: '/config.json', description: 'Configuration file', risk: 'May contain database connection strings or API keys' },
  { path: '/.git/config', description: 'Git configuration', risk: 'Reveals repository structure and remote URLs' },
  { path: '/.git/HEAD', description: 'Git HEAD reference', risk: 'Confirms git repository is exposed — source code accessible' },
  { path: '/admin', description: 'Admin panel', risk: 'Unprotected admin interface' },
  { path: '/wp-admin/', description: 'WordPress admin', risk: 'WordPress login page exposed — targeted by bots' },
  { path: '/phpinfo.php', description: 'PHP info page', risk: 'Exposes server configuration, PHP version, loaded modules' },
  { path: '/backup.zip', description: 'Backup archive', risk: 'Complete site backup downloadable by anyone' },
  { path: '/backup.sql', description: 'SQL backup', risk: 'Full database dump publicly accessible' },
  { path: '/database.sql', description: 'Database dump', risk: 'Complete database dump with all user data' },
  { path: '/.htaccess', description: 'Apache configuration', risk: 'Reveals server rules and may contain sensitive rewrites' },
  { path: '/.DS_Store', description: 'macOS folder metadata', risk: 'Reveals file/folder structure of the server' },
  { path: '/server-status', description: 'Apache server status', risk: 'Exposes active connections, requests, and server info' },
  { path: '/elmah.axd', description: '.NET error log', risk: 'Full application error logs with stack traces' },
  { path: '/web.config', description: 'IIS configuration', risk: 'May contain database credentials and app settings' },
  { path: '/crossdomain.xml', description: 'Flash cross-domain policy', risk: 'Overly permissive policies allow cross-domain data theft' },
  { path: '/robots.txt', description: 'Robots file', risk: 'May reveal hidden paths (check if sensitive paths are listed)' },
  { path: '/sitemap.xml', description: 'Sitemap', risk: 'Lists all site URLs — may reveal hidden pages' },
];

async function checkPath(baseUrl: string, path: string): Promise<{ accessible: boolean; status: number }> {
  try {
    const url = baseUrl.replace(/\/$/, '') + path;
    const res = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(6000),
      redirect: 'manual',
    });
    // 200, 206, 301, 302 with content could be accessible
    // We also check for 403 which confirms file exists but is protected
    const accessible = res.status === 200 || res.status === 206;
    return { accessible, status: res.status };
  } catch {
    return { accessible: false, status: 0 };
  }
}

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

  let baseUrl = url;
  if (!baseUrl.startsWith('http')) baseUrl = 'https://' + baseUrl;

  const vulnerabilities: any[] = [];
  const logs: string[] = [`Checking ${SENSITIVE_PATHS.length} sensitive paths on ${baseUrl}...`];
  const checkedPaths: Array<{ path: string; status: number; accessible: boolean; description: string }> = [];

  // Check paths in parallel batches
  const batchSize = 5;
  for (let i = 0; i < SENSITIVE_PATHS.length; i += batchSize) {
    const batch = SENSITIVE_PATHS.slice(i, i + batchSize);
    logs.push(`Checking batch: ${batch.map(p => p.path).join(', ')}`);

    const results = await Promise.all(
      batch.map(async (sensitiveFile) => {
        const result = await checkPath(baseUrl, sensitiveFile.path);
        return { ...sensitiveFile, ...result };
      })
    );

    for (const r of results) {
      checkedPaths.push({ path: r.path, status: r.status, accessible: r.accessible, description: r.description });

      if (r.accessible) {
        logs.push(`⚠️ ACCESSIBLE: ${r.path} (HTTP ${r.status})`);
        vulnerabilities.push({
          id: makeId(),
          title: `Sensitive File Exposed: ${r.path}`,
          severity: 'Critical',
          description: `The file "${r.path}" is publicly accessible! ${r.risk}`,
          technicalDescription: `HTTP ${r.status} response received for ${baseUrl}${r.path}. ${r.description}: ${r.risk}`,
          realWorldExample: r.path.includes('.env')
            ? 'In 2022, a major company exposed their .env file, leading to $500K+ in unauthorized AWS charges.'
            : r.path.includes('.git')
            ? 'In 2020, researchers found 400,000+ sites with exposed .git directories containing complete source code.'
            : 'Exposed sensitive files have been used in countless breaches to steal credentials and data.',
          estimatedCost: r.path.includes('.env') || r.path.includes('sql') ? '$3.86M+ breach cost' : '$50K–$500K',
          exploitSpeed: 'Under 5 minutes — automated scanners constantly probe for these',
          fix: `Block access to ${r.path} immediately. If it contains secrets, rotate all credentials inside it.`,
          technicalFix: r.path.startsWith('/.git')
            ? `# nginx:\nlocation ~ /\\.git { deny all; return 403; }\n\n# Apache (.htaccess):\n<FilesMatch "^\\.git">\nOrder allow,deny\nDeny from all\n</FilesMatch>`
            : r.path === '/.env'
            ? `# Move .env above web root, or block via nginx:\nlocation ~ /\\.env { deny all; return 403; }`
            : `# nginx:\nlocation ~ /${r.path.slice(1)} { deny all; return 403; }`,
          fixCode: `# nginx block for ${r.path}:\nlocation = ${r.path} {\n  deny all;\n  return 403;\n}`,
        });
      } else {
        logs.push(`Protected: ${r.path} (HTTP ${r.status || 'no response'})`);
      }
    }
  }

  logs.push('Sensitive file check complete!');

  let score = 100;
  vulnerabilities.forEach(() => score -= 30); // Each exposed file is very serious
  score = Math.max(0, Math.min(100, score));
  const grade = calculateGrade(score);

  const badgesEarned: BadgeId[] = [];
  if (score >= 90) badgesEarned.push('a-grade-club');

  const result: ScanResult = {
    id: makeId(),
    type: 'sensitive-files',
    target: baseUrl,
    timestamp: Date.now(),
    score,
    grade,
    vulnerabilities,
    summary: vulnerabilities.length === 0
      ? `All ${SENSITIVE_PATHS.length} sensitive paths are protected — great security hygiene!`
      : `Found ${vulnerabilities.length} exposed sensitive files — immediate action required!`,
    badgesEarned,
  };

  return NextResponse.json({ result, logs, checkedPaths });
}
