/**
 * Verifies an hCaptcha token with the hCaptcha API.
 * Returns true if valid (or if either key is not configured — dev mode / misconfiguration).
 */
export async function verifyHcaptcha(token: string | undefined): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET_KEY;
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  // Skip verification if either key is missing — widget won't have shown so no token exists
  if (!secret || !siteKey) {
    console.log('[captcha] Skipping verification — keys not fully configured (secret:', !!secret, 'siteKey:', !!siteKey, ')');
    return true;
  }

  if (!token) {
    console.log('[captcha] No token provided — rejecting');
    return false;
  }

  try {
    const res = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    });

    const data = await res.json() as { success: boolean; 'error-codes'?: string[] };
    console.log('[captcha] hCaptcha response:', JSON.stringify(data));
    return data.success === true;
  } catch (err) {
    // If hCaptcha's servers are unreachable, don't block form submissions
    console.error('[captcha] hCaptcha verification request failed:', err);
    return true;
  }
}
