/**
 * Verifies an hCaptcha token with the hCaptcha API.
 * Returns true if valid (or if either key is not configured — dev mode / misconfiguration).
 */
export async function verifyHcaptcha(token: string | undefined): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET_KEY;
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  // Skip verification if either key is missing — widget won't have shown so no token exists
  if (!secret || !siteKey) return true;

  if (!token) return false;

  const res = await fetch('https://hcaptcha.com/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  });

  const data = await res.json() as { success: boolean };
  return data.success === true;
}
