import { NextRequest, NextResponse } from 'next/server';
import { askClaude } from '@/lib/shield-claude';
import { ScanResult, BadgeId } from '@/lib/shield-types';
import { calculateGrade } from '@/lib/shield-storage';

function makeId() { return crypto.randomUUID(); }

function extractRepoInfo(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

export async function POST(req: NextRequest) {
  const { repoUrl, mode } = await req.json();
  if (!repoUrl) return NextResponse.json({ error: 'Repo URL required' }, { status: 400 });
  if (typeof repoUrl !== 'string' || repoUrl.length > 500) return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });

  const info = extractRepoInfo(repoUrl);
  if (!info) return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 });

  const { owner, repo } = info;
  const logs: string[] = [];
  const vulnerabilities: any[] = [];

  const githubHeaders: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'LC3-Shield-Scanner',
  };
  if (process.env.GITHUB_TOKEN) {
    githubHeaders['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  // Get repo info
  logs.push(`Fetching repository: ${owner}/${repo}`);
  let repoData: any;
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: githubHeaders });
    if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
    repoData = await res.json();
    logs.push(`Found repo: ${repoData.full_name} (${repoData.visibility})`);
  } catch (e: any) {
    return NextResponse.json({ error: `Cannot access repo: ${e.message}` }, { status: 400 });
  }

  // Check if public
  if (!repoData.private) {
    logs.push('WARNING: Repository is public');
  }

  // Get file tree
  logs.push('Fetching file tree...');
  let files: any[] = [];
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${repoData.default_branch}?recursive=1`,
      { headers: githubHeaders }
    );
    const data = await res.json();
    files = (data.tree || []).filter((f: any) => f.type === 'blob');
    logs.push(`Found ${files.length} files`);
  } catch {
    logs.push('Could not fetch file tree');
  }

  // Check for sensitive files
  const sensitiveFiles = ['.env', '.env.local', '.env.production', 'config.json', 'secrets.json', 'credentials.json', '.aws/credentials', 'id_rsa', 'id_dsa'];
  logs.push('Checking for sensitive files...');
  for (const sf of sensitiveFiles) {
    const found = files.find((f: any) => f.path === sf || f.path.endsWith('/' + sf));
    if (found) {
      vulnerabilities.push({
        id: makeId(),
        title: `Sensitive File Exposed: ${found.path}`,
        severity: 'Critical',
        description: `The file "${found.path}" is committed to your public repository. This likely contains secrets that attackers can steal.`,
        technicalDescription: `File ${found.path} found in repository tree. This file typically contains environment variables, credentials, or configuration secrets.`,
        fix: `Remove ${found.path} from git tracking, rotate all secrets inside it, and add it to .gitignore immediately.`,
        technicalFix: `git rm --cached ${found.path}\ngit commit -m "Remove sensitive file"\n# Rotate all credentials in the file\necho "${found.path}" >> .gitignore`,
        fixCode: `# Remove from tracking (does NOT delete the file locally)\ngit rm --cached ${found.path}\n\n# Add to .gitignore\necho "${found.path}" >> .gitignore\ngit add .gitignore\ngit commit -m "Remove sensitive file and add to gitignore"\n\n# CRITICAL: Rotate all secrets/keys found in the file!`,
      });
    }
  }

  // Check for .gitignore
  logs.push('Checking for .gitignore...');
  const hasGitignore = files.some((f: any) => f.path === '.gitignore');
  if (!hasGitignore) {
    vulnerabilities.push({
      id: makeId(),
      title: 'Missing .gitignore File',
      severity: 'High',
      description: 'Without a .gitignore file, you might accidentally commit sensitive files like .env, node_modules, or secret keys.',
      technicalDescription: 'No .gitignore present in repository root. Sensitive files and build artifacts may be accidentally committed.',
      fix: 'Create a .gitignore file and add common sensitive patterns.',
      technicalFix: 'Run: npx gitignore node (or python, etc.)\nOr copy from gitignore.io',
      fixCode: '# .gitignore\n.env\n.env.local\n.env.*.local\nnode_modules/\n*.key\n*.pem\nsecrets/\nconfig/local.json',
    });
  }

  // Fetch and analyze key files with Claude
  const filesToAnalyze = files
    .filter((f: any) => {
      const path = f.path.toLowerCase();
      return (
        path === 'package.json' ||
        path.endsWith('.env.example') ||
        path === 'readme.md' ||
        path.endsWith('.js') ||
        path.endsWith('.ts') ||
        path.endsWith('.py') ||
        path.endsWith('.php')
      );
    })
    .slice(0, 8);

  logs.push(`Analyzing ${filesToAnalyze.length} key files with AI...`);

  const fileContents: string[] = [];
  for (const file of filesToAnalyze) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
        { headers: githubHeaders }
      );
      const data = await res.json();
      if (data.content) {
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        fileContents.push(`=== ${file.path} ===\n${content.slice(0, 2000)}`);
      }
    } catch {
      // Skip files we can't read
    }
  }

  if (fileContents.length > 0) {
    logs.push('Running AI analysis on file contents...');
    const systemPrompt = `You are a security code reviewer for LC3 Shield. Analyze repository files for security issues. Return ONLY valid JSON:
{
  "vulnerabilities": [
    {
      "id": "unique_string",
      "title": "Issue title",
      "severity": "Critical|High|Medium|Low",
      "description": "Plain English explanation",
      "technicalDescription": "Technical details",
      "realWorldExample": "Real breach example",
      "estimatedCost": "Financial impact",
      "exploitSpeed": "Time to exploit",
      "fix": "Simple fix",
      "technicalFix": "Technical fix",
      "fixCode": "Code to fix it"
    }
  ],
  "isClean": true/false,
  "summary": "Overall assessment"
}
Look for: API keys, passwords, tokens, SQL injection, insecure configs, vulnerable dependencies in package.json, exposed emails, private keys.`;

    try {
      const raw = await askClaude(
        `Analyze these repository files for security issues:\n\n${fileContents.join('\n\n')}`,
        systemPrompt
      );
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch?.[0] || raw);
      if (parsed.vulnerabilities) {
        parsed.vulnerabilities.forEach((v: any) => {
          vulnerabilities.push({ ...v, id: v.id || makeId() });
        });
      }
      logs.push(parsed.isClean ? 'AI: No critical issues found in analyzed files' : 'AI: Issues detected in file analysis');
    } catch {
      logs.push('AI analysis encountered an issue');
    }
  }

  // Advanced mode: branch protection, SECURITY.md, commit history
  if (mode === 'advanced') {
    logs.push('[Advanced] Checking branch protection rules...');
    try {
      const branchRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/branches/${repoData.default_branch}/protection`,
        { headers: githubHeaders }
      );
      if (branchRes.status === 404) {
        vulnerabilities.push({
          id: makeId(),
          title: 'No Branch Protection on Default Branch',
          severity: 'High',
          description: `Anyone with write access can push directly to "${repoData.default_branch}" without review. This allows accidental or malicious code to go straight to production.`,
          technicalDescription: `Branch protection rules not configured on ${repoData.default_branch}. No required reviews, status checks, or restrictions on force pushes.`,
          realWorldExample: 'The 2020 SolarWinds attack involved unauthorized code committed directly to the main branch without review.',
          estimatedCost: '$3.86M average cost of a breach enabled by unreviewed code',
          exploitSpeed: 'Immediate — any contributor can push malicious code',
          fix: 'Enable branch protection: require pull request reviews before merging, and enable required status checks.',
          technicalFix: 'Go to Settings → Branches → Add rule for your default branch. Enable "Require a pull request before merging" and "Require status checks."',
          fixCode: '# Via GitHub API:\nPATCH /repos/{owner}/{repo}/branches/{branch}/protection\n{\n  "required_pull_request_reviews": { "required_approving_review_count": 1 },\n  "enforce_admins": true\n}',
        });
      } else if (branchRes.ok) {
        logs.push('[Advanced] Branch protection is configured — good!');
      }
    } catch {
      logs.push('[Advanced] Could not check branch protection (may need authentication)');
    }

    logs.push('[Advanced] Checking for SECURITY.md...');
    const hasSecurityMd = files.some((f: any) =>
      f.path === 'SECURITY.md' || f.path === '.github/SECURITY.md'
    );
    if (!hasSecurityMd) {
      vulnerabilities.push({
        id: makeId(),
        title: 'Missing SECURITY.md (No Vulnerability Disclosure Policy)',
        severity: 'Low',
        description: 'Without a security policy, researchers who find vulnerabilities in your project have no way to responsibly report them to you.',
        technicalDescription: 'No SECURITY.md or .github/SECURITY.md found. GitHub displays this file to guide security researchers on responsible disclosure.',
        realWorldExample: 'Many vulnerabilities go unpatched because researchers have no clear reporting channel and resort to public disclosure instead.',
        estimatedCost: 'Reputational damage from uncoordinated public vulnerability disclosure',
        exploitSpeed: 'Indirect — attackers may find and exploit before you are notified',
        fix: 'Create a SECURITY.md file explaining how to report security vulnerabilities privately.',
        technicalFix: 'Create SECURITY.md or .github/SECURITY.md with your disclosure contact and process.',
        fixCode: '# SECURITY.md\n## Reporting a Vulnerability\n\nPlease report security vulnerabilities to security@yourdomain.com.\nDo NOT create public GitHub issues for security vulnerabilities.\n\nWe will respond within 48 hours and provide a fix timeline.',
      });
    }

    logs.push('[Advanced] Scanning recent commit messages for secret patterns...');
    try {
      const commitsRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=30`,
        { headers: githubHeaders }
      );
      if (commitsRes.ok) {
        const commits = await commitsRes.json();
        const secretPatterns = [/password/i, /secret/i, /api.?key/i, /token/i, /credential/i, /private.?key/i];
        const suspiciousCommits = commits.filter((c: any) =>
          secretPatterns.some(p => p.test(c.commit?.message || ''))
        );
        if (suspiciousCommits.length > 0) {
          vulnerabilities.push({
            id: makeId(),
            title: `${suspiciousCommits.length} Commit(s) Reference Secrets or Credentials`,
            severity: 'Medium',
            description: `${suspiciousCommits.length} recent commit message(s) mention words like "password", "secret", or "api key". This may indicate secrets were committed and then removed — but they still exist in git history.`,
            technicalDescription: `Commits with suspicious messages: ${suspiciousCommits.slice(0, 3).map((c: any) => c.sha?.slice(0, 7) + ': ' + c.commit?.message?.slice(0, 60)).join('; ')}. Git history is permanent — even "deleted" secrets are recoverable.`,
            realWorldExample: 'In 2022, Samsung leaked internal source code including secret keys that appeared in git history even after removal.',
            estimatedCost: '$3.86M+ if live credentials were exposed in history',
            exploitSpeed: '5 minutes with git log and grep',
            fix: 'Use git-secrets or trufflehog to scan your full git history. If secrets were committed, rotate them immediately regardless of whether they were later removed.',
            technicalFix: 'Run: trufflehog git https://github.com/{owner}/{repo}\nOr: git log -p | grep -E "(password|secret|api_key|token)" to find affected commits',
            fixCode: '# Install trufflehog and scan:\nnpx trufflehog git https://github.com/' + owner + '/' + repo + '\n\n# Remove secrets from history (use BFG Repo-Cleaner):\nbfg --replace-text secrets.txt\ngit push --force',
          });
        } else {
          logs.push('[Advanced] No suspicious patterns in recent commit messages');
        }
      }
    } catch {
      logs.push('[Advanced] Could not fetch commit history');
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
  if (vulnerabilities.length === 0) badgesEarned.push('clean-repo');
  if (score >= 90) badgesEarned.push('a-grade-club');

  const result: ScanResult = {
    id: makeId(),
    type: 'github',
    target: `${owner}/${repo}`,
    timestamp: Date.now(),
    score,
    grade,
    vulnerabilities,
    summary: `Scanned ${files.length} files, found ${vulnerabilities.length} issues`,
    badgesEarned,
  };

  return NextResponse.json({ result, logs, repoInfo: { name: repoData.full_name, isPublic: !repoData.private, fileCount: files.length } });
}
