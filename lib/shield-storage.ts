import { UserData, ScanResult, BadgeId, Badge } from './shield-types';

const STORAGE_KEY = 'lc3shield_user_data';
const TOKEN_KEY = 'lc3shield_token';
export const DAILY_SCAN_LIMIT = 10;

// --- Session token (localStorage) ---
export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setSessionToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearSessionToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

// Sync latest data from server into localStorage cache; returns updated data
export async function syncFromServer(): Promise<UserData | null> {
  const token = getSessionToken();
  if (!token) return null;
  try {
    const res = await fetch('/api/shield/session', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json() as UserData;
    saveUserData(data);
    return data;
  } catch { return null; }
}

// Push current userData to server. Returns a promise so callers can await it when needed.
export function pushToServer(data: UserData): Promise<void> {
  const token = getSessionToken();
  if (!token) return Promise.resolve();
  return fetch('/api/shield/session', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  }).then(() => {}).catch(() => { /* best effort */ });
}

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
  // Keep the token so re-login restores server history
}

export function addScanResult(result: ScanResult): UserData {
  // Use loadRawUserData so the save works regardless of the loggedIn flag state
  const data = loadRawUserData();
  if (!data) throw new Error('No user data');
  data.scanHistory = [result, ...data.scanHistory]; // no local cap — server stores all
  data.totalScans += 1;
  data.totalIssuesFound += result.vulnerabilities.length;
  result.badgesEarned.forEach(b => {
    if (!data.badges.includes(b)) data.badges.push(b);
  });
  saveUserData(data);
  pushToServer(data); // persist to server
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
  pushToServer(data);
}

export function getRemainingScans(): number {
  const data = loadUserData();
  if (!data) return 0;
  if (data.isAdmin) return DAILY_SCAN_LIMIT; // always show full for admin
  const today = new Date().toISOString().split('T')[0];
  if (data.lastScanDate !== today) return DAILY_SCAN_LIMIT;
  return Math.max(0, DAILY_SCAN_LIMIT - (data.scansToday ?? 0));
}

// Returns true if scan is allowed and increments the counter, false if limit hit
export function consumeScan(): boolean {
  const data = loadUserData();
  if (!data) return false;
  if (data.isAdmin) return true; // no limit for admin
  const today = new Date().toISOString().split('T')[0];
  if (data.lastScanDate !== today) {
    data.scansToday = 0;
    data.lastScanDate = today;
  }
  if ((data.scansToday ?? 0) >= DAILY_SCAN_LIMIT) return false;
  data.scansToday = (data.scansToday ?? 0) + 1;
  saveUserData(data);
  pushToServer(data);
  return true;
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
