import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, HomeContent } from '@/lib/data';

const defaults: HomeContent = {
  primaryButtonLabel: 'Join the Club',
  secondaryButtonLabel: 'Meet the Team',
  techStack: ['Power Apps', 'Power Automate', 'Azure', 'GitHub', 'React', 'Python', 'Node.js', 'Copilot Studio'],
  companyCtaTitle: 'Are you a company?',
  companyCtaDesc: 'Partner with us for projects or offer internships to our members.',
  missionItems: [
    { title: 'Build Projects', desc: 'Work on real-world software that matters' },
    { title: 'Learn Skills', desc: 'Workshops, talks, and hands-on practice' },
    { title: 'Network', desc: 'Connect with peers and industry mentors' },
    { title: 'Compete', desc: 'Hackathons and CTF competitions' },
  ],
  aboutEyebrow: 'Who we are',
  aboutHeading: 'About LC3',
  aboutBody1: 'LC3 — Lowcode Cloud Club — is a student-run tech organization focused on low-code platforms, cloud technologies, and modern software development. We partner with tools like Microsoft Power Platform and Azure to give members hands-on experience that directly translates to industry skills.',
  aboutBody2: "Whether you're building your first app or already working in tech, LC3 is a place to grow. We believe the best way to learn is by shipping real things — together.",
  projectsEyebrow: "What we're building",
  projectsHeading: 'Featured Projects',
  eventsEyebrow: 'Mark your calendar',
  eventsHeading: 'Upcoming Events',
  blogEyebrow: "What's new",
  blogHeading: 'Latest Updates',
  ctaHeading: 'Ready to join?',
  ctaDescription: "Fill out our quick interest form and we'll get back to you with details about our next meeting.",
  ctaButtonLabel: 'Apply to Join LC3',
};

export async function GET() {
  const home = readJSON<HomeContent>('home.json', defaults);
  return NextResponse.json({ ...defaults, ...home });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const current = readJSON<HomeContent>('home.json', defaults);
  const home: HomeContent = {
    primaryButtonLabel: body.primaryButtonLabel ?? current.primaryButtonLabel,
    secondaryButtonLabel: body.secondaryButtonLabel ?? current.secondaryButtonLabel,
    techStack: Array.isArray(body.techStack) ? body.techStack : current.techStack,
    companyCtaTitle: body.companyCtaTitle ?? current.companyCtaTitle,
    companyCtaDesc: body.companyCtaDesc ?? current.companyCtaDesc,
    missionItems: Array.isArray(body.missionItems) ? body.missionItems : current.missionItems,
    aboutEyebrow: body.aboutEyebrow ?? current.aboutEyebrow,
    aboutHeading: body.aboutHeading ?? current.aboutHeading,
    aboutBody1: body.aboutBody1 ?? current.aboutBody1,
    aboutBody2: body.aboutBody2 ?? current.aboutBody2,
    projectsEyebrow: body.projectsEyebrow ?? current.projectsEyebrow,
    projectsHeading: body.projectsHeading ?? current.projectsHeading,
    eventsEyebrow: body.eventsEyebrow ?? current.eventsEyebrow,
    eventsHeading: body.eventsHeading ?? current.eventsHeading,
    blogEyebrow: body.blogEyebrow ?? current.blogEyebrow,
    blogHeading: body.blogHeading ?? current.blogHeading,
    ctaHeading: body.ctaHeading ?? current.ctaHeading,
    ctaDescription: body.ctaDescription ?? current.ctaDescription,
    ctaButtonLabel: body.ctaButtonLabel ?? current.ctaButtonLabel,
    shieldBadgeLabel: body.shieldBadgeLabel ?? current.shieldBadgeLabel,
    shieldHeadingPrefix: body.shieldHeadingPrefix ?? current.shieldHeadingPrefix,
    shieldDescription: body.shieldDescription ?? current.shieldDescription,
    shieldFeatureTags: Array.isArray(body.shieldFeatureTags) ? body.shieldFeatureTags : current.shieldFeatureTags,
    shieldCtaLabel: body.shieldCtaLabel ?? current.shieldCtaLabel,
    shieldButtonLabel: body.shieldButtonLabel ?? current.shieldButtonLabel,
    shieldFeatureCards: Array.isArray(body.shieldFeatureCards) ? body.shieldFeatureCards : current.shieldFeatureCards,
  };
  writeJSON('home.json', home);
  return NextResponse.json(home);
}
