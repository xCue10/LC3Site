import { MetadataRoute } from 'next';

const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://lc3.up.railway.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/members', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/events', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/projects', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/resources', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/gallery', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/careers', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/shield', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/hire', priority: 0.8, changeFrequency: 'monthly' as const },
  ];

  return staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
