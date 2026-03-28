import { MetadataRoute } from 'next';

const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://lc3.up.railway.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/login', '/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
