import { NextResponse } from 'next/server';
import type { Job } from '@/app/careers/types';

const CACHE_MINUTES = 30;
const jobsCache: { jobs: Job[]; fetchedAt: number } = { jobs: [], fetchedAt: 0 };

async function fetchUSAJobs(): Promise<Job[]> {
  try {
    const apiKey = process.env.USAJOBS_API_KEY;
    const email = process.env.USAJOBS_EMAIL || 'lc3careers@csn.edu';
    if (!apiKey) return [];

    const params = new URLSearchParams({
      Keyword: 'information technology cybersecurity software developer',
      ResultsPerPage: '50',
      Fields: 'min',
    });

    const res = await fetch(`https://data.usajobs.gov/api/search?${params}`, {
      headers: {
        'Host': 'data.usajobs.gov',
        'User-Agent': email,
        'Authorization-Key': apiKey,
      },
      next: { revalidate: CACHE_MINUTES * 60 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    const items = data?.SearchResult?.SearchResultItems ?? [];

    return items.map((item: Record<string, unknown>) => {
      const d = item.MatchedObjectDescriptor as Record<string, unknown>;
      const remuneration = (d.RemunSalaryArray as Record<string, unknown>[])?.[0];
      const salary = remuneration
        ? `$${Number(remuneration.MinimumRange ?? 0).toLocaleString()} – $${Number(remuneration.MaximumRange ?? 0).toLocaleString()}`
        : undefined;

      return {
        id: `usajobs-${d.PositionID}`,
        title: String(d.PositionTitle ?? ''),
        company: String(d.OrganizationName ?? 'U.S. Government'),
        location: String((d.PositionLocation as Record<string, unknown>[])?.[0]?.LocationName ?? 'United States'),
        salary,
        description: String((d.UserArea as Record<string, Record<string, string>> | undefined)?.Details?.JobSummary ?? d.QualificationSummary ?? ''),
        url: String(d.PositionURI ?? ''),
        jobType: ['Government/Federal', 'Full-time'],
        source: 'usajobs' as const,
        postedAt: String(d.PublicationStartDate ?? ''),
        tags: ['Federal', 'Government'],
      } satisfies Job;
    });
  } catch {
    return [];
  }
}

async function fetchRemotive(): Promise<Job[]> {
  try {
    const res = await fetch('https://remotive.com/api/remote-jobs?category=software-dev&limit=50', {
      next: { revalidate: CACHE_MINUTES * 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const jobs = data?.jobs ?? [];

    return jobs.map((j: Record<string, unknown>) => ({
      id: `remotive-${j.id}`,
      title: String(j.title ?? ''),
      company: String(j.company_name ?? ''),
      location: String(j.candidate_required_location ?? 'Remote'),
      salary: String(j.salary ?? '') || undefined,
      description: String(j.description ?? '').replace(/<[^>]*>/g, '').slice(0, 1000),
      url: String(j.url ?? ''),
      jobType: ['Remote'],
      source: 'remotive' as const,
      postedAt: String(j.publication_date ?? ''),
      tags: (j.tags as string[] | undefined) ?? [],
    } satisfies Job));
  } catch {
    return [];
  }
}

async function fetchArbeitnow(): Promise<Job[]> {
  try {
    const res = await fetch('https://www.arbeitnow.com/api/job-board-api?page=1', {
      next: { revalidate: CACHE_MINUTES * 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const jobs = data?.data ?? [];

    return jobs.slice(0, 50).map((j: Record<string, unknown>) => ({
      id: `arbeitnow-${j.slug}`,
      title: String(j.title ?? ''),
      company: String(j.company_name ?? ''),
      location: String(j.location ?? ''),
      salary: undefined,
      description: String(j.description ?? '').replace(/<[^>]*>/g, '').slice(0, 1000),
      url: String(j.url ?? ''),
      jobType: (j.remote as boolean) ? ['Remote'] : ['Full-time'],
      source: 'arbeitnow' as const,
      postedAt: j.created_at ? new Date(Number(j.created_at) * 1000).toISOString() : '',
      tags: (j.tags as string[] | undefined) ?? [],
    } satisfies Job));
  } catch {
    return [];
  }
}

export async function GET() {
  const now = Date.now();
  if (jobsCache.jobs.length > 0 && now - jobsCache.fetchedAt < CACHE_MINUTES * 60 * 1000) {
    return NextResponse.json({ jobs: jobsCache.jobs, fetchedAt: jobsCache.fetchedAt, cached: true });
  }

  const [usaJobs, remotive, arbeitnow] = await Promise.allSettled([
    fetchUSAJobs(),
    fetchRemotive(),
    fetchArbeitnow(),
  ]);

  const jobs: Job[] = [
    ...(usaJobs.status === 'fulfilled' ? usaJobs.value : []),
    ...(remotive.status === 'fulfilled' ? remotive.value : []),
    ...(arbeitnow.status === 'fulfilled' ? arbeitnow.value : []),
  ];

  jobsCache.jobs = jobs;
  jobsCache.fetchedAt = now;

  return NextResponse.json({ jobs, fetchedAt: now, cached: false });
}
