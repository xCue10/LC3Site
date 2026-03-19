/**
 * Verifies an hCaptcha token with the hCaptcha API.
 * Returns true if valid (or if HCAPTCHA_SECRET_KEY is not configured — dev mode).
 */
export async function verifyHcaptcha(token: string | undefined): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET_KEY;
  if (!secret) return true; // Skip verification in dev when not configured

  if (!token) return false;

  const res = await fetch('https://hcaptcha.com/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  });

  const data = await res.json() as { success: boolean };
  return data.success === true;
}
