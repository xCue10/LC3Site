import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { CareerProfile, Job } from '@/app/careers/types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-sonnet-4-20250514';

export async function POST(req: NextRequest) {
  try {
    const { profile, job, tone } = await req.json() as {
      profile: CareerProfile;
      job: Job;
      tone: 'Professional' | 'Enthusiastic' | 'Concise';
    };

    if (!profile || !job) {
      return NextResponse.json({ error: 'Missing profile or job' }, { status: 400 });
    }

    const toneGuide = {
      Professional: 'Write in a formal, polished, business-appropriate tone. Use precise language and demonstrate professionalism.',
      Enthusiastic: 'Write with genuine excitement and passion about the role. Show enthusiasm for the company and position while remaining professional.',
      Concise: 'Write a brief, impactful cover letter. Be direct and get to the point quickly. Keep it under 200 words.',
    }[tone] ?? '';

    const prompt = `Write a personalized cover letter for a college student applying to a tech job.

STUDENT PROFILE:
Name: ${profile.fullName}
Major: ${profile.major} at the College of Southern Nevada (CSN)
Year: ${profile.year}, graduating ${profile.graduationDate}
Skills: ${profile.skills.map((s) => `${s.name} (${s.level})`).join(', ')}
Dream Job: ${profile.dreamJob}

JOB DETAILS:
Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
Job Type: ${job.jobType.join(', ')}
Description: ${job.description.slice(0, 800)}

TONE REQUIREMENT: ${toneGuide}

Write a complete cover letter with:
1. Professional header (Date, Company, Position)
2. Opening paragraph that grabs attention
3. Middle paragraphs highlighting relevant skills and experiences from the student's profile
4. Closing paragraph with a clear call to action
5. Professional sign-off

Make it specific to this job and personalized to the student. Reference actual skills they have that match the job requirements. Do not include placeholder text like [Company Name] - use the actual values provided.`;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const letter = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ letter });
  } catch (err) {
    console.error('[careers/cover-letter]', err);
    return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 });
  }
}
