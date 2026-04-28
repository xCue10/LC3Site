export interface FooterContent {
  tagline: string;
  ctaHeading: string;
  ctaSubtitle: string;
  ctaButtonLabel: string;
}

export interface CustomField {
  label: string;
  value: string;
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
  website?: string;
  graduationYear?: string;
  customFields?: CustomField[];
  displayOrder?: number;
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

export interface SocialLink {
  label: string;
  url: string;
}

export interface SiteSettings {
  recruitingBanner: string;
  meetingDay: string;
  meetingTime: string;
  meetingLocation: string;
  lastUpdated?: string;
  socialLinks?: SocialLink[];
  socialLinksLive?: boolean;
  showSpotlight?: boolean;
}

export interface Stats {
  activeMembers: string;
  eventsHosted: string;
  projectsBuilt: string;
  yearsActive: string;
}

export type ProjectStatus = 'in-progress' | 'completed' | 'open';

export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  gradient: string;
  github: string;
  contributors?: string[];
  status?: ProjectStatus;
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
  coverImage?: string;
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

export interface HomeMissionItem {
  title: string;
  desc: string;
}

export interface HomeShieldFeatureCard {
  icon: string;
  title: string;
  desc: string;
}

export interface HomeContent {
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  techStack: string[];
  companyCtaTitle: string;
  companyCtaDesc: string;
  missionItems: HomeMissionItem[];
  aboutEyebrow: string;
  aboutHeading: string;
  aboutBody1: string;
  aboutBody2: string;
  projectsEyebrow: string;
  projectsHeading: string;
  eventsEyebrow: string;
  eventsHeading: string;
  blogEyebrow: string;
  blogHeading: string;
  ctaHeading: string;
  ctaDescription: string;
  ctaButtonLabel: string;
  shieldBadgeLabel?: string;
  shieldHeadingPrefix?: string;
  shieldDescription?: string;
  shieldFeatureTags?: string[];
  shieldCtaLabel?: string;
  shieldButtonLabel?: string;
  shieldFeatureCards?: HomeShieldFeatureCard[];
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
  projectType?: string;
  timeline?: string;
  positionTitle?: string;
  duration?: string;
  compensation?: string;
  requiredSkills?: string;
  topic?: string;
  availability?: string;
}

export interface CaseStudy {
  id: string;
  client: string;
  title: string;
  description: string;
  outcome: string;
  tags: string[];
  link?: string;
}

export interface CaseStudiesConfig {
  live: boolean;
  sectionTitle: string;
  caseStudies: CaseStudy[];
}
