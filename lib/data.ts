import fs from 'fs';
import path from 'path';

const dataDir = process.env.DATA_DIR ?? path.join(process.cwd(), 'data');

try {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
} catch { /* read-only filesystem — data will be in-memory only */ }

export function readJSON<T>(filename: string, defaultValue: T = [] as unknown as T): T {
  try {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) {
      try {
        fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
      } catch { /* can't write — return default */ }
      return defaultValue;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

export function writeJSON<T>(filename: string, data: T): void {
  try {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`[data] Failed to write ${filename}:`, err);
  }
}

export interface Member {
  id: string;
  name: string;
  role: string;
  memberType: 'advisor' | 'officer' | 'member';
  majors: string[];
  focusArea: string;
  status: string;
  avatarUrl: string;
  bio: string;
  skills: string[];
  projects: string[];
  github: string;
  linkedin: string;
  twitter: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  type: 'upcoming' | 'past';
  rsvpUrl?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  major: string;
  reason: string;
  submittedAt: string;
}

export interface SiteSettings {
  recruitingBanner: string;
  meetingDay: string;
  meetingTime: string;
  meetingLocation: string;
  lastUpdated?: string;
  discord?: string;
  github?: string;
  linkedin?: string;
}

export interface Stats {
  activeMembers: string;
  eventsHosted: string;
  projectsBuilt: string;
  yearsActive: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  gradient: string;
  github: string;
  contributors?: string[];
}

export interface RSVP {
  id: string;
  eventId: string;
  name: string;
  email: string;
  submittedAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  published: boolean;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  tier: string;
}

export interface SponsorsConfig {
  live: boolean;
  sectionTitle: string;
  sponsors: Sponsor[];
}

export interface AboutValue {
  title: string;
  desc: string;
}

export interface AboutActivity {
  title: string;
  desc: string;
}

export interface AboutContent {
  heroTagline: string;
  heroDescription: string;
  mission: string;
  valuesTitle: string;
  valuesSubtitle: string;
  values: AboutValue[];
  techStackTitle: string;
  techStackSubtitle: string;
  techStack: string[];
  activitiesTitle: string;
  activitiesSubtitle: string;
  activities: AboutActivity[];
  ctaTitle: string;
  ctaDescription: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
}

export interface PartnerInquiry {
  id: string;
  inquiryType: 'project' | 'internship' | 'speaker';
  companyName: string;
  contactName: string;
  email: string;
  description: string;
  submittedAt: string;
  // Project fields
  projectType?: string;
  timeline?: string;
  // Internship fields
  positionTitle?: string;
  duration?: string;
  compensation?: string;
  requiredSkills?: string;
  // Speaker fields
  topic?: string;
  availability?: string;
}
