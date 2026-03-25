export interface CareerSkill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CareerProfile {
  fullName: string;
  major: string;
  year: 'Freshman' | 'Sophomore' | 'Transfer';
  graduationDate: string;
  skills: CareerSkill[];
  jobTypes: string[];
  preferredLocation: string;
  salaryMin: number;
  salaryMax: number;
  industries: string[];
  dreamJob: string;
  resumeText?: string;
  onboardingComplete: boolean;
  achievements: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  url: string;
  jobType: string[];
  source: 'usajobs' | 'remotive' | 'arbeitnow';
  postedAt?: string;
  tags?: string[];
  matchScore?: number;
  matchReason?: string;
  skillGaps?: string[];
  matchBreakdown?: string;
}

export interface SavedJob {
  id: string;
  job: Job;
  savedAt: string;
  notes?: string;
}

export type ApplicationStatus =
  | 'Saved'
  | 'Applied'
  | 'Phone Screen'
  | 'Interview Scheduled'
  | 'Interview Done'
  | 'Offer'
  | 'Rejected';

export interface Application {
  id: string;
  company: string;
  jobTitle: string;
  dateApplied: string;
  status: ApplicationStatus;
  notes?: string;
  interviewDate?: string;
  jobUrl?: string;
}

export const PRESET_SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'React', 'Next.js',
  'Node.js', 'Power Apps', 'Power Automate', 'Azure', 'AWS',
  'Cybersecurity', 'Digital Forensics', 'SQL', 'Git',
  'Figma', 'Docker', 'Linux', 'Networking', 'Java', 'C++',
  'MongoDB', 'PostgreSQL', 'REST APIs', 'GraphQL', 'Kubernetes',
  'Terraform', 'Ansible', 'Splunk', 'Wireshark', 'PowerShell',
];

export const JOB_TYPES = ['Internship', 'Part-time', 'Full-time', 'Remote', 'Government/Federal'];

export const INDUSTRIES = [
  'Cybersecurity', 'Software Development', 'Cloud/DevOps', 'Data Science',
  'IT Support', 'Government/Federal', 'Finance/Fintech', 'Healthcare IT', 'Any',
];

export const CSN_MAJORS = [
  'Computer Information Technology', 'Cybersecurity', 'Network Administration',
  'Software Development', 'Computer Science', 'Information Systems',
  'Digital Forensics', 'Cloud Computing', 'Data Analytics', 'Other',
];

export const defaultProfile: CareerProfile = {
  fullName: '',
  major: '',
  year: 'Freshman',
  graduationDate: '',
  skills: [],
  jobTypes: [],
  preferredLocation: '',
  salaryMin: 40000,
  salaryMax: 80000,
  industries: [],
  dreamJob: '',
  resumeText: '',
  onboardingComplete: false,
  achievements: [],
};

export const LS_AUTH = 'lc3careers-auth';
export const LS_PROFILE = 'lc3careers-profile';
export const LS_SAVED = 'lc3careers-saved';
export const LS_APPS = 'lc3careers-applications';
export const LS_JOBS_CACHE = 'lc3careers-jobs-cache';

export function isCareerAuthed(): boolean {
  try {
    const val = localStorage.getItem(LS_AUTH);
    return val === 'true' || val === 'admin';
  } catch {
    return false;
  }
}
