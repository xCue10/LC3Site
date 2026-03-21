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

const ADVANCED_PATHS = [
  { path: '/.env.backup', description: 'Environment backup file', risk: 'Exposes all environment credentials in a backup copy' },
  { path: '/.env.bak', description: 'Environment backup', risk: 'Exposes backed-up credentials' },
  { path: '/config.yaml', description: 'YAML configuration', risk: 'May contain database URLs, API keys, or service credentials' },
  { path: '/config.yml', description: 'YAML configuration', risk: 'May contain service configuration with embedded secrets' },
  { path: '/composer.lock', description: 'PHP dependency lock file', risk: 'Reveals exact PHP package versions — aids targeted vulnerability exploitation' },
  { path: '/Gemfile.lock', description: 'Ruby dependency lock file', risk: 'Reveals exact Ruby gem versions — aids targeted exploitation' },
  { path: '/yarn.lock', description: 'Node.js yarn lock file', risk: 'Reveals exact dependency versions with package hashes' },
  { path: '/package-lock.json', description: 'npm lock file', risk: 'Reveals exact dependency tree and versions' },
  { path: '/Dockerfile', description: 'Docker build file', risk: 'Reveals infrastructure details, base images, and build secrets' },
  { path: '/docker-compose.yml', description: 'Docker Compose config', risk: 'May contain database passwords, service credentials, and network topology' },
  { path: '/docker-compose.yaml', description: 'Docker Compose config', risk: 'May contain database passwords and service credentials' },
  { path: '/.npmrc', description: 'npm config', risk: 'May contain npm auth tokens for publishing packages' },
  { path: '/.aws/credentials', description: 'AWS credentials file', risk: 'Contains AWS access keys — full cloud account compromise' },
  { path: '/wp-config.php', description: 'WordPress config', risk: 'Contains database credentials and WordPress secret keys' },
  { path: '/wp-config.php.bak', description: 'WordPress config backup', risk: 'Backup of WordPress config with exposed database credentials' },
  { path: '/application.properties', description: 'Java Spring config', risk: 'May contain database URLs, passwords, and API keys' },
  { path: '/application.yml', description: 'Java Spring YAML config', risk: 'May contain database and service credentials' },
  { path: '/settings.py', description: 'Django settings', risk: 'May contain SECRET_KEY, database credentials, and API keys' },
  { path: '/.git/logs/HEAD', description: 'Git log', risk: 'Exposes commit history and developer email addresses' },
  { path: '/debug.log', description: 'Debug log file', risk: 'May contain stack traces, queries, user data, and credentials' },
  { path: '/error.log', description: 'Error log', risk: 'May contain stack traces revealing application structure and sensitive data' },
  { path: '/storage/logs/laravel.log', description: 'Laravel log', risk: 'May contain SQL queries, user data, and application errors' },
  { path: '/id_rsa', description: 'SSH private key', risk: 'Grants SSH access to any server this key is authorized on' },
  { path: '/id_dsa', description: 'SSH private key (DSA)', risk: 'Grants SSH access — DSA keys are also considered cryptographically weak' },
  { path: '/server.key', description: 'TLS private key', risk: 'Allows decryption of all past and future HTTPS traffic' },
  { path: '/private.key', description: 'Private key file', risk: 'Exposes cryptographic private key' },
  { path: '/dump.sql', description: 'Database dump', risk: 'Full database contents including user records and credentials' },
  { path: '/db.sql', description: 'Database dump', risk: 'Full database contents publicly accessible' },
  { path: '/.well-known/security.txt', description: 'Security contact', risk: 'If missing, researchers cannot report vulnerabilities to you (informational)' },
];

export async function POST(req: NextRequest) {
  const { url, mode } = await req.json();
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

  let baseUrl = url;
  if (!baseUrl.startsWith('http')) baseUrl = 'https://' + baseUrl;

  const vulnerabilities: any[] = [];
  const pathsToCheck = mode === 'advanced'
    ? [...SENSITIVE_PATHS, ...ADVANCED_PATHS]
    : SENSITIVE_PATHS;
  const logs: string[] = [
    mode === 'advanced'
      ? `[Advanced] Checking ${pathsToCheck.length} sensitive paths on ${baseUrl}...`
      : `Checking ${pathsToCheck.length} sensitive paths on ${baseUrl}...`
  ];
  const checkedPaths: Array<{ path: string; status: number; accessible: boolean; description: string }> = [];

  // Check paths in parallel batches
  const batchSize = 5;
  for (let i = 0; i < pathsToCheck.length; i += batchSize) {
    const batch = pathsToCheck.slice(i, i + batchSize);
    logs.push(`Checking batch: ${batch.map(p => p.path).join(', ')}`);

    const results = await Promise.all(
      batch.map(async (sensitiveFile: typeof SENSITIVE_PATHS[number]) => {
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

  // Advanced: also check for directory listing on common directories
  if (mode === 'advanced') {
    logs.push('[Advanced] Checking for directory listing on common paths...');
    const dirsToCheck = ['/uploads/', '/files/', '/backup/', '/logs/', '/static/', '/assets/'];
    for (const dir of dirsToCheck) {
      try {
        const res = await fetch(baseUrl.replace(/\/$/, '') + dir, {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
          redirect: 'manual',
        });
        if (res.ok) {
          const text = await res.text();
          // Directory listing typically contains "Index of" or "<a href" patterns with file links
          if (text.includes('Index of') || (text.includes('href="..') && text.match(/<a href="[^"]+\.(zip|sql|log|bak|env|key)"/i))) {
            vulnerabilities.push({
              id: makeId(),
              title: `Directory Listing Enabled: ${dir}`,
              severity: 'High',
              description: `The directory "${dir}" is publicly browsable. Anyone can see and download all files in it, including backups, logs, or sensitive uploads.`,
              technicalDescription: `HTTP server returned directory index for ${baseUrl}${dir}. Directory listing exposes the full file tree, enabling attackers to enumerate and download files directly.`,
              realWorldExample: 'Directory listings have exposed private photos, database dumps, and source code at thousands of sites, often discovered by Google crawling.',
              estimatedCost: '$500K–$3.86M depending on files exposed',
              exploitSpeed: 'Immediate — Google and scanners index open directories',
              fix: `Disable directory listing on your web server for all directories.`,
              technicalFix: 'nginx: remove "autoindex on;" from config\nApache: add "Options -Indexes" to .htaccess',
              fixCode: '# nginx - disable directory listing:\nlocation / {\n  autoindex off;\n}\n\n# Apache .htaccess:\nOptions -Indexes',
            });
          }
        }
      } catch {
        // Directory not accessible — fine
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
      ? `All ${pathsToCheck.length} sensitive paths are protected — great security hygiene!`
      : `Found ${vulnerabilities.length} exposed sensitive files — immediate action required!`,
    badgesEarned,
  };

  return NextResponse.json({ result, logs, checkedPaths });
}
