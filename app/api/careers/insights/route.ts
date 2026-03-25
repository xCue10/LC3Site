import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-sonnet-4-20250514';

// Cache insights for 1 hour
let insightsCache: { data: unknown; fetchedAt: number } | null = null;
const CACHE_MS = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const { skills, industries, jobData } = await req.json() as {
      skills: string[];
      industries: string[];
      jobData: { titles: string[]; tags: string[] };
    };

    const now = Date.now();
    if (insightsCache && now - insightsCache.fetchedAt < CACHE_MS) {
      return NextResponse.json(insightsCache.data);
    }

    const topTags = [...new Set(jobData.tags)].slice(0, 30).join(', ');
    const topTitles = [...new Set(jobData.titles)].slice(0, 20).join(', ');

    const prompt = `You are a tech job market analyst. Based on current job market data for Las Vegas, NV and remote tech roles, provide market insights.

Current job data context:
- Common job titles in current listings: ${topTitles || 'Software Engineer, IT Specialist, Cybersecurity Analyst'}
- Common tags/skills in listings: ${topTags || 'JavaScript, Python, AWS, React, SQL'}
- Student's skills: ${skills.join(', ') || 'None specified'}
- Student's target industries: ${industries.join(', ') || 'Technology'}

Respond with EXACTLY this JSON format:
{
  "topSkills": [
    {"skill": "Python", "demand": 92, "avgSalary": "$85,000", "trend": "rising"},
    {"skill": "AWS", "demand": 88, "avgSalary": "$95,000", "trend": "rising"},
    {"skill": "Cybersecurity", "demand": 85, "avgSalary": "$90,000", "trend": "rising"},
    {"skill": "React", "demand": 82, "avgSalary": "$80,000", "trend": "stable"},
    {"skill": "SQL", "demand": 78, "avgSalary": "$72,000", "trend": "stable"},
    {"skill": "Azure", "demand": 75, "avgSalary": "$88,000", "trend": "rising"},
    {"skill": "Docker", "demand": 70, "avgSalary": "$85,000", "trend": "rising"},
    {"skill": "TypeScript", "demand": 68, "avgSalary": "$82,000", "trend": "rising"},
    {"skill": "Linux", "demand": 65, "avgSalary": "$78,000", "trend": "stable"},
    {"skill": "Kubernetes", "demand": 60, "avgSalary": "$98,000", "trend": "rising"}
  ],
  "salaryByRole": [
    {"role": "Junior Software Engineer", "lasVegas": "$62,000", "remote": "$75,000"},
    {"role": "IT Support Specialist", "lasVegas": "$45,000", "remote": "$52,000"},
    {"role": "Cybersecurity Analyst", "lasVegas": "$72,000", "remote": "$88,000"},
    {"role": "Cloud Engineer", "lasVegas": "$85,000", "remote": "$105,000"},
    {"role": "Data Analyst", "lasVegas": "$58,000", "remote": "$72,000"},
    {"role": "DevOps Engineer", "lasVegas": "$88,000", "remote": "$110,000"}
  ],
  "trendingCategories": [
    {"category": "AI/ML Integration", "growth": "+45%", "description": "Companies adding AI to existing products"},
    {"category": "Cloud Security", "growth": "+38%", "description": "Securing cloud infrastructure"},
    {"category": "Federal IT Modernization", "growth": "+32%", "description": "Government digital transformation"},
    {"category": "Remote DevOps", "growth": "+28%", "description": "Infrastructure automation from anywhere"}
  ],
  "federalMarket": "The federal cybersecurity job market is growing rapidly. DHS, DoD, and GSA are actively hiring. DoD SkillBridge and Pathways programs are great entry points for students. Security clearances are highly valued — even applying begins the process.",
  "topCompaniesHiring": [
    {"company": "Booz Allen Hamilton", "type": "Federal Contractor", "hiring": "Cybersecurity, Cloud"},
    {"company": "SAIC", "type": "Federal Contractor", "hiring": "IT, Systems Engineering"},
    {"company": "Amazon/AWS", "type": "Tech", "hiring": "Cloud, Software Engineering"},
    {"company": "Switch (Las Vegas)", "type": "Data Center", "hiring": "Networking, Cloud"},
    {"company": "Nevada State Government", "type": "Government", "hiring": "IT Support, Cybersecurity"},
    {"company": "UNLV/CSN", "type": "Education", "hiring": "IT Support, Systems Admin"}
  ],
  "marketSummary": "The Las Vegas tech market is growing with major data center expansions and government IT modernization. Remote opportunities are abundant for skilled candidates. Federal roles offer stability and competitive salaries."
}

Use realistic 2025 salary data for Las Vegas, NV. Demand scores are 0-100.`;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
    }

    const data = JSON.parse(jsonMatch[0]);
    insightsCache = { data, fetchedAt: now };
    return NextResponse.json(data);
  } catch (err) {
    console.error('[careers/insights]', err);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
}
