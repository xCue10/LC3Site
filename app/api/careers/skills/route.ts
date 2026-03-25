import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { CareerProfile } from '@/app/careers/types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-sonnet-4-20250514';

export async function POST(req: NextRequest) {
  try {
    const { profile, targetRoles } = await req.json() as {
      profile: CareerProfile;
      targetRoles: string[];
    };

    const currentSkills = profile.skills.map((s) => `${s.name} (${s.level})`).join(', ') || 'None listed';

    const prompt = `You are a tech career advisor for CSN (College of Southern Nevada) students.

Student Profile:
- Skills: ${currentSkills}
- Target Industries: ${profile.industries.join(', ')}
- Job Types: ${profile.jobTypes.join(', ')}
- Dream Job: ${profile.dreamJob}
- Target Roles: ${targetRoles.join(', ')}

Analyze skill gaps and create a personalized learning roadmap. Respond with EXACTLY this JSON:
{
  "skillGaps": [
    {
      "skill": "AWS",
      "importance": "Critical",
      "whyMatters": "AWS is required in 67% of cloud and DevOps job postings",
      "jobsUnlocked": 23,
      "timeToLearn": "2-3 months",
      "resources": [
        {"name": "AWS Cloud Practitioner (Free Tier)", "url": "https://aws.amazon.com/training/digital/", "type": "Official"},
        {"name": "AWS for Beginners", "url": "https://www.youtube.com/results?search_query=aws+beginners", "type": "YouTube"},
        {"name": "AWS on Microsoft Learn", "url": "https://learn.microsoft.com/en-us/training/", "type": "Free Course"}
      ]
    }
  ],
  "roadmap": [
    {
      "phase": 1,
      "title": "Foundation (Month 1-2)",
      "skills": ["Git", "Linux basics"],
      "goal": "Build core competencies needed for any tech role"
    }
  ],
  "marketDemand": [
    {"skill": "Python", "demandScore": 92, "hasSkill": false},
    {"skill": "JavaScript", "demandScore": 88, "hasSkill": true},
    {"skill": "AWS", "demandScore": 85, "hasSkill": false},
    {"skill": "SQL", "demandScore": 80, "hasSkill": false},
    {"skill": "Cybersecurity", "demandScore": 78, "hasSkill": false},
    {"skill": "React", "demandScore": 75, "hasSkill": false},
    {"skill": "Docker", "demandScore": 70, "hasSkill": false},
    {"skill": "Azure", "demandScore": 68, "hasSkill": false},
    {"skill": "Linux", "demandScore": 65, "hasSkill": false},
    {"skill": "TypeScript", "demandScore": 62, "hasSkill": false}
  ],
  "summary": "Based on your target roles, here are your most impactful skill gaps to close."
}

For hasSkill in marketDemand, check if the student has that skill in their profile.
List 5-8 skill gaps ordered by importance (Critical > High > Medium).
For resources, use real free learning platforms: Coursera, YouTube, Microsoft Learn, freeCodeCamp, CISA, etc.
Phase roadmap should have 3-4 phases.`;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2500,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to analyze skills' }, { status: 500 });
    }

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (err) {
    console.error('[careers/skills]', err);
    return NextResponse.json({ error: 'Failed to analyze skill gaps' }, { status: 500 });
  }
}
