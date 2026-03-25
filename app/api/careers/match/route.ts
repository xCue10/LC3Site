import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { CareerProfile, Job } from '@/app/careers/types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-sonnet-4-20250514';

export async function POST(req: NextRequest) {
  try {
    const { profile, jobs } = await req.json() as { profile: CareerProfile; jobs: Job[] };

    if (!profile || !jobs?.length) {
      return NextResponse.json({ error: 'Missing profile or jobs' }, { status: 400 });
    }

    const profileSummary = `
Name: ${profile.fullName}
Major: ${profile.major} at CSN
Year: ${profile.year}, graduating ${profile.graduationDate}
Skills: ${profile.skills.map((s) => `${s.name} (${s.level})`).join(', ')}
Job Types Wanted: ${profile.jobTypes.join(', ')}
Industries: ${profile.industries.join(', ')}
Location Preference: ${profile.preferredLocation}
Salary Range: $${profile.salaryMin.toLocaleString()} - $${profile.salaryMax.toLocaleString()}
Dream Job: ${profile.dreamJob}
    `.trim();

    // Analyze first 10 jobs only to keep API costs bounded
    const BATCH = 10;
    const enriched: Job[] = [];

    for (let i = 0; i < Math.min(jobs.length, 10); i += BATCH) {
      const batch = jobs.slice(i, i + BATCH);
      const jobsList = batch
        .map((j, idx) => `[${idx}] ${j.title} at ${j.company} | ${j.location} | ${j.jobType.join(', ')}\nDescription: ${j.description.slice(0, 300)}`)
        .join('\n\n');

      const prompt = `You are an AI career coach for LC3 Club members at the College of Southern Nevada (CSN).

STUDENT PROFILE:
${profileSummary}

JOBS TO ANALYZE:
${jobsList}

For each job [0] through [${batch.length - 1}], respond with EXACTLY this JSON format per job on separate lines:
{"idx":0,"score":85,"reason":"One sentence explaining match","gaps":["skill1","skill2"]}

Rules:
- score: 0-100 integer based on skill match, job type preference, industry, salary, location
- reason: exactly one sentence, specific and encouraging
- gaps: array of 1-3 specific skills the student is missing for this job
- If student has no relevant skills, score should be 10-30
- Government/Federal jobs get +10 if student listed Government/Federal as preference
- Remote jobs get +5 if Remote is in their job types

Respond with ONLY the JSON lines, no other text.`;

      try {
        const response = await anthropic.messages.create({
          model: MODEL,
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        });

        const text = response.content[0].type === 'text' ? response.content[0].text : '';
        const lines = text.trim().split('\n').filter((l) => l.trim().startsWith('{'));

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line) as { idx: number; score: number; reason: string; gaps: string[] };
            const job = batch[parsed.idx];
            if (job) {
              enriched.push({
                ...job,
                matchScore: Math.max(0, Math.min(100, parsed.score)),
                matchReason: parsed.reason,
                skillGaps: parsed.gaps ?? [],
              });
            }
          } catch {
            // If parsing fails for a line, push job without enrichment
            const fallbackJob = batch[lines.indexOf(line)];
            if (fallbackJob) enriched.push(fallbackJob);
          }
        }

        // Add any jobs not returned by AI
        for (let j = 0; j < batch.length; j++) {
          if (!enriched.find((e) => e.id === batch[j].id)) {
            enriched.push(batch[j]);
          }
        }
      } catch {
        enriched.push(...batch);
      }
    }

    // Add remaining jobs (beyond the 10 we analyzed) without enrichment
    if (jobs.length > 10) {
      enriched.push(...jobs.slice(10));
    }

    // Sort by match score descending
    enriched.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));

    return NextResponse.json({ jobs: enriched });
  } catch (err) {
    console.error('[careers/match]', err);
    return NextResponse.json({ error: 'Failed to analyze jobs' }, { status: 500 });
  }
}
