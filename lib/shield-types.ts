export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

export interface Vulnerability {
  id: string;
  title: string;
  severity: SeverityLevel;
  description: string;
  technicalDescription: string;
  realWorldExample: string;
  estimatedCost: string;
  exploitSpeed: string;
  fix: string;
  technicalFix: string;
  fixCode?: string;
  tutorialUrl?: string;
  isFixed?: boolean;
}

export interface ScanResult {
  id: string;
  type: ScanType;
  target: string;
  timestamp: number;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  vulnerabilities: Vulnerability[];
  summary: string;
  badgesEarned: BadgeId[];
}

export type ScanType =
  | 'url'
  | 'code'
  | 'github'
  | 'dependencies'
  | 'jwt'
  | 'cookies'
  | 'dns'
  | 'ssl'
  | 'sensitive-files'
  | 'owasp';

export type BadgeId =
  | 'https-hero'
  | 'no-secrets'
  | 'owasp-aware'
  | 'a-grade-club'
  | 'dependency-guardian'
  | 'cookie-monster'
  | 'dns-defender'
  | 'clean-repo'
  | 'quick-fixer'
  | 'security-streak';

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: number;
}

export interface UserData {
  accessCode: string;
  mode: 'beginner' | 'advanced';
  scanHistory: ScanResult[];
  badges: BadgeId[];
  totalScans: number;
  totalIssuesFound: number;
  loginStreak: number;
  lastLoginDate: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
