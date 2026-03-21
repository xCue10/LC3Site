/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevent clickjacking — no one can embed this site in an iframe
  { key: 'X-Frame-Options', value: 'DENY' },
  // Stop browsers from MIME-sniffing the content type
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Control how much referrer info is sent with requests
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable browser features the site doesn't use
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()' },
  // Force HTTPS for 2 years, include subdomains
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Enable DNS prefetching for performance
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js requires unsafe-inline and unsafe-eval for its runtime scripts
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Inline styles are used throughout (Tailwind + style props)
      "style-src 'self' 'unsafe-inline'",
      // Images can come from any HTTPS source (member avatars, etc.)
      "img-src 'self' data: https: blob:",
      // Fonts
      "font-src 'self' data:",
      // API calls are all same-origin
      "connect-src 'self'",
      // No plugins or embedded objects
      "object-src 'none'",
      "media-src 'none'",
      // Prevent this site from being framed anywhere
      "frame-ancestors 'none'",
      // Only allow forms to submit to same origin
      "form-action 'self'",
      // Restrict base tag to same origin
      "base-uri 'self'",
    ].join('; '),
  },
];

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
