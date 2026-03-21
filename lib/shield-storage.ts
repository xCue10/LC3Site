import { UserData, ScanResult, BadgeId, Badge } from './shield-types';

const STORAGE_KEY = 'lc3shield_user_data';

export const BADGES: Badge[] = [
  { id: 'https-hero', name: 'HTTPS Hero', description: 'Scanned a site with HTTPS enabled', icon: '🔒', earned: false },
  { id: 'no-secrets', name: 'No Secrets Exposed', description: 'Code scan found no API keys or secrets', icon: '🤫', earned: false },
  { id: 'owasp-aware', name: 'OWASP Aware', description: 'Completed the full OWASP Top 10 checklist', icon: '📋', earned: false },
  { id: 'a-grade-club', name: 'A Grade Club', description: 'Achieved an A security score', icon: '🏆', earned: false },
  { id: 'dependency-guardian', name: 'Dependency Guardian', description: 'No vulnerable packages found', icon: '🛡️', earned: false },
  { id: 'cookie-monster', name: 'Cookie Monster', description: 'All cookies properly secured', icon: '🍪', earned: false },
  { id: 'dns-defender', name: 'DNS Defender', description: 'All DNS records properly configured', icon: '🌐', earned: false },
  { id: 'clean-repo', name: 'Clean Repo', description: 'GitHub repo passed full security scan', icon: '✨', earned: false },
  { id: 'quick-fixer', name: 'Quick Fixer', description: 'Fixed 5 issues in one session', icon: '⚡', earned: false },
  { id: 'security-streak', name: 'Security Streak', description: 'Scanned for 7 days in a row', icon: '🔥', earned: false },
];

export function getDefaultUserData(accessCode: string): UserData {
  return {
    accessCode,
    mode: 'beginner',
    scanHistory: [],
    badges: [],
    totalScans: 0,
    totalIssuesFound: 0,
    loginStreak: 1,
    lastLoginDate: new Date().toISOString().split('T')[0],
    loggedIn: true,
  };
}

export function loadUserData(): UserData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as UserData;
    if (data.loggedIn === false) return null;
    return data;
  } catch {
    return null;
  }
}

// Loads data regardless of loggedIn state — used on login to restore history
export function loadRawUserData(): UserData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserData;
  } catch {
    return null;
  }
}

export function saveUserData(data: UserData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearUserData(): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw) as UserData;
    data.loggedIn = false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function addScanResult(result: ScanResult): UserData {
  const data = loadUserData();
  if (!data) throw new Error('No user data');
  data.scanHistory = [result, ...data.scanHistory].slice(0, 100);
  data.totalScans += 1;
  data.totalIssuesFound += result.vulnerabilities.length;
  result.badgesEarned.forEach(b => {
    if (!data.badges.includes(b)) data.badges.push(b);
  });
  saveUserData(data);
  return data;
}

export function markIssueFixed(scanId: string, vulnId: string): void {
  const data = loadUserData();
  if (!data) return;
  const scan = data.scanHistory.find(s => s.id === scanId);
  if (scan) {
    const vuln = scan.vulnerabilities.find(v => v.id === vulnId);
    if (vuln) vuln.isFixed = true;
  }
  saveUserData(data);
}

export function getBadgeInfo(id: BadgeId): Badge {
  return BADGES.find(b => b.id === id) || BADGES[0];
}

export function calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 45) return 'D';
  return 'F';
}

export function gradeColor(grade: string): string {
  if (grade === 'A' || grade === 'B') return 'text-green-400';
  if (grade === 'C') return 'text-yellow-400';
  return 'text-red-400';
}

export function severityColor(severity: string): string {
  switch (severity) {
    case 'Critical': return 'text-red-400 bg-red-400/10 border-red-400/30';
    case 'High': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
    case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    case 'Low': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
  }
}
