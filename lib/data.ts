import fs from 'fs';
import path from 'path';
import { 
  FooterContent, 
  CustomField, 
  Member, 
  Event, 
  Contact, 
  SocialLink, 
  SiteSettings, 
  Stats, 
  ProjectStatus, 
  Project, 
  RSVP, 
  Post, 
  Sponsor, 
  SponsorsConfig, 
  AboutValue, 
  AboutActivity, 
  AboutContent, 
  HomeMissionItem, 
  HomeContent, 
  Resource, 
  PartnerInquiry, 
  CaseStudy, 
  CaseStudiesConfig 
} from './types';

export type { 
  FooterContent, 
  CustomField, 
  Member, 
  Event, 
  Contact, 
  SocialLink, 
  SiteSettings, 
  Stats, 
  ProjectStatus, 
  Project, 
  RSVP, 
  Post, 
  Sponsor, 
  SponsorsConfig, 
  AboutValue, 
  AboutActivity, 
  AboutContent, 
  HomeMissionItem, 
  HomeContent, 
  Resource, 
  PartnerInquiry, 
  CaseStudy, 
  CaseStudiesConfig 
};

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
