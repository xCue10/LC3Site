import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-sonnet-4-20250514';

export async function POST(req: NextRequest) {
  try {
    const { resumeText, targetRole } = await req.json() as { resumeText: string; targetRole?: string };

    if (!resumeText?.trim()) {
      return NextResponse.json({ error: 'No resume text provided' }, { status: 400 });
    }

    const prompt = `You are an expert resume coach and ATS specialist. Analyze this resume from a college student at the College of Southern Nevada (CSN) who is pursuing tech roles.

${targetRole ? `TARGET ROLE: ${targetRole}` : ''}

RESUME TEXT:
${resumeText.slice(0, 3000)}

Provide a thorough analysis in this EXACT JSON format:
{
  "overallScore": "B+",
  "atsScore": 72,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "missingKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "extractedSkills": ["skill1", "skill2", "skill3"],
  "improvedBullets": [
    {"original": "Did stuff with computers", "improved": "Developed and deployed 3 web applications using React and Node.js, reducing load time by 40%"},
    {"original": "Helped team", "improved": "Collaborated with 5-person agile team to deliver sprint goals, participating in daily standups and code reviews"}
  ],
  "sectionFeedback": {
    "summary": "Feedback on the summary/objective section",
    "experience": "Feedback on work experience section",
    "skills": "Feedback on skills section",
    "education": "Feedback on education section",
    "projects": "Feedback on projects section"
  },
  "overallFeedback": "2-3 sentence overall assessment and top priorities for improvement"
}

Scoring guide for overallScore: A (exceptional), B (good), C (average), D (needs work), F (major issues). Add + or - for nuance.
ATS score 0-100: how well it will pass Applicant Tracking Systems.
Be specific, actionable, and encouraging but honest.`;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse analysis' }, { status: 500 });
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json(analysis);
  } catch (err) {
    console.error('[careers/resume]', err);
    return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 });
  }
}
