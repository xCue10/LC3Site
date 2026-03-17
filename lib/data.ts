import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

export function readJSON<T>(filename: string): T {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
    return [] as unknown as T;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

export function writeJSON<T>(filename: string, data: T): void {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export interface Member {
  id: string;
  name: string;
  major: string;
  focusArea: string;
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
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  major: string;
  reason: string;
  submittedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  gradient: string;
}
