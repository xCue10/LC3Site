import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, AboutContent } from '@/lib/data';

const defaults: AboutContent = {
  heroTagline: 'Who we are',
  heroDescription: 'LC3 — the Lowcode Cloud Club — is a university student organization at the intersection of low-code platforms, cloud computing, and real-world software development. We build things that matter, together.',
  mission: 'To empower students to build real-world software using modern tools — fostering technical skills, professional growth, and a collaborative community.',
  valuesTitle: 'What we stand for',
  valuesSubtitle: 'The principles that guide everything we do.',
  values: [
    { title: 'Learn by Building', desc: 'We believe the best way to learn is to create. Every semester, members work on real projects that solve actual problems.' },
    { title: 'Open to Everyone', desc: 'No prior experience required. We welcome students from all majors and skill levels — curiosity is the only prerequisite.' },
    { title: 'Industry Connected', desc: 'We bridge the gap between classroom learning and real-world tech through partnerships, guest speakers, and internship pipelines.' },
    { title: 'Community First', desc: 'LC3 is more than a club — it\'s a community. We celebrate wins together, support each other through challenges, and grow as a team.' },
  ],
  techStackTitle: 'What we work with',
  techStackSubtitle: 'Our toolkit spans low-code platforms, cloud services, and modern development frameworks.',
  techStack: ['Power Apps', 'Power Automate', 'Azure', 'Copilot Studio', 'GitHub', 'React', 'Python', 'Node.js'],
  activitiesTitle: 'What we do',
  activitiesSubtitle: 'A look at the activities and programs that make up the LC3 experience.',
  activities: [
    { title: 'Weekly Meetings', desc: 'Regular meetups with workshops, demos, and project standups to keep everyone connected and on track.' },
    { title: 'Project Teams', desc: 'Collaborative teams tackle semester-long projects spanning apps, automations, and cloud infrastructure.' },
    { title: 'Workshops', desc: 'Hands-on sessions covering Power Platform, Azure, web dev, APIs, and more — led by members and guest instructors.' },
    { title: 'Hackathons', desc: 'We compete in and host hackathons, giving members a chance to sprint on ideas and showcase skills under pressure.' },
    { title: 'Speaker Series', desc: 'Industry professionals and alumni share real-world experience, career advice, and emerging trends.' },
    { title: 'Partnerships', desc: 'Companies hire LC3 teams for contract projects, and we connect members with internship and job opportunities.' },
  ],
  ctaTitle: 'Ready to join?',
  ctaDescription: "Whether you want to build, learn, or lead — there's a place for you in LC3.",
};

export async function GET() {
  const about = readJSON<AboutContent>('about.json', defaults);
  return NextResponse.json(about);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const current = readJSON<AboutContent>('about.json', defaults);
  const about: AboutContent = {
    heroTagline: body.heroTagline ?? current.heroTagline,
    heroDescription: body.heroDescription ?? current.heroDescription,
    mission: body.mission ?? current.mission,
    valuesTitle: body.valuesTitle ?? current.valuesTitle,
    valuesSubtitle: body.valuesSubtitle ?? current.valuesSubtitle,
    values: Array.isArray(body.values) ? body.values : current.values,
    techStackTitle: body.techStackTitle ?? current.techStackTitle,
    techStackSubtitle: body.techStackSubtitle ?? current.techStackSubtitle,
    techStack: Array.isArray(body.techStack) ? body.techStack : current.techStack,
    activitiesTitle: body.activitiesTitle ?? current.activitiesTitle,
    activitiesSubtitle: body.activitiesSubtitle ?? current.activitiesSubtitle,
    activities: Array.isArray(body.activities) ? body.activities : current.activities,
    ctaTitle: body.ctaTitle ?? current.ctaTitle,
    ctaDescription: body.ctaDescription ?? current.ctaDescription,
  };
  writeJSON('about.json', about);
  return NextResponse.json(about);
}
